import { MessageFlags } from "discord.js";
import { TaskType } from "@generated/client";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { setTaskType } from "@services/task.service";
import { logger } from "@utils/logger";

// Set your task type
export const data = new SlashCommandBuilder()
    .setName("set-type")
    .setDescription("Sets the task type of this channel")
    .addStringOption(option =>
        option
            .setName("task-type")
            .setDescription("The task type to set (e.g., 'GITHUB_TRENDING')")
            .setRequired(true)
            .addChoices(
                { name: "github trending", value: TaskType.GITHUB_TRENDING }
            )
    );

// Get the task type from user and write it to the database
export async function execute(interaction: ChatInputCommandInteraction) {
    const cmdLogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdLogger.info("Command invoked");
    try {
        const taskType = interaction.options.getString("task-type", true);
        await setTaskType(interaction.channelId, taskType as TaskType);
        cmdLogger.info("Task type set successfully");
        return interaction.reply({ content: `Task type set to ${taskType}`, flags: MessageFlags.Ephemeral });
    } catch (error) {
        cmdLogger.error({err: error}, "Error setting task type");
        const taskType = interaction.options.getString("task-type", true);
        return interaction.reply({ content: `Failed to set task type ${taskType}. Please try again or check the logs.`, flags: MessageFlags.Ephemeral });
    }
}
