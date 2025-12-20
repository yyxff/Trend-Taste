import { Client } from "discord.js";
import { config } from "../config";
import cron from "node-cron";


/**
 * Launches a cron job that runs every minute to push the trending repositories to the channel
 * @param client 
 */
export function launchGithubTrendingTask(client: Client) {
    cron.schedule('0 * * * * *', () => {
        console.log('running a task every minute');
        pushTrendingToChannel(client);
    });
    console.log('launched github trending task');
}

/**
 * Pushes the trending repositories to the channel
 * @param client 
 */
async function pushTrendingToChannel(client: Client) {
    const channel = await client.channels.fetch(config.DISCORD_CHANNEL_ID);
    if (!channel || !channel.isTextBased() || !('send' in channel)) {
        console.error("Channel not found or not text based");
        return;
    }
    await channel.send("Hello");
}
