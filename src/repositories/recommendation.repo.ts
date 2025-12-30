import type { LanguageType } from "@prisma/client";
import { prisma } from "../db";

export async function findRecommendationByRepoAndLanguage(repoId: string, language: LanguageType) {
    return prisma.recommendation.findUnique({
        where: {
            repoId_language: {
                repoId: repoId,
                language: language,
            }
        }
    });
}

export async function createRecommendation(repoId: string, language: LanguageType, recommendation: string) {
    return prisma.recommendation.create({
        data: {
            repoId: repoId,
            language: language,
            content: recommendation,
        }
    });
}
