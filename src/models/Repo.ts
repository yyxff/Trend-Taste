export type Repo = {
    owner: string,
    name: string,
    stars?: number,
    forks?: number,
    watchings?: number,
    language?: string,
    description?: string,
    readme?: string,
    link: string,
    topics?: string[],
}

export function summary(repo: Repo): string {
    return `${repo.owner}/${repo.name}, ${repo.stars} stars, ${repo.forks} forks, in ${repo.language}. 
        link: ${repo.link},
        description: ${repo.description}
        `;
}
