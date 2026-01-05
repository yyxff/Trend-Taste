import fetch from "node-fetch";
import { githubConfig } from "../config";

/**
 * Fetches the meta data of a repository by GitHub API
 * @param owner the owner of the repository
 * @param repo the name of the repository
 * @returns the meta data of the repository
 */
export async function fetchRepoMeta(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${githubConfig.GITHUB_API_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch github repo meta: ${response.status}:${await response.text()}`);
    }
    const data = await response.json();
    return data;
}
