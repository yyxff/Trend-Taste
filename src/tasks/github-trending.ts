import cron from "node-cron";
import { Client, EmbedBuilder } from "discord.js";
import { discordConfig } from "../config";
import { parseRepoListFromRSS, parseRepoMeta } from "../parser/repo-parser";
import { fetchGithubTrending } from "../utils/github-rss-api";
import { fetchRepoMeta } from "../utils/github-api";
import type { Repo } from "../models/Repo";
import type { FineRepo } from "../models/FineRepo";
import { generate } from "../ai-api/gemini";
import { summary } from "../models/Repo";

/**
 * Runs the github trending task
 * 1. Get trending repositories from github rss api
 *    Prepare them with meta information from github api
 * 2. Add recommendations based on AI to the repo list
 * 3. Pushes the trending repositories to the channel
 * @param client discord client
 */
export async function runGithubTrendingTask(client: Client) {
    try {
        const repoList = await prepareTrendingRepos();
        const fineRepoList = await prepareFineRepoList(repoList);
        pushTrendingToChannel(client, fineRepoList);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Add recommendations based on AI to the repo list
 * @param repoList repo list with basic information
 * @returns repo list with recommendations
 */
async function prepareFineRepoList(repoList: Repo[]): Promise<FineRepo[]> {
    const fineRepoList = repoList.map(async (repo) => {
        const prompt = `Please give me a brief recommendation (within 100 words) for this repository: ${summary(repo)}, ${repo.readme?.substring(0, 1500)}`;
        const recommendation = await generate(prompt);
        return {
            ...repo,
            Recommendation: recommendation
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
export async function pushTrendingToChannel(client: Client, repoList: FineRepo[]) {
    const channel = await client.channels.fetch(discordConfig.DISCORD_CHANNEL_ID);
    if (!channel || !channel.isTextBased() || !('send' in channel)) {
        throw new Error("Channel not found or not text based");
    }
    for (const repoTuple of splitRepoList(repoList, 3)) {
        const embed = formatRepoListToEmbed(repoTuple);
        await channel.send({ embeds: [embed] });
    }
}

/**
 * Formats the repo list to an embed
 * @param repoList repo list
 * @returns embed
*/
function formatRepoListToEmbed(repoList: FineRepo[]): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('GitHub Trending Repositories')
        .setTimestamp()
        .setFooter({ text: 'Trend Taste', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' });

    repoList.forEach(repo => {
        const title = `${repo.owner}/${repo.name}`;
        const link = `[View on GitHub](${repo.link})`;

        const value = `⭐ ${repo.stars || 0} | 𐂐 ${repo.forks || 0} | 👀 ${repo.watchings || 0} | </> ${repo.language || 'Unknown'}`;
        const description = repo.description ? (repo.description.length > 200 ? repo.description.substring(0, 200) + '...' : repo.description) : 'No description';
        const recommendation = repo.Recommendation.substring(0, 1000);

        embed.addFields({ name: title, value: link });
        embed.addFields({ name: 'Description', value: description });
        embed.addFields({ name: 'Recommendation', value: recommendation });
        // this image service is a 3rd-party one(https://github.com/miantiao-me/github-og-image)
        // thus it can be unstable
        embed.setImage(`https://github.html.zone/${repo.owner}/${repo.name}`)
    });

    return embed;
}

/**
 * Splits the repo list into chunks
 * @param repoList repo list
 * @param size chunk size
 * @returns chunked repo list
 */
function splitRepoList(repoList: FineRepo[], size: number): FineRepo[][] {
    const result: FineRepo[][] = [];
    for (let i = 0; i < repoList.length; i += size) {
        result.push(repoList.slice(i, i + size));
    }
    return result;
}
