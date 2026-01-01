import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { LanguageType } from "@generated/client";
import { setTaskLanguage } from "@services/task.service";
import { logger } from "@utils/logger";

// Set your preferred language
export const data = new SlashCommandBuilder()
    .setName("set-language")
    .setDescription("Sets the preferred language for the bot")
    .addStringOption(option =>
        option
            .setName("language")
            .setDescription("The language to set (e.g., 'EN', 'ZH')")
            .setRequired(true)
            .addChoices(
                { name: "English", value: LanguageType.EN },
                { name: "Chinese", value: LanguageType.ZH }
            )
    );

// Get the preferred language and write it to the database
export async function execute(interaction: ChatInputCommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const language = interaction.options.getString("language", true);
        const channelId = interaction.channelId;
        await setTaskLanguage(channelId, language as LanguageType);
        cmdLogger.info("Command executed successfully");
        await interaction.reply(`Language has been set to ${language}`);
    } catch (error) {
        cmdLogger.error({err: error}, "Command execution failed");
        await interaction.reply({ content: `Failed to set language. Please try again later.`, flags: MessageFlags.Ephemeral });
    }
}
