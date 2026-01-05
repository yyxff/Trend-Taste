import { Client } from "discord.js";
import { deployCommands } from "../src/deploy-commands";
import { commands } from "../src/commands/index";
import { discordConfig } from "../src/config";
import { pushTrendingToChannel, formatRepoToEmbed } from "../src/tasks/github-trending";
import { logger } from "../src/utils/logger";
import type { FineRepoDto } from "../src/dtos/FineRepo.dto";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", () => {
    logger.info("[TEST] Discord bot is ready! 🤖");
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
            url: "https://github.com/anthropics/skills",
            topics: ["topic"],
            recommendation: "recommendation"
        }
    ] as FineRepoDto[];
    const embedList = fineRepoList.map(formatRepoToEmbed);
    pushTrendingToChannel(client, process.env.TEST_CHANNEL_ID!, embedList);
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
