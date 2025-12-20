import { Repo } from "../models/Repo";


/**
 * Parses the meta data of a repository
 * @param meta the raw meta data of the repository
 * @param repo the repository to overwrite
 * @returns the parsed repository
 */
export function parseRepoMeta(meta: any, repo: Repo): Repo {
    if (!meta) {
        console.error("Meta data is null");
        return repo;
    }
    repo.stars = meta.stargazers_count;
    repo.forks = meta.network_count;
    repo.watchings = meta.subscribers_count;
    repo.description = meta.description;
    return repo;
}