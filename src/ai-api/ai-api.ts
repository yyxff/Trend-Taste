import { generate } from "./gemini";
import { summary, type RepoDto } from "../models/RepoDto";
import type { FineRepoDto } from "../models/FineRepoDto";
import { LanguageType } from "@prisma/client";
import { languagePromptMap } from "../constants/language";

/**
 * Generate recommendation for a repository
 * @param repo 
 * @param language preferred language
 * @returns FineRepoDto with recommendation
 */
export async function generateRecommendationForRepo(repo: RepoDto, language: LanguageType): Promise<FineRepoDto> {
    const prompt = `${languagePromptMap[language]}. `
    +`Please give me a brief recommendation (within 50 words) for this repository: `
    +`${summary(repo)}, ${repo.readme?.substring(0, 1500)}`;
    const recommendation = await generate(prompt);
    return {
        ...repo,
        recommendation: recommendation
    };
}