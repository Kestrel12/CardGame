import { useState, useEffect } from 'react';
import { Game, RankSuitCard, CardContainer, Player, Suit } from '../CardEngine';
import { RankSuitCardComponent } from './CardComponent';

export default function BoardEights() {

	/* Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries. */

	const [game, setGame] = useState(new Game());

	const suitSpades = new Suit("spades", "♠", "black");
	const suitHearts = new Suit("hearts", "♥", "red");
	const suitDiams = new Suit("diams", "♦", "red");
	const suitClubs = new Suit("clubs", "♣", "black");

	const suits = [suitSpades, suitHearts, suitDiams, suitClubs];
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

	const [p0Hand, setP0Hand] = useState([] as RankSuitCard[]);
	const p0HandContainer = new CardContainer("hand", p0Hand, setP0Hand, true);
	const p0 = new Player(false, [p0HandContainer]);

	const [p1Hand, setP1Hand] = useState([] as RankSuitCard[]);
	const p1HandContainer = new CardContainer("hand", p1Hand, setP1Hand, false);
	const p1 = new Player(true, [p1HandContainer]);

	useEffect(() => {
		game.Init(cards, [drawContainer, discardContainer], [p0, p1]);
	}, []);

	function OnCardPreClick(card: RankSuitCard) {

	}

	function OnCardClick(card: RankSuitCard) {
		game.Action(card);
	}

	if (game.Players.length == 0) { return <></>; }

	return (
		<>
		<div className="playingCards">

			<div style={{ maxWidth: 400, marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>

			<div className="playArea">
					<ul className="hand">
					{game.Players[1].CardContainers[0].Contents.map(c =>
						<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={OnCardClick} />)}
						</ul>
				</div>

				<hr />

			<div className="playArea">
				<ul style={{ display: "inline-block", width: "110px", height: "100px" }} className="deck">
					{game.DrawDeck.Contents.slice(-10).map(c =>
						<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={OnCardClick} />)}
					</ul>


				<ul style={{display:"inline-block", width: "110px", height: "100px"}} className="deck">
					{game.DiscardDeck.Contents.slice(-10).map(c =>
						<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={OnCardClick} />)}
					</ul>

					<div className="suitToken">
						Current Suit: <span style={{ color: game.CurrentSuit.Color }}>{game.CurrentSuit.SuitIcon}</span>
						</div>
					</div>

				<hr />

				<div>
				<ul className="hand">
					{game.Players[0].CardContainers[0].Contents.map(c =>
						<RankSuitCardComponent key={c.Id}  game={game} card={c} onClick={OnCardClick} />)}
						</ul>
				</div>

			</div>

		</div>

		<div style={{ display: "none" }} className="modal">
			<h3>
				You Win!
			</h3>
			<div className="button">
				Restart
			</div>
		</div>

			<div style={{display: "none"}} className="modal">
			<h3>
				Wild Card &mdash; Pick a Suit!
			</h3>
				<div className="button">
					<span style={{ color: "red" }}>♥</span>
				</div>
				<div className="button">
					♠
				</div>
				<div className="button">
					<span style={{ color: "red" }}>♦</span>
				</div>
				<div className="button">
					♣
				</div>
		</div>

		</>
	)
}