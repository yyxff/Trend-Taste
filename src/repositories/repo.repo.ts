import { prisma } from '@db';
import type { Repo } from '@generated/client';

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
            ...repo
        }
    });
}

export async function updateRepo(owner: string, name: string, updates: Partial<Omit<Repo, 'createdAt' | 'updatedAt'>>) {
    return prisma.repo.update({
        where: {
            owner_name: {
                owner: owner,
                name: name
            }
        },
        data: updates
    });
}