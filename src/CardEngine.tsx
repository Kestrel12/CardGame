
class Game {

    Init(cards: RankSuitCard[], decks: CardContainer[], players: Player[]): void {
        alert("init called");
        const handSize = 5;
        const drawDeck = decks.find(x => x.ContainerName === "draw");
        if (!drawDeck) {
            alert("No draw deck found");
            return;
        }

        const discardDeck = decks.find(x => x.ContainerName === "discard");
        if (!discardDeck) {
            alert("no discard deck found");
            return;
        }

        if (players.length * handSize + 1 > cards.length) {
            alert("Not enough cards to complete setup");
            return;
        }

        // Shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        let deckIndex = 0;
        for (let p of players) {
            p.CardContainers[0].SetContents(cards.slice(deckIndex, deckIndex + handSize));
            deckIndex = deckIndex + handSize;
        }

        discardDeck.SetContents([cards[deckIndex]]);
        alert(discardDeck.Contents.length);
        deckIndex = deckIndex + 1;

        drawDeck.SetContents(cards.slice(deckIndex));
    }

    Action(card: RankSuitCard) {

    }

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

    // Marked as new when a card is added to a hand for animation.
    // Marked as false after animation is triggered.
    public IsNew: boolean;

    public constructor() {
        this.Container = null;
        this.IsNew = false;
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
    private SetContentsInternal: SetContentsFunc;

    public constructor(containerName: string, contents: RankSuitCard[], setContents: SetContentsFunc) {
        this.ContainerName = containerName;
        this.Contents = contents;
        this.SetContentsInternal = setContents;
    }

    public SetContents(cards: RankSuitCard[]) {

        for (let c of cards) {
            c.Container = this;
            c.IsNew = true;
        }

        this.SetContentsInternal(cards);
    }

    public AddCard(card: RankSuitCard) {
        card.Container = this;
        card.IsNew = true;
        this.SetContentsInternal([...this.Contents, card]);
    }

    public RemoveCard(card: RankSuitCard) {
        const newContents = this.Contents.filter(c => c !== card);
        this.SetContentsInternal(newContents);
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