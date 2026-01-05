import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { disableTask } from "@services/task.service";
import { logger } from "@utils/logger";

export const data = new SlashCommandBuilder()
    .setName("disable")
    .setDescription("Disables the scheduled task for this channel");
    
export async function execute(interaction: CommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const channelId = interaction.channelId;
        await disableTask(channelId);
        cmdLogger.info("Command executed successfully");
        return interaction.reply(`Disabled the scheduled task for this channel.`);
    } catch (error) {
        cmdLogger.error({err: error}, "Command execution failed");
        return interaction.reply(`Failed to disable the scheduled task for this channel.`);
    }
}