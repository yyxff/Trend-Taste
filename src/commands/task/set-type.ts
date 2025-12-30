import { MessageFlags } from "discord.js";
import { TaskType } from "@prisma/client";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { setTaskType } from "../../services/task.service";
import { logger } from "../../utils/logger";

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
    const cmdlogger = logger.child({command: `/${interaction.commandName}`, channelId: interaction.channelId})
    cmdlogger.info("Command invoked");
    try {
        const taskType = interaction.options.getString("task-type", true);
        await setTaskType(interaction.channelId, taskType as TaskType);
        cmdlogger.info("Task type set successfully");
        return interaction.reply({ content: `Task type set to ${taskType}`, flags: MessageFlags.Ephemeral });
    } catch (error) {
        cmdlogger.error({error}, "Error setting task type");
        const taskType = interaction.options.getString("task-type", true);
        return interaction.reply({ content: `Failed to set task type ${taskType}. Please try again or check the logs.`, flags: MessageFlags.Ephemeral });
    }
}
