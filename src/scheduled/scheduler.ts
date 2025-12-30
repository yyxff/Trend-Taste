import { CronJob } from "cron";
import { runTask } from "./runner.js";

// A set of taskId
// Only enabled tasks are stored here
const EnabledTasks: Map<number, CronJob> = new Map();

/**
 * Add a task
 * @param taskId 
 * @param time 
 * @param timezone
 */
export function addTask(taskId: number, time: string, timezone: string) {
    const job = new CronJob(
        time,
        async () => {
            try {
                console.log('Task running for taskId:', taskId);
                const success = await runTask(taskId)
                if (!success) {
                    console.error('Task failed for taskId:', taskId);
                    removeTask(taskId);
                }
            } catch (error) {
                console.error('Error running task for taskId:', taskId, error);
            }
        },
        null,
        true,
        timezone
    );
    EnabledTasks.set(taskId, job);
    console.log('add task for taskId:', taskId);
}

/**
 * Disable the scheduled task for the given taskId
 * @param taskId 
 */
export function removeTask(taskId: number) {
    const job = EnabledTasks.get(taskId);
    if (job) {
        job.stop();
        EnabledTasks.delete(taskId);
        console.log('remove task for taskId:', taskId);
    } else {
        console.log('no enabled task found for taskId:', taskId);
    }
}

/**
 * Reschedule the task for the given taskId
 * @param taskId 
 * @param time 
 * @param timezone 
 */
export function rescheduleTask(taskId: number, time: string, timezone: string) {
    removeTask(taskId);
    addTask(taskId, time, timezone);
}
