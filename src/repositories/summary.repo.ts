import type { Summary, LanguageType } from '@generated/client';
import { prisma } from '@db';

export async function getSummaryByRepoGroupHashAndLanguage(repoGroupHash: string, language: LanguageType): Promise<Summary | null> {
    return prisma.summary.findUnique({
        where: {
            repoGroupHash_language: {
                repoGroupHash,
                language
            }
        }
    });
}

export async function createSummary(repoGroupHash: string, repoGroup: string[], language: LanguageType, content: string): Promise<Summary> {
    return prisma.summary.create({
        data: {
            repoGroupHash,
            repoGroup,
            language,
            content
        }
    });
}