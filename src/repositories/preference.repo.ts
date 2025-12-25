import { prisma } from "../db";

export async function getPreferenceById(channelId: string) {
    return prisma.preference.findUnique({
        where: {
            id: channelId
        }
    });
}
