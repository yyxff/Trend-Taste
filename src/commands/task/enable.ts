import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { enableTask } from "@services/task.service";
import { logger } from "@utils/logger";

export const data = new SlashCommandBuilder()
    .setName("enable")
    .setDescription("Enables the scheduled task for this channel");
    
export async function execute(interaction: CommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const channelId = interaction.channelId;
        await enableTask(channelId);
        cmdLogger.info("Command executed successfully");
        return interaction.reply(`Enabled the scheduled task for this channel.`);
    } catch (error) {
        cmdLogger.error({err: error}, "Command execution failed");
        return interaction.reply(`Failed to enable the scheduled task for this channel.`);
    }
}