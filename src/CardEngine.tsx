
class Game {

    public constructor() { }

}

class Suit {

    public readonly SuitName: string;
    public readonly SuitIcon: string;
    public readonly Color: string;

    public constructor(suitName: string, suitIcon: string, color: string) {
        this.SuitName = suitName;
        this.SuitIcon = suitIcon;
        this.Color = color;
    }
}

class Card {

    public Container: CardContainer | null;
    public SetContainer: ((c: CardContainer | null) => void) | null;

    public constructor() {
        this.Container = null;
        this.SetContainer = null;
    }

    public onClick() {

    }

}

class RankSuitCard extends Card {

    public readonly Rank: string;
    public readonly Suit: Suit;

    public constructor(rank: string, suit: Suit) {
        super();
        this.Rank = rank;
        this.Suit = suit;
    }

}

type SetContentsFunc = (c: RankSuitCard[]) => void;

class CardContainer {

    public readonly ContainerName: string;
    public Contents: RankSuitCard[];
    public SetContents: SetContentsFunc;

    public constructor(containerName: string, contents: RankSuitCard[], setContents: SetContentsFunc) {
        this.ContainerName = containerName;
        this.Contents = contents;
        this.SetContents = setContents;
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

export {Game, Suit, Card, RankSuitCard, CardContainer, Player };