

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

const suitSpades = new Suit("spades", "♠", "black");
const suitHearts = new Suit("hearts", "♥", "red");
const suitDiams = new Suit("diams", "♦", "red");
const suitClubs = new Suit("clubs", "♣", "black");

const suits = [suitSpades, suitHearts, suitDiams, suitClubs];
const values = ["7", "8", "9", "10", "J", "Q", "K", "A"];


class Game {

    public DrawDeck: CardContainer;
    public DiscardDeck: CardContainer;
    public Players: Player[] = [];


    public constructor(game?: Game) {

        if (game) {
            this.DrawDeck = game.DrawDeck;
            this.DiscardDeck = game.DiscardDeck;
            this.Players = game.Players
        } else {

            this.DrawDeck = new CardContainer("draw", false, []);
            this.DiscardDeck = new CardContainer("discard", true, []);

            let cards: RankSuitCard[] = [];
            let cardId = 0;
            for (let s of suits) {
                for (let v of values) {
                    cards.push(new RankSuitCard(cardId, v, s));
                    cardId = cardId + 1;
                }
            }

            this.Init(cards);
        }
    }

    private Init(cards: RankSuitCard[]): void {
        //alert("init called");
        const handSize = 5;

        this.Players.push(new Player(false, [new CardContainer("hand", true, [])]));
        this.Players.push(new Player(true, [new CardContainer("hand", false, [])]));

        if (this.Players.length * handSize + 1 > cards.length) {
            alert("Not enough cards to complete setup");
            return;
        }

        // Shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        let deckIndex = 0;
        for (let p of this.Players) {
            p.CardContainers[0].SetContents(cards.slice(deckIndex, deckIndex + handSize));
            deckIndex = deckIndex + handSize;
        }

        this.DiscardDeck.SetContents([cards[deckIndex]]);
        deckIndex = deckIndex + 1;

        this.DrawDeck.SetContents(cards.slice(deckIndex));
    }

    public Action(card: RankSuitCard): Game {
        //alert("action called on " + card.Rank + " " + card.Suit.SuitName)
        let c = this.Players[0].CardContainers[0].RemoveCard(card);
        if (c) this.DiscardDeck?.AddCard(c);
        return new Game(this);
    }

}

class Card {

    public Container: CardContainer | null;
    public readonly Id: number;
    public FaceUp: boolean

    // Marked as new when a card is added to a hand for animation.
    // Marked as false after animation is triggered.
    public IsNew: boolean;

    public constructor(id: number) {
        this.Id = id;
        this.Container = null;
        this.FaceUp = false;
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
    public readonly FaceUp: boolean;
    public Contents: RankSuitCard[];

    public constructor(containerName: string, faceUp: boolean, contents: RankSuitCard[]) {
        this.ContainerName = containerName;
        this.FaceUp = faceUp;
        this.Contents = contents;
    }

    public SetContents(cards: RankSuitCard[]) {
        //alert("SetContents called on " + this.ContainerName + " with " + cards.length + " cards.");
        for (let c of cards) {
            c.Container = this;
            c.IsNew = true;
            c.FaceUp = this.FaceUp;
        }
        this.Contents = cards;
    }

    public AddCard(card: RankSuitCard) {
        card.Container = this;
        card.IsNew = true;
        card.FaceUp = this.FaceUp;
        this.Contents = [...this.Contents, card];
    }

    public RemoveCard(card: RankSuitCard): RankSuitCard | null {
        //alert("Contents" + this.Contents.map(c => c.Id)
        let removed = this.Contents.find(c => c.Id === card.Id);
        if (!removed) return null;
        const newContents = this.Contents.filter(c => c.Id !== card.Id);
        //alert("newContents.length = " + newContents.length);
        removed.Container = null;
        this.Contents = newContents;
        return removed;
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