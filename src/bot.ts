import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/index";
import { discordConfig } from "./config";
import { initBot } from "./bootstrap/init-bot";
import { logger } from "./utils/logger";
import { handleButton } from "./handlers/button-handler";

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
    if (interaction.isButton()) {
        // Handle button interactions here
        logger.info({customId: interaction.customId, interactionType: interaction.type}, "Button interaction received.");
        await handleButton(interaction);
    } else if (interaction.isChatInputCommand()) {
        // Handle slash command interactions here
        const { commandName } = interaction;
        if (commands[commandName as keyof typeof commands]) {
            await commands[commandName as keyof typeof commands].execute(interaction);
        } else {
            logger.error({commandName}, "No command found");
        }
    } else {
        // Unsupported interaction type
        logger.error({interactionType: interaction.type}, "Unsupported interaction type.");
        return;
    }
});

client.login(discordConfig.DISCORD_TOKEN);
