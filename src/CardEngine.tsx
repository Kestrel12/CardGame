class Card {

    public Container: CardContainer | null;

    public constructor() {
        this.Container = null;
    }

}

class RankSuitCard extends Card {

    public readonly Rank: string;
    public readonly RankIndex: bigint;
    public readonly Suit: string;

    public constructor(rank: string, rankIndex: bigint, suit: string) {
        super();
        this.Rank = rank;
        this.RankIndex = rankIndex;
        this.Suit = suit;
    }

}

class CardContainer {

    public readonly ContainerName: string;
    public readonly Contents: Card[];

    public constructor(containerName: string, contents: Card[]) {
        this.ContainerName = containerName;
        this.Contents = contents;

        for (let card of this.Contents) {
            card.Container = this;
        }
    }


}

export {Card, RankSuitCard, CardContainer };