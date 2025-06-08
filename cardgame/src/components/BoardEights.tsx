import { useState, useEffect } from 'react';
import { Game, RankSuitCard, CardContainer, Player, Suit } from '../CardEngine';
import { RankSuitCardComponent } from './CardComponent';
import { HandComponent, DeckComponent } from './ContainerComponents';
import { promiseSuitSelect } from './SuitSelectModal';
import { promiseGameEnd } from './GameEndModal';

export default function BoardEights() {

	/* Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries. */

	const [game, setGame] = useState(new Game());

	const suitSpades = new Suit("spades", "♠", "black");
	const suitHearts = new Suit("hearts", "♥", "red");
	const suitDiams = new Suit("diams", "♦", "red");
	const suitClubs = new Suit("clubs", "♣", "black");

	//const suitRed = new Suit("red", "⬤", "red");
	//const suitGreen = new Suit("hearts", "▲", "green");
	//const suitBlue = new Suit("diams", "✤", "blue");
	//const suitYellow = new Suit("clubs", "★", "purple");

	const suits = [suitSpades, suitHearts, suitDiams, suitClubs];
	//const suits = [suitRed, suitGreen, suitBlue, suitYellow];
	const values = ["7", "8", "9", "10", "J", "Q", "K", "A"];

	const cards: RankSuitCard[] = [];
	let cardId = 0;
	for (const s of suits) {
		for (const v of values) {
			cards.push(new RankSuitCard(cardId, v, s));
			cardId = cardId + 1;
		}
	}

	const [drawDeck, setDrawDeck] = useState([] as RankSuitCard[]);
	const drawContainer = new CardContainer("draw", drawDeck, setDrawDeck, false);

	const [discardDeck, setDiscardDeck] = useState([] as RankSuitCard[]);
	const discardContainer = new CardContainer("discard", discardDeck, setDiscardDeck, true);

	const [currentSuit, setCurrentSuit] = useState(suitSpades);

	const [p0Hand, setP0Hand] = useState([] as RankSuitCard[]);
	const p0HandContainer = new CardContainer("hand", p0Hand, setP0Hand, true);
	const p0 = new Player(false, [p0HandContainer]);

	const [p1Hand, setP1Hand] = useState([] as RankSuitCard[]);
	const p1HandContainer = new CardContainer("hand", p1Hand, setP1Hand, false);
	const p1 = new Player(true, [p1HandContainer]);

	async function getSelectedSuit(): Promise<string> {
		await new Promise(r => setTimeout(r, 500));
		return await promiseSuitSelect();
	}

	useEffect(() => {
		game.Init(cards, suits, [drawContainer, discardContainer], [p0, p1], setCurrentSuit, getSelectedSuit, promiseGameEnd);
	}, []);

	function OnCardClick(card: RankSuitCard) {
		game.Action(card);
	}

	if (game.Players.length == 0) { return <></>; }

	return (
		<>
			<div className="playingCards">

				<div style={{ maxWidth: 400, marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>

					<div className="playArea">
						<HandComponent game={game} container={game.Players[1].CardContainers[0]} onCardClick={OnCardClick} />
					</div>

					<hr />

					<div className="playArea">
						<DeckComponent game={game} container={game.DrawDeck} onCardClick={OnCardClick} /> 

						<DeckComponent game={game} container={game.DiscardDeck} onCardClick={OnCardClick} />

						<div className="suitToken">
							Current Suit: <span style={{ color: currentSuit.Color }}>{currentSuit.SuitIcon}</span>
							</div>
						</div>

					<hr />

					<div className="playArea">

						<HandComponent game={game} container={game.Players[0].CardContainers[0]} onCardClick={OnCardClick} />

					</div>

				</div>

			</div>
		</>
	)
}