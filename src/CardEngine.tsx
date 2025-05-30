
class Game {

    public DrawDeck: CardContainer | undefined;
    public DiscardDeck: CardContainer | undefined;
    public Players: Player[] = [];

    public constructor() {
        this.DrawDeck = new CardContainer("draw", [], (c) => { });
        this.DiscardDeck = new CardContainer("discard", [], (c) => { });
    }

    Init(cards: RankSuitCard[], decks: CardContainer[], players: Player[]): void {
        //alert("init called");
        const handSize = 5;
        this.DrawDeck = decks.find(x => x.ContainerName === "draw");
        if (!this.DrawDeck) {
            alert("No draw deck found");
            return;
        }

        this.DiscardDeck = decks.find(x => x.ContainerName === "discard");
        if (!this.DiscardDeck) {
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

        this.DiscardDeck.SetContents([cards[deckIndex]]);
        deckIndex = deckIndex + 1;

        this.DrawDeck.SetContents(cards.slice(deckIndex));
    }

    Action(card: RankSuitCard) {
        alert("action called on " + card.Rank + " " + card.Suit.SuitName)
        card?.Container?.RemoveCard(card);
        this.DiscardDeck?.AddCard(card);
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

    public Id: number;

    // Marked as new when a card is added to a hand for animation.
    // Marked as false after animation is triggered.
    public IsNew: boolean;

    public constructor(id: number) {
        this.Id = id;
        this.Container = null;
        this.IsNew = false;
    }

}

class RankSuitCard extends Card {

    public readonly Rank: string;
    public readonly Suit: Suit;

    public constructor(id:number, rank: string, suit: Suit) {
        super(id);
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
        alert("SetContents called on " + this.ContainerName + " with " + cards.length + " cards.");
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
        alert("Contents.length = " + this.Contents.length);
        const newContents = this.Contents.filter(c => c.Id !== card.Id);
        alert("newContents.length = " + newContents.length);
        card.Container = null;
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