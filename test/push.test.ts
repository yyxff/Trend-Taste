import { Client } from "discord.js";
import { deployCommands } from "../src/deploy-commands";
import { commands } from "../src/commands/index";
import { discordConfig } from "../src/config";
import { pushTrendingToChannel } from "../src/tasks/github-trending";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", () => {
    console.log("[TEST] Discord bot is ready! 🤖");
    const fineRepoList = [
        {
            owner: "facebook",
            name: "react",
            stars: 1,
            forks: 1,
            watchings: 1,
            language: "language",
            description: "description",
            readme: "readme",
            link: "link",
            topics: ["topic"],
            Recommendation: "recommendation"
        }
    ];
    pushTrendingToChannel(client, fineRepoList);
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
