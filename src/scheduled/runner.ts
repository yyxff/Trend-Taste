import { getTaskById } from "../services/task.service";
import { runGithubTrendingTask } from "../tasks/github-trending";
import { client } from "../bot";

/**
 * Run the a task for the given taskId
 * @param taskId 
 * @returns void
 */
export async function runTask(taskId: number): Promise<boolean> {
    const task = await getTaskById(taskId);
    if (!task) {
        console.error('No task found for taskId:', taskId);
        return false;
    }
    switch (task.taskType) {
        case 'GITHUB_TRENDING': {
            await runGithubTrendingTask(client, task.channelId, task.language);
            console.log('Github trending task completed for taskId:', taskId);
            break;
        }
        default: {
            console.error('Unsupported task type for taskId:', taskId);
            return false;
        }
    }
    return true;
}