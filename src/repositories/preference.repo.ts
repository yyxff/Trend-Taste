import { prisma } from "../db";
import { Language } from "../constants/language";

export async function getPreferenceById(channelId: string) {
    return prisma.preference.findUnique({
        where: {
            id: channelId
        }
    });
}

export async function updatePreferenceLanguage(channelId: string, language: Language) {
    return prisma.preference.upsert({
        where: {
            id: channelId
        },
        update: {
            language: language
        },
        create: {
            id: channelId,
            language: language
        }
    });
}
