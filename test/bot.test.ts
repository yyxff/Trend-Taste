import { Client } from "discord.js";
import { deployCommands } from "../src/deploy-commands";
import { commands } from "../src/commands/index";
import { discordConfig } from "../src/config";
import { runGithubTrendingTask } from "../src/tasks/github-trending";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", () => {
    console.log("[TEST] Discord bot is ready! 🤖");
    runGithubTrendingTask(client);
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(discordConfig.DISCORD_TOKEN);
