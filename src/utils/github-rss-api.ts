import fetch from "node-fetch";

/**
 * Fetches the RSS data of the GitHub trending repositories by 3rd party RSS API
 * @returns the RSS data of the trending repositories
 */
export async function fetchGithubTrending() {
    const url = "https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml";
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch github trending: ${response.status}`);
    }
    const data = await response.text();
    return data;
}
