import type { ButtonInteraction } from "discord.js";
import { logger } from "@/utils/logger";
import { InteractionType } from "@generated/client";
import { recordUserInteraction } from "@/services/user-history.service";

type HandlerFn = (interaction: ButtonInteraction, action: string, repoId: bigint) => Promise<void>;

const handlers: Record<string, HandlerFn> = {
    'like': likeHandler,
    'dislike': dislikeHandler,
};

/**
 * Dispatches button interactions to their respective handlers
 * @param interaction 
 * @returns 
 */
export async function handleButton(interaction: ButtonInteraction) {
    const [action, repoIdStr] = interaction.customId.split('/');
    if (!action || !repoIdStr) {
        logger.error({customId: interaction.customId}, "Invalid button custom ID format.");
        return interaction.reply({ content: "There was an error processing your interaction.", ephemeral: true });
    }
    const handler = handlers[action as keyof typeof handlers];
    if (handler) {
        return handler(interaction, action, BigInt(repoIdStr));
    }
    return interaction.reply({ content: "Unknown action: " + action, ephemeral: true });
}

/**
 * Handles like button interactions
 * @param interaction 
 * @param action 
 * @param repoId 
 */
async function likeHandler(interaction: ButtonInteraction, action: string, repoId: bigint) {
    try {
        // Handle like action
        const userId = interaction.user.id;
        await recordUserInteraction(userId, repoId, InteractionType.LIKED);
        await interaction.reply({ content: "You liked this repository!", ephemeral: true });
    } catch (error) {
        logger.error({err: error}, "Error handling like interaction");
        await interaction.reply({ content: "There was an error processing your like.", ephemeral: true });
    }
}

/**
 * Handles dislike button interactions
 * @param interaction 
 * @param action 
 * @param repoId 
 */
async function dislikeHandler(interaction: ButtonInteraction, action: string, repoId: bigint) {
    try {
        // Handle dislike action
        const userId = interaction.user.id;
        await recordUserInteraction(userId, repoId, InteractionType.DISLIKED);
        await interaction.reply({ content: "You disliked this repository!", ephemeral: true });
    } catch (error) {
        logger.error({err: error}, "Error handling dislike interaction");
        await interaction.reply({ content: "There was an error processing your dislike.", ephemeral: true });
    }
}