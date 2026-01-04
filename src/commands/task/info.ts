import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "@utils/logger";
import { getTaskByChannelId } from "@repo/task.repo";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Provides information about current task configuration for this channel");

export async function execute(interaction: CommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const task = await getTaskByChannelId(interaction.channelId);
        if (!task) {
            cmdLogger.warn("No task configured for this channel");
            return interaction.reply("No task configured for this channel. Please set up a task first by /set-type.");
        }
        // cmdLogger.info({task}, "Retrieved task information");
        const taskReady = task.taskType && task.language && task.schedule && task.timezone;
        const taskInfo = `Task Type: ${task.taskType || "Not set"}\n`
            +`Language: ${task.language || "Not set"}\n`
            +`Schedule: ${task.schedule ? task.schedule.getHours().toString().padStart(2, '0') + ":" + task.schedule.getMinutes().toString().padStart(2, '0') : "Not set"}\n`
            +`Timezone: ${task.timezone || "Not set"}\n`
            +`Ready to enable: ${taskReady ? "Yes" : "No"}\n`
            +`Enabeld: ${task.enabled ? "Yes" : "No"}`;
        return interaction.reply(taskInfo);
    } catch (error) {
        cmdLogger.error({err: error}, "Error in info command");
        return interaction.reply("Error retrieving task information. Please try again later.");
    }
}