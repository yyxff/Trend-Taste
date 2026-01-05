import { Client } from "discord.js";
import { deployCommands } from "../src/deploy-commands";
import { commands } from "../src/commands/index";
import { discordConfig } from "../src/config";
import { runGithubTrendingTask } from "../src/tasks/github-trending";
import { logger } from "../src/utils/logger";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", () => {
    logger.info("[TEST] Discord bot is ready! 🤖");
    runGithubTrendingTask(client, process.env.TEST_CHANNEL_ID!, "EN");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || !interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(discordConfig.DISCORD_TOKEN);
