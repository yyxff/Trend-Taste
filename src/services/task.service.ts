import type { Task, TaskType, LanguageType } from "@prisma/client";
import { prisma } from "../db";
import { DateTime } from "luxon";
import { upsertTaskEnabledStatus, upsertTaskLanguage, upsertTaskSchedule, upsertTaskType, upsertTaskTimezone, getTasksByEnabledStatus } from "../repositories/task.repo";
import { addTask, removeTask, rescheduleTask } from "../scheduled/scheduler";

/**
 * Get a task by its ID
 * @param taskId The ID of the task to retrieve
 * @returns The task if found, otherwise null
 */
export async function getTaskById(taskId: number): Promise<Task | null> {
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @returns 
 */
export async function getAllEnabledTasks(): Promise<Task[]> {
    try {
        const tasks = await getTasksByEnabledStatus(true);
        return tasks;
    } catch (error) {
        throw error;
    }
}

/**
 * set the schedule for a task
 * @param channelId 
 * @param schedule 
 * @returns The updated or created Task
 */
export async function setTaskSchedule(channelId: string, schedule: Date): Promise<Task> {
    try {
        const task = await upsertTaskSchedule(channelId, schedule);
        if (task.enabled && task.timezone) {
            rescheduleTask(task.id, `${schedule.getMinutes()} ${schedule.getHours()} * * *`, task.timezone);
        }
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
export async function enableTask(channelId: string): Promise<Task> {
    try {
        const task = await upsertTaskEnabledStatus(channelId, true);
        console.log('enabled task:', task.id);
        if (task.schedule && task.timezone) {
            const utcTime = DateTime.fromJSDate(task.schedule, { zone: "utc" });
            const localTime = utcTime.setZone(task.timezone)
            const cronExprLocal = `${localTime.minute} ${localTime.hour} * * *`;
            addTask(task.id, cronExprLocal, task.timezone);
        }
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Disable a task
 * @param channelId 
 * @returns The updated or created Task
 */
export async function disableTask(channelId: string): Promise<Task> {
    try {
        const task = await upsertTaskEnabledStatus(channelId, false);
        console.log('disabled task:', task.id);
        if (task.schedule && task.timezone) {
            const utcTime = DateTime.fromJSDate(task.schedule, { zone: "utc" });
            const localTime = utcTime.setZone(task.timezone)
            const cronExprLocal = `${localTime.minute} ${localTime.hour} * * *`;
            removeTask(task.id);
        }
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Set the preferred language for a task
 * @param channelId 
 * @param language 
 * @returns The updated or created Task
 */
export async function setTaskLanguage(channelId: string, language: LanguageType): Promise<Task> {
    try {
        const task = await upsertTaskLanguage(channelId, language);
        return task;
    } catch (error) {
        throw error;
    }
}

/**
 * Set the timezone for a task
 * @param channelId 
 * @param timezone 
 * @returns The updated or created Task
 */
export async function setTaskTimezone(channelId: string, timezone: string): Promise<Task> {
    try {
        const task = await upsertTaskTimezone(channelId, timezone);
        return task;
    } catch (error) {
        throw error;
    }
}
