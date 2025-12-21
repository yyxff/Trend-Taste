import cron from "node-cron";
import { Client } from "discord.js";
import { runGithubTrendingTask } from "../tasks/github-trending";

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
