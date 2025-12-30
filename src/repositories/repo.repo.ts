import { prisma } from '../db';
import type { Repo } from '@prisma/client';

export async function findRepoById(repoId: string): Promise<Repo | null> {
    return prisma.repo.findUnique({
        where: {
            id: repoId
        }
    });
}

export async function findRepoByOwnerAndName(owner: string, name: string): Promise<Repo | null> {
    return prisma.repo.findUnique({
        where: {
            owner_name: {
                owner: owner,
                name: name
            }
        }
    });
}

export async function createRepo(repo: Omit<Repo, 'createdAt' | 'updatedAt'>) {
    return prisma.repo.create({
        data: {
            id: repo.id,
            owner: repo.owner,
            name: repo.name,
            url: repo.url,
            description: repo.description,
            stars: repo.stars,
            forks: repo.forks,
            watchings: repo.watchings,
            language: repo.language,
            topics: repo.topics,
        }
    });
}