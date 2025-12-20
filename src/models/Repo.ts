export class Repo {
    constructor(
        public owner: string,
        public name: string,
        public stars: number,
        public forks: number,
        public watchings: number,
        public language: string,
        public description: string,
        public readme?: string
    ) { }

    summary(): string {
        return `${this.owner}/${this.name}, ${this.stars} stars, ${this.forks} forks, in ${this.language}`;
    }
}