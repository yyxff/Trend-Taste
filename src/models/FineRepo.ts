import type { Repo } from "./Repo";

export type FineRepo = Repo & {
    Recommendation: string;
}