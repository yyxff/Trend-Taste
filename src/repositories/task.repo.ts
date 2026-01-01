import { prisma } from "@db";
import type { Task, TaskType, LanguageType } from "@generated/client";

export async function getTaskByChannelId(channelId: string): Promise<Task | null> {
    return prisma.task.findUnique({
        where: {
            channelId: channelId
        }
    });
}

export async function getTasksByEnabledStatus(enabledStatus: boolean): Promise<Task[]> {
    return prisma.task.findMany({
        where: {
            enabled: enabledStatus
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

export async function upsertTaskLanguage(channelId: string, language: LanguageType): Promise<Task> {
    return _upsertTask(channelId, { language });
}

export async function upsertTaskTimezone(channelId: string, timezone: string): Promise<Task> {
    return _upsertTask(channelId, { timezone });
}

async function _upsertTask(channelId: string, data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "channelId">>): Promise<Task> {
  return prisma.task.upsert({
    where: { channelId },
    update: data,
    create: { channelId, ...data },
  });
}
