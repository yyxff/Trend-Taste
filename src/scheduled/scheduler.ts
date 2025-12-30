import { CronJob } from "cron";

// A set of taskId
// Only enabled tasks are stored here
const EnabledTasks: Set<number> = new Set();

/**
 * Add a task
 * @param taskId 
 * @param time 
 * @param timezone
 */
export function addTask(taskId: number, time: string, timezone: string) {
    new CronJob(
        time,
        () => {
            console.log('Task running for taskId:', taskId);
        },
        null,
        true,
        timezone
    );
    EnabledTasks.add(taskId);
    console.log('add task for taskId:', taskId);
}

/**
 * Disable the scheduled task for the given taskId
 * @param taskId 
 */
export function removeTask(taskId: number) {
    if (EnabledTasks.delete(taskId)) {
        console.log('remove task for taskId:', taskId);
    } else {
        console.log('no enabled task found for taskId:', taskId);
    }
}
