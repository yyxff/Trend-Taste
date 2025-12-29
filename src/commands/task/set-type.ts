import { MessageFlags } from "discord.js";
import { TaskType } from "@prisma/client";
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { setTaskType } from "../../services/task.service";

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
    console.log(`ChannelID: ${interaction.channelId} `);
    const taskType = interaction.options.getString("task-type", true);
    try {
        await setTaskType(interaction.channelId, taskType as TaskType);
        return interaction.reply({ content: `Task type set to ${taskType}`, flags: MessageFlags.Ephemeral });
    } catch (error) {
        console.error(`ChannelID: ${interaction.channelId} - Error setting task type:`, error);
        return interaction.reply({ content: `Failed to set task type ${taskType}. Please try again or check the logs.`, flags: MessageFlags.Ephemeral });
    }
}
