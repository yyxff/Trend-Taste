import cron from "node-cron";
import { Client, EmbedBuilder } from "discord.js";
import { config } from "../config";
import { parseRepoListFromRSS, parseRepoMeta } from "../parser/repo-parser";
import { fetchGithubTrending } from "../utils/github-rss-api";
import { fetchRepoMeta } from "../utils/github-api";
import { Repo } from "../models/Repo";


/**
 * Runs the github trending task
 * 1. Get trending repositories from github rss api
 *    Prepare them with meta information from github api
 * 2. Pushes the trending repositories to the channel
 * @param client discord client
 */
export async function runGithubTrendingTask(client: Client) {
    try {
        const repoList = await prepareTrendingRepos();
        pushTrendingToChannel(client, repoList);
    } catch (error) {
        console.error(error);
    }
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
async function pushTrendingToChannel(client: Client, repoList: Repo[]) {
    const channel = await client.channels.fetch(config.DISCORD_CHANNEL_ID);
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
function formatRepoListToEmbed(repoList: Repo[]): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('GitHub Trending Repositories')
        .setTimestamp()
        .setFooter({ text: 'Trend Taste', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' });

    repoList.forEach(repo => {
        const title = `${repo.owner}/${repo.name}`;
        const description = repo.description ? (repo.description.length > 200 ? repo.description.substring(0, 200) + '...' : repo.description) : 'No description';
        const value = `[View on GitHub](${repo.link})\n⭐ ${repo.stars || 0} | 𐂐 ${repo.forks || 0} | </> ${repo.language || 'Unknown'}\n${description}\n`;

        embed.addFields({ name: title, value: value });
    });

    return embed;
}

/**
 * Splits the repo list into chunks
 * @param repoList repo list
 * @param size chunk size
 * @returns chunked repo list
 */
function splitRepoList(repoList: Repo[], size: number): Repo[][] {
    const result: Repo[][] = [];
    for (let i = 0; i < repoList.length; i += size) {
        result.push(repoList.slice(i, i + size));
    }
    return result;
}
