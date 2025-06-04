

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
    public Cards: RankSuitCard[] = [];

    public CurrentSuit: Suit = suitSpades;
    private currentPlayerIndex: number = 0;



    public constructor(game?: Game) {

        if (game) {
            this.DrawDeck = game.DrawDeck;
            this.DiscardDeck = game.DiscardDeck;
            this.Players = game.Players
        } else {

            this.DrawDeck = new CardContainer("draw", false, []);
            this.DiscardDeck = new CardContainer("discard", true, []);

            const cards: RankSuitCard[] = [];
            let cardId = 0;
            for (const s of suits) {
                for (const v of values) {
                    cards.push(new RankSuitCard(cardId, v, s));
                    cardId = cardId + 1;
                }
            }

            this.Init(cards);
        }
    }

    public Copy(): Game {
        const copy = new Game();
        copy.DrawDeck = this.DrawDeck;
        copy.DiscardDeck = this.DiscardDeck;
        copy.Players = this.Players;
        copy.CurrentSuit = this.CurrentSuit;
        copy.SetCurrentPlayerIndex(this.currentPlayerIndex);
        return copy;
    }

    public SetCurrentPlayerIndex(playerIndex: number): void {
        this.currentPlayerIndex = playerIndex;
        if (this.Players[this.currentPlayerIndex].IsComputer) {
            this.ComputerTurn();
        }
    }

    private GetCurrentPlayer(): Player {
        return this.Players[this.currentPlayerIndex];
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
        for (const p of this.Players) {
            p.CardContainers[0].SetContents(cards.slice(deckIndex, deckIndex + handSize));
            deckIndex = deckIndex + handSize;
        }

        this.DiscardDeck.SetContents([cards[deckIndex]]);
        this.CurrentSuit = this.DiscardDeck.Contents[0].Suit;
        deckIndex = deckIndex + 1;

        this.DrawDeck.SetContents(cards.slice(deckIndex));

        if (this.GetCurrentPlayer().IsComputer) {
            this.ComputerTurn();
        }

    }

    public Action(card: RankSuitCard): Game {
        //alert("action called on " + card.Rank + " " + card.Suit.SuitName)

        if (this.DrawDeck.TopCard().Id === card.Id) {
            const c = this.DrawDeck.RemoveCard(card);
            if (c) this.GetCurrentPlayer().CardContainers[0].AddCard(c);
        } else {
            const c = this.GetCurrentPlayer().CardContainers[0].RemoveCard(card);
            if (c) this.PlayCard(c);
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.Players.length;
        return this.Copy();
    }

    private PlayCard(card: RankSuitCard): void {
        this.DiscardDeck?.AddCard(card);
        this.CurrentSuit = card.Suit;
    }

    public IsPlayEnabled(card: RankSuitCard): boolean {
        if (this.GetCurrentPlayer().IsComputer) {
            return false;
        }

        if (this.DrawDeck.TopCard().Id === card.Id) {
            return true;
        }

        if (this.GetCurrentPlayer().CardContainers[0].Contents.some(c => c.Id === card.Id)) {
            return this.IsPlayAllowed(card);
        }

        return false;
    }

    public IsPlayAllowed(card: RankSuitCard): boolean {
        return card.Rank === "8"
                || this.CurrentSuit === card.Suit
                || this.DiscardDeck.TopCard().Rank === card.Rank;
    }

    public ComputerTurn() {
        setTimeout(() => {
            const playableCard = this.GetCurrentPlayer().CardContainers[0].Contents.find(c => this.IsPlayAllowed(c));
            if (playableCard) {
                playableCard.SetMoving(true);
            }
            else {
                this.DrawDeck.TopCard().SetMoving(true);
            }
        }, 500)
    }

}

class Card {

    public Container: CardContainer | null;
    public readonly Id: number;
    public FaceUp: boolean;

    public SetMoving: (b: boolean) => void;
    public Moving: boolean; // true when card is being moved by computer

    public constructor(id: number) {
        this.Id = id;
        this.Container = null;
        this.FaceUp = false;
        this.Moving = false;
        this.SetMoving = (b: boolean) => this.Moving = b;
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
        for (const c of cards) {
            c.Container = this;
            c.Moving = false;
            c.FaceUp = this.FaceUp;
        }
        this.Contents = cards;
    }

    public TopCard(): RankSuitCard {
        return this.Contents[this.Contents.length - 1];
    }

    public AddCard(card: RankSuitCard) {
        card.Container = this;
        card.Moving = false;
        card.FaceUp = this.FaceUp;
        this.Contents = [...this.Contents, card];
    }

    public RemoveCard(card: RankSuitCard): RankSuitCard | null {
        //alert("Contents" + this.Contents.map(c => c.Id)
        const removed = this.Contents.find(c => c.Id === card.Id);
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