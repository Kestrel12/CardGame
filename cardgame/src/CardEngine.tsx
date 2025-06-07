import { DataStore } from "./DataStore";

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

class Game {

    public DrawDeck: CardContainer = new CardContainer("draw", [], (c) => { }, false);
    public DiscardDeck: CardContainer = new CardContainer("draw", [], (c) => { }, false);
    public Players: Player[] = [];
    public Cards: RankSuitCard[] = [];
    public Suits: Suit[] = [];

    private currentSuit: Suit = new Suit("uninitialized", "x", "black");
    private currentPlayerIndex: number = 0;

    private GetSelectedSuit: () => Promise<string> = () => new Promise((resolve, reject) => resolve("uninitialized"));
    private setCurrentSuitNotify: (s: Suit) => void = (s) => { };

    private computerTurnDelay = DataStore.Config.ComputerTurnDelay;

    public constructor() { }

    public SetCurrentPlayerIndex(playerIndex: number): void {
        this.currentPlayerIndex = playerIndex;
        if (this.Players[this.currentPlayerIndex].IsComputer) {
            this.ComputerTurn();
        }
    }

    private GetCurrentPlayer(): Player {
        return this.Players[this.currentPlayerIndex];
    }

    public Init(
        cards: RankSuitCard[], suits: Suit[],
        decks: CardContainer[], players: Player[],
        setCurrentSuit: ((s: Suit) => void),
        getSelectedSuit: (() => Promise<string>)): void {

        this.Suits = suits;

        const handSize = 5;

        const drawDeck = decks.find(x => x.ContainerName === "draw");
        if (!drawDeck) throw "missing draw deck";
        this.DrawDeck = drawDeck;

        const discDeck = decks.find(x => x.ContainerName === "discard");
        if (!discDeck) throw "missing discard deck";
        this.DiscardDeck = discDeck;

        this.Players = players;

        if (this.Players.length * handSize + 1 > cards.length) {
            alert("Not enough cards to complete setup");
            return;
        }

        this.setCurrentSuitNotify = setCurrentSuit;
        this.GetSelectedSuit = getSelectedSuit;

        this.Shuffle(cards);

        let deckIndex = 0;
        for (const p of this.Players) {
            p.CardContainers[0].SetContents(cards.slice(deckIndex, deckIndex + handSize));
            deckIndex = deckIndex + handSize;
        }

        this.DiscardDeck.SetContents([cards[deckIndex]]);
        this.SetCurrentSuit(this.DiscardDeck.Contents[0].Suit);
        deckIndex = deckIndex + 1;

        this.DrawDeck.SetContents(cards.slice(deckIndex));

        if (this.GetCurrentPlayer().IsComputer) {
            this.ComputerTurn();
        }

    }

    // Not sure if it's possible, but if the computer somehow ends up with an empty
    // draw deck and no valid moves, it can pass null in to pass its turn.
    public async Action(card: RankSuitCard | null): Promise<void> {
        //alert("action called on " + card.Rank + " " + card.Suit.SuitName)

        if (card) {
            if (this.DrawDeck.TopCard()?.Id === card.Id) {
                const c = this.DrawDeck.RemoveCard(card);
                if (c) this.GetCurrentPlayer().CardContainers[0].AddCard(c);
            } else {
                const c = this.GetCurrentPlayer().CardContainers[0].RemoveCard(card);
                if (c) await this.PlayCard(c);
            }
        }

        if (this.DrawDeck.Contents.length == 0) {
            const topCard = this.DiscardDeck.TopCard();
            this.DrawDeck.SetContents(
                this.Shuffle(this.DiscardDeck.Contents.slice(0, this.DiscardDeck.Contents.length - 2)));
            this.DiscardDeck.SetContents([topCard]);
        }

        this.SetCurrentPlayerIndex((this.currentPlayerIndex + 1) % this.Players.length);
    }

