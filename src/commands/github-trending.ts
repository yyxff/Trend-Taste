import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { runGithubTrendingTask } from "../tasks/github-trending";

export const data = new SlashCommandBuilder()
    .setName("github_trending")
    .setDescription("Fetches the trending repositories from GitHub");

export async function execute(interaction: CommandInteraction) {
    runGithubTrendingTask(interaction.client);
    await interaction.reply("Fetching the trending repositories from GitHub...");
}
