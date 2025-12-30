import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/index";
import { discordConfig } from "./config";
import { initBot } from "./bootstrap/init-bot";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", async () => {
    await initBot(client);    
    console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    console.log("Interaction received:", interaction.id);
    if (!interaction.isCommand() || !interaction.isChatInputCommand()) {
        console.error("Unsupported interaction type.");
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    } else {
        console.error(`No command found for: ${commandName}`);
    }
});

client.login(discordConfig.DISCORD_TOKEN);
