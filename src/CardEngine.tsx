class Card {

    public Container: CardContainer | null;

    public constructor() {
        this.Container = null;
    }

}

class RankSuitColorCard extends Card {

    public readonly Rank: string;
    public readonly Suit: string;
    public readonly Color: string;

    public constructor(rank: string, suit: string, color: string) {
        super();
        this.Rank = rank;
        this.Suit = suit;
        this.Color = color;
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

class Player {

    public readonly IsComputer: boolean;
    public readonly CardContainers: CardContainer[];

    public constructor(isComputer: boolean, cardContainers: CardContainer[]) {
        this.IsComputer = isComputer;
        this.CardContainers = cardContainers; 
    }

}

export {Card, RankSuitColorCard, CardContainer, Player };