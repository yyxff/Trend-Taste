import { prisma } from "@db";

export async function findChannelById(channelId: string) {
    return prisma.channel.findUnique({
        where: {
            id: channelId
        }
    });
}
