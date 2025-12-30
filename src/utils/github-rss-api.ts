import fetch from "node-fetch";
import { logger } from "./logger";

/**
 * Fetches the RSS data of the GitHub trending repositories by 3rd party RSS API
 * @returns the RSS data of the trending repositories
 */
export async function fetchGithubTrending() {
    const url = "https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml";
    const response = await fetch(url);
    if (!response.ok) {
        logger.error({status: response.status, statusText: response.statusText}, "Failed to fetch github trending RSS data");
        throw new Error(`Failed to fetch github trending: ${response.status}`);
    }
    const data = await response.text();
    logger.info("Fetched GitHub trending RSS data successfully");
    return data;
}
