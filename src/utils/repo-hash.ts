import { createHash }from "crypto";

export function computeRepoGroupHash(repoGroup: string[]): string {
    const sortedRepos = repoGroup.map(repo => repo.toLowerCase()).sort();
    const hash = sha256(sortedRepos.join(","));
    return hash;
}

function sha256(input: string): string {
    return createHash("sha256").update(input).digest("hex");
}