import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { LanguageType } from "@prisma/client";
import { setTaskLanguage } from "../../services/task.service";

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
    const language = interaction.options.getString("language", true);
    await setTaskLanguage(interaction.channelId, language as LanguageType);
    await interaction.reply(`Language has been set to ${language}`);
}
