import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { enableTask } from "../../services/task.service";
import { logger } from "../../utils/logger";

export const data = new SlashCommandBuilder()
    .setName("enable")
    .setDescription("Enables the scheduled task for this channel");
    
export async function execute(interaction: CommandInteraction) {
    const cmdlogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdlogger.info("Command invoked");
    try {
        const channelId = interaction.channelId;
        await enableTask(channelId);
        cmdlogger.info("Command executed successfully");
        return interaction.reply(`Enabled the scheduled task for this channel.`);
    } catch (error) {
        cmdlogger.error({error}, "Command execution failed");
        return interaction.reply(`Failed to enable the scheduled task for this channel.`);
    }
}