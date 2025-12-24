import type { Repo } from "./Repo";

export type FineRepo = Repo & {
    recommendation: string;
}