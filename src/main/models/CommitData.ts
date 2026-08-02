export class CommitData {
    date: string = "";
    message: string | null = "";
    insertions: Record<string, number> = {};

    public addInsertions(language: string, quantity: number): void {
        if (!language || Number.isNaN(quantity) || quantity < 0) return;

        this.insertions[language] = (this.insertions[language] || 0) + quantity;
    }
}
