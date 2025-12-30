import type { RepoDto } from "./RepoDto";

export type FineRepoDto = RepoDto & {
    recommendation: string;
}