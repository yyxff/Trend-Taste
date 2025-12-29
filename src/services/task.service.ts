import type { Task, TaskType } from "@prisma/client";
import { upsertTaskEnabledStatus, upsertTaskSchedule, upsertTaskType } from "../repositories/task.repo";

/**
 * set the schedule for a task
 * @param channelId 
 * @param schedule 
 * @returns The updated or created Task
 */
export async function setTaskSchedule(channelId: string, schedule: Date): Promise<Task> {
    try {
        const task = await upsertTaskSchedule(channelId, schedule);
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Set the task type for a task
 * @param channelId 
 * @param taskType 
 * @returns The updated or created Task
 */
export async function setTaskType(channelId: string, taskType: TaskType): Promise<Task> {
    try {
        const task = await upsertTaskType(channelId, taskType);
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Set the enabled status for a task
 * @param channelId 
 * @param enabled 
 * @returns The updated or created Task
 */
export async function setTaskEnabledStatus(channelId: string, enabled: boolean): Promise<Task> {
    try {
        const task = await upsertTaskEnabledStatus(channelId, enabled);
        return task;
    } catch (error) {
        throw error;
    }
}
