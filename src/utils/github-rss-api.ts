import fetch from "node-fetch";


export async function fetchGithubTrending() {
    const url = "https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml";
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch github trending: ${response.status}`);
    }
    const data = await response.text();
    return data;
}
