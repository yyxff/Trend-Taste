import type { RepoDto } from "./Repo.dto";

export type FineRepoDto = RepoDto & {
    recommendation: string;
}