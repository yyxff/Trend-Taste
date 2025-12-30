import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { enableTask } from "../../services/task.service";


export const data = new SlashCommandBuilder()
    .setName("enable")
    .setDescription("Enables the scheduled task for this channel");
    
export async function execute(interaction: CommandInteraction) {
    const channelId = interaction.channelId;
    try {
        const task = await enableTask(channelId);
        return interaction.reply(`Enabled the scheduled task for this channel.`);
    } catch (error) {
        console.error('Error enabling task:', error);
        return interaction.reply(`Failed to enable the scheduled task for this channel.`);
    }
}