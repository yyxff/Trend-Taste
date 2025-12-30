import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { disableTask } from "../../services/task.service";
import { logger } from "../../utils/logger";

export const data = new SlashCommandBuilder()
    .setName("disable")
    .setDescription("Disables the scheduled task for this channel");
    
export async function execute(interaction: CommandInteraction) {
    const cmdlogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdlogger.info("Command invoked");
    try {
        const channelId = interaction.channelId;
        await disableTask(channelId);
        cmdlogger.info("Command executed successfully");
        return interaction.reply(`Disabled the scheduled task for this channel.`);
    } catch (error) {
        cmdlogger.error({error}, "Command execution failed");
        return interaction.reply(`Failed to disable the scheduled task for this channel.`);
    }
}