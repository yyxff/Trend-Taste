import { Client, EmbedBuilder } from "discord.js";
import { parseRepoListFromRSS, parseRepoMeta } from "../parser/repo-parser";
import { fetchGithubTrending } from "../utils/github-rss-api";
import { fetchRepoMeta } from "../utils/github-api";
import type { Repo } from "../models/Repo";
import type { FineRepo } from "../models/FineRepo";
import { generate } from "../ai-api/gemini";
import { summary } from "../models/Repo";
import type { LanguageType } from "@prisma/client";
import { languagePromptMap } from "../constants/language";
import { logger } from "../utils/logger";

/**
 * Runs the github trending task
 * 1. Get trending repositories from github rss api
 *    Prepare them with meta information from github api
 * 2. Add recommendations based on AI to the repo list
 * 3. Prepare a brief summary for the whole repo list
 * 4. Build their embed format
 * 5. Pushes the embed message to the channel
 * @param client discord client
 */
export async function runGithubTrendingTask(client: Client, channelId: string, language: LanguageType) {
    try {
        const repoList = await prepareTrendingRepos();
        const fineRepoList = await prepareFineRepoList(repoList, language);
        const summary = await prepareSummary(fineRepoList, language);

        const embedSummary = formatSummaryToEmbed(summary);
        const embedRepo = fineRepoList.map(formatRepoToEmbed);

        await pushSummaryToChannel(client, channelId, embedSummary);
        await pushTrendingToChannel(client, channelId, embedRepo);
    } catch (error) {
        logger.error({error}, "Error running github trending task");
    }
}

/**
 * Prepare a brief summary for the whole repo list
 * @param repoList 
 * @returns summary string
 */
async function prepareSummary(repoList: FineRepo[], language: LanguageType): Promise<string> {
    const repoRecommendations = repoList.map(repo => repo.recommendation).join('\n');
    const prompt = `${languagePromptMap[language]}. Please give me a brief summary (within 100 words for the whole summary! You only need to include the most valuable information) for today's repositories: ${repoRecommendations}`;
    const summary = await generate(prompt);
    return summary;
}

/**
 * Add recommendations based on AI to the repo list
 * @param repoList repo list with basic information
 * @returns repo list with recommendations
 */
async function prepareFineRepoList(repoList: Repo[], language: LanguageType): Promise<FineRepo[]> {
    const fineRepoList = repoList.map(async (repo) => {
        const prompt = `${languagePromptMap[language]}. Please give me a brief recommendation (within 50 words) for this repository: ${summary(repo)}, ${repo.readme?.substring(0, 1500)}`;
        const recommendation = await generate(prompt);
        return {
            ...repo,
            recommendation: recommendation
        };
    });
    return Promise.all(fineRepoList);
}

/**
 * Get trending repositories from github rss api
 * Prepare them with meta information from github api
 * @returns repo list
 */
async function prepareTrendingRepos(): Promise<Repo[]> {
    const rssData = await fetchGithubTrending();
    const repoList = parseRepoListFromRSS(rssData);
    await Promise.all(repoList.map(async (repo) => {
        const meta = await fetchRepoMeta(repo.owner, repo.name);
        parseRepoMeta(meta, repo);
    }))
    return repoList;
}

/**
 * Pushes the trending repositories to the channel
 * @param client discord client
 * @param repoList repo list
 */
export async function pushTrendingToChannel(client: Client, channelId: string, repoList: EmbedBuilder[]) {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased() || !('send' in channel)) {
        throw new Error("Channel not found or not text based");
    }
    for (const repo of repoList) {
        await channel.send({ embeds: [repo] });
    }
}

/**
 * Pushes the summary to the channel
 * @param client discord client
 * @param summary summary string
 */
async function pushSummaryToChannel(client: Client, channelId: string, summary: EmbedBuilder) {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased() || !('send' in channel)) {
        throw new Error("Channel not found or not text based");
    }
    await channel.send({ embeds: [summary] });
}

/**
 * Formats the summary to an embed
 * @param summary summary string 
 * @returns embed
 */
function formatSummaryToEmbed(summary: string): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setAuthor({ 
            name: 'Trend-Taste bot', 
            iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            url: 'https://github.com/yyxff/Trend-Taste'
        })
        .setColor(0x00FF00)
        .setTitle('Trending Repositories Summary')
        .setDescription(summary)
        .setTimestamp()
        .setFooter({ text: 'Trend Taste', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' });
    return embed;
}

/**
 * Formats the repo list to an embed
 * @param repoList repo list
 * @returns embed
*/
export function formatRepoToEmbed(repo: FineRepo): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${repo.owner}/${repo.name}`)
        .setURL(repo.link)
        .setTimestamp()
        .setFooter({ text: 'Trend Taste', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' });


    const meta = `⭐ ${repo.stars || 0} | 𐂐 ${repo.forks || 0} | 👀 ${repo.watchings || 0} | </> ${repo.language || 'Unknown'}`;
    const description = repo.description ? (repo.description.length > 200 ? repo.description.substring(0, 200) + '...' : repo.description) : 'No description';
    const recommendation = repo.recommendation.substring(0, 1000);

    embed.addFields({ name: 'Stat', value: meta });
    embed.addFields({ name: 'Description', value: description });
    embed.addFields({ name: 'Recommendation', value: recommendation });
    // this image service is a 3rd-party one(https://github.com/miantiao-me/github-og-image)
    // thus it can be unstable
    embed.setImage(`https://github.html.zone/${repo.owner}/${repo.name}`)

    return embed;
}
