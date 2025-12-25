import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Language } from "../constants/language";
import { updatePreferenceLanguage } from "../repositories/preference.repo";

// Set your preferred language
export const data = new SlashCommandBuilder()
    .setName("language")
    .setDescription("Sets the preferred language for the bot")
    .addStringOption(option =>
        option
            .setName("language")
            .setDescription("The language to set (e.g., 'EN', 'ZH')")
            .setRequired(true)
            .addChoices(
                { name: "English", value: "EN" },
                { name: "Chinese", value: "ZH" }
            )
    );

// Get the preferred language and write it to the database
export async function execute(interaction: ChatInputCommandInteraction) {
    const language = interaction.options.getString("language", true);
    if (!(language in Language)) {
        return interaction.reply({ content: `Unsupported language: ${language}`, ephemeral: true });
    }
    await updatePreferenceLanguage(interaction.channelId, language as Language);
    await interaction.reply(`Language has been set to ${language}`);
}
