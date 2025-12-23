import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/index";
import { discordConfig } from "./config";
import { launchGithubTrendingTask } from "./scheduled/github-trending";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", () => {
    console.log("Discord bot is ready! 🤖");
    client.guilds.cache.forEach(async (guild) => {
        await deployCommands({ guildId: guild.id });
    });
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
