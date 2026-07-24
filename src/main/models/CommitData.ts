export class CommitData {
    date: string = "";
    message: string = "";
    tsInsertions: number = 0;

    public addTsInsertions(quantity: number): void {
        if (!isNaN(quantity) && quantity > 0) {
            this.tsInsertions += quantity;
        }
    }
}
