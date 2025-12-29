import { prisma } from "../db";
import type { Task, TaskType } from "@prisma/client";

export async function getTaskByChannelId(channelId: string): Promise<Task | null> {
    return prisma.task.findUnique({
        where: {
            channelId: channelId
        }
    });
}

export async function upsertTaskEnabledStatus(channelId: string, enabled: boolean): Promise<Task> {
    return _upsertTask(channelId, { enabled });
}

export async function upsertTaskSchedule(channelId: string, schedule: Date): Promise<Task> {
    return _upsertTask(channelId, { schedule });
}

export async function upsertTaskType(channelId: string, taskType: TaskType): Promise<Task> {
    return _upsertTask(channelId, { taskType });
}

async function _upsertTask(channelId: string, data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "channelId">>): Promise<Task> {
  return prisma.task.upsert({
    where: { channelId },
    update: data,
    create: { channelId, ...data },
  });
}
