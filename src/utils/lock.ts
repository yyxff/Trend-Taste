interface ILockSet {
  acquire(key: string): boolean;
  release(key: string): void;
  has(key: string): boolean;
}

export class LockSet implements ILockSet {
  private locks = new Set<string>();

  acquire(key: string): boolean {
    if (this.locks.has(key)) return false;
    this.locks.add(key);
    return true;
  }

  release(key: string): void {
    this.locks.delete(key);
  }

  has(key: string): boolean {
    return this.locks.has(key);
  }
}

export const repoFetchingLock = new LockSet();
export const aiFetchingLock = new LockSet();
export const summaryFetchingLock = new LockSet();