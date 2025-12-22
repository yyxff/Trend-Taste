import fetch from "node-fetch";

/**
 * Fetches the meta data of a repository by GitHub API
 * @param owner the owner of the repository
 * @param repo the name of the repository
 * @returns the meta data of the repository
 */
export async function fetchRepoMeta(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch github repo meta: ${response.status}:${response.text()}`);
    }
    const data = await response.json();
    return data;
}