    private async PlayCard(card: RankSuitCard): Promise<void> {
        this.DiscardDeck?.AddCard(card);
        if (card.Rank === "8") {
            if (this.GetCurrentPlayer().IsComputer) {
                this.SetCurrentSuit(card.Suit);
            } else {
                const selectedSuitName = await this.GetSelectedSuit();
                this.SetCurrentSuit(this.Suits.find(s => s.SuitName === selectedSuitName) || this.Suits[0]);
                //this.GetSelectedSuit().then(suitName =>
                //    this.CurrentSuit = (this.Suits.find(s => s.SuitName === suitName) || this.Suits[0]));
            }
        }
        else {
            this.SetCurrentSuit(card.Suit);
        }
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
                || this.currentSuit === card.Suit
                || this.DiscardDeck.TopCard().Rank === card.Rank;
    }

    public ComputerTurn() {
        setTimeout(() => {
            const playableCard = this.GetCurrentPlayer().CardContainers[0].Contents.find(c => this.IsPlayAllowed(c));
            if (playableCard) {
                //playableCard.SetIsMoving(true);
                playableCard.Animate().then(
                    () => this.Action(playableCard)
                );
            }
            else if (this.DrawDeck.Contents.length > 0) {
                this.DrawDeck.TopCard().Animate().then(
                    () => this.Action(this.DrawDeck.TopCard())
                );
            }
            else {
                this.Action(null);
            }
        }, this.computerTurnDelay)
    }

    private SetCurrentSuit(s: Suit): void {
        this.currentSuit = s;
        this.setCurrentSuitNotify(this.currentSuit);
    }

    private Shuffle(cards: RankSuitCard[]): RankSuitCard[] {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }
}

class Card {

    public Container: CardContainer | null;
    public readonly Id: number;
    public FaceUp: boolean;

    public SetIsMoving: (b: boolean) => void;
    public IsMoving: boolean; // true when card is being moved by computer

    public Animate: () => Promise<void> = () => new Promise(() => { });

    public IsNew: boolean;

    public constructor(id: number) {
        this.Id = id;
        this.Container = null;
        this.FaceUp = false;
        this.IsMoving = false;
        this.IsNew = false;
        this.SetIsMoving = (b: boolean) => this.IsMoving = b;
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
    private SetContentsInternal: SetContentsFunc;

    public constructor(containerName: string, contents: RankSuitCard[], setContents: SetContentsFunc, faceUp: boolean) {
        this.ContainerName = containerName;
        this.FaceUp = faceUp;
        this.Contents = contents.slice();
        this.SetContentsInternal = setContents;
    }

    public SetContents(cards: RankSuitCard[]) {
        //alert("SetContents called on " + this.ContainerName + " with " + cards.length + " cards.");
        for (const c of cards) {
            c.Container = this;
            c.IsMoving = false;
            c.IsNew = false;
            c.FaceUp = this.FaceUp;
        }
        this.Contents = cards.slice();
        this.SetContentsInternal(this.Contents);
    }

    public TopCard(): RankSuitCard {
        return this.Contents[this.Contents.length - 1];
    }

    public AddCard(card: RankSuitCard) {
        card.Container = this;
        card.IsMoving = false;
        card.IsNew = true;
        card.FaceUp = this.FaceUp;
        this.Contents = [...this.Contents, card];
        this.SetContentsInternal(this.Contents);
    }

    public RemoveCard(card: RankSuitCard): RankSuitCard | null {
        //alert("Contents" + this.Contents.map(c => c.Id)
        const removed = this.Contents.find(c => c.Id === card.Id);
        if (!removed) return null;
        const newContents = this.Contents.filter(c => c.Id !== card.Id);
        //alert("newContents.length = " + newContents.length);
        removed.Container = null;
        this.Contents = newContents;
        this.SetContentsInternal(this.Contents);
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

    public GetWinMessage() {
        if (this.IsComputer) {
            return "You Lose!";
        } else {
            return "You Win!";
        }
    }

}

export {Game, Suit, Card, RankSuitCard, CardContainer, Player };