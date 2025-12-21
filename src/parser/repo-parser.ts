import { Repo } from "../models/Repo";
import { XMLParser } from "fast-xml-parser";

/**
 * Parses the meta data of a repository
 * @param meta the raw meta data of the repository
 * @param repo the repository to overwrite
 * @returns the parsed repository
 */
export function parseRepoMeta(meta: any, repo: Repo): Repo {
    if (!meta) {
        throw new Error("Meta data is null");
    }
    repo.stars = meta.stargazers_count;
    repo.forks = meta.forks;
    repo.watchings = meta.subscribers_count;
    repo.description = meta.description;
    repo.topics = meta.topics;
    repo.language = meta.language;
    return repo;
}


/**
 * Parses the RSS data and returns a list of repositories
 * with owner, name, link, description
 * @param rssRawData the raw RSS data
 * @returns the list of repositories
 */
export function getRepoListFromRSS(rssRawData: string): Repo[] {
    // parse the rss raw data into rss xml data
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    const result = parser.parse(rssRawData);
    if (!result) {
        throw new Error("Failed to parse RSS data");
    }

    // parse the rss xml data into repo list
    const items = result.rss.channel.item;
    const repoList = items.map((item: any) => {
        const title = item.title;
        const link = item.link;
        const readme = item.description;
        const repoName = title.split("/");
        if (!repoName[0] || !repoName[1]) {
            return null;
        }

        const repo = new Repo(repoName[0], repoName[1]);
        repo.link = link;
        repo.readme = readme;
        return repo;
    }).filter((repo: Repo | null) => repo !== null);
    return repoList;
}
