import cron from "node-cron";
import { Client } from "discord.js";
import { runGithubTrendingTask } from "../tasks/github-trending";

/**
 * Launches a cron job that runs every 10am to push the trending repositories to the channel
 * @param client 
 */
export function launchGithubTrendingTask(client: Client) {
    cron.schedule('0 0 10 * * *', () => {
        console.log('running a task every 10am to fetch github trending repositories');
        runGithubTrendingTask(client)
    });
    console.log('launched github trending task');
}
