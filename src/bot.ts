import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/index";
import { discordConfig } from "./config";
import { initBot } from "./bootstrap/init-bot";
import { logger } from "./utils/logger";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", async () => {
    await initBot(client);    
    logger.info("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    logger.debug({interactionId: interaction.id}, "Interaction received");
    if (!interaction.isCommand() || !interaction.isChatInputCommand()) {
        logger.error({interactionType: interaction.type}, "Unsupported interaction type.");
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    } else {
        logger.error({commandName}, "No command found");
    }
});

client.login(discordConfig.DISCORD_TOKEN);
