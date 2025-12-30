import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { disableTask } from "../../services/task.service";


export const data = new SlashCommandBuilder()
    .setName("disable")
    .setDescription("Disables the scheduled task for this channel");
    
export async function execute(interaction: CommandInteraction) {
    const channelId = interaction.channelId;
    try {
        const task = await disableTask(channelId);
        return interaction.reply(`Disabled the scheduled task for this channel.`);
    } catch (error) {
        console.error('Error disabling task:', error);
        return interaction.reply(`Failed to disable the scheduled task for this channel.`);
    }
}