import cron from "node-cron";
import { Client } from "discord.js";
import { config } from "../config";
import { getRepoListFromRSS, parseRepoMeta } from "../parser/repo-parser";
import { fetchGithubTrending } from "../utils/github-rss-api";
import { fetchRepoMeta } from "../utils/github-api";
import { Repo } from "../models/Repo";


/**
 * Launches a cron job that runs every minute to push the trending repositories to the channel
 * @param client 
 */
export function launchGithubTrendingTask(client: Client) {
    cron.schedule('0 * * * * *', () => {
        console.log('running a task every minute');
        runGithubTrendingTask(client)
    });
    console.log('launched github trending task');
}

/**
 * Parse more information from github api into Repo objects
 * @returns repo list
 */
async function prepareTrendingRepos(): Promise<Repo[]> {
    const repoList = await getTrendingRepos();
    await Promise.all(repoList.map(async (repo) => {
        const meta = await fetchRepoMeta(repo.owner, repo.name);
        parseRepoMeta(meta, repo);
    }))
    return repoList;
}

/**
 * Get trending repositories from github rss api
 * @returns repo list
 */
async function getTrendingRepos(): Promise<Repo[]> {
    const rssData = await fetchGithubTrending();
    const repoList = getRepoListFromRSS(rssData);
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
        await channel.send(repoTuple.map((repo) => repo.summary()).join("\n"));
    }
}


function splitRepoList(repoList: Repo[], size: number): Repo[][] {
    const result: Repo[][] = [];
    for (let i = 0; i < repoList.length; i += size) {
        result.push(repoList.slice(i, i + size));
    }
    return result;
}


/**
 * Runs the github trending task
 * @param client discord client
 */
async function runGithubTrendingTask(client: Client) {
    try {
        const repoList = await prepareTrendingRepos();
        pushTrendingToChannel(client, repoList);
    } catch (error) {
        console.error(error);
    }
}

