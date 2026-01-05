import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getTaskByChannelId } from "@services/task.service";
import { logger } from "@utils/logger";
import { runTask } from "../../scheduled/runner";

export const data = new SlashCommandBuilder()
    .setName("run")
    .setDescription("Fetches the trending repositories from GitHub");

export async function execute(interaction: CommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const task = await getTaskByChannelId(interaction.channelId);
        if (!task) {
            cmdLogger.warn("No task configured for this channel");
            return interaction.reply("No task configured for this channel. Please set up a task first by /set-type.");
        }
        runTask(task.id);
        cmdLogger.info({ taskType: task.taskType }, "Task started successfully");
        return interaction.reply(`Task ${task.taskType} started. Check the channel for results shortly.`);
    } catch (error) {
        cmdLogger.error({err: error}, "Error in running task");
        return interaction.reply("Error retrieving task configuration. Please try again later.");
    }
}
