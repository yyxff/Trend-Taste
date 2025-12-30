import { addTask } from "../scheduled/scheduler";
import { getAllEnabledTasks } from "../services/task.service";
import { Client } from "discord.js";
import { deployCommands } from "../deploy-commands";

/**
 * Initialize the bot:
 * - Initialize tasks
 * - Deploy commands to all guilds
 * @param client 
 */
export async function initBot(client: Client) {
    await Promise.all([
        initTasks(),
        deployCommandsToAllGuilds(client),
    ]);
}

/**
 * Initialize all enabled tasks
 */
async function initTasks() {
    const enabledTasks = await getAllEnabledTasks();
    enabledTasks.forEach(task => {
        addTask(task.id, `${task.schedule!.getMinutes()} ${task.schedule!.getHours()} * * *`, task.timezone!);
    });
}

/**
 * Deploy commands to all guilds
 * @param client 
 */
async function deployCommandsToAllGuilds(client: Client) {
    await Promise.all(client.guilds.cache.map(async (guild) => {
        console.log(`Deploying commands to guild: ${guild.name} (${guild.id})`);
        await deployCommands({ guildId: guild.id });
    }));
}
