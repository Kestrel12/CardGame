import { useState, useEffect } from 'react';
import { Game, RankSuitCard, CardContainer, Player } from '../CardEngine';
import { RankSuitCardComponent } from './CardComponent';

export default function BoardEights() {


	const [game, setGame] = useState(new Game());



	//const [drawDeck, setDrawDeck] = useState([] as RankSuitCard[]);
	//const drawContainer = new CardContainer("draw", drawDeck, setDrawDeck);

	//const [discardDeck, setDiscardDeck] = useState([] as RankSuitCard[]);
	//const discardContainer = new CardContainer("discard", discardDeck, setDiscardDeck);

	//const [p0Hand, setP0Hand] = useState([] as RankSuitCard[]);
	//const p0HandContainer = new CardContainer("hand", p0Hand, setP0Hand);
	//const p0 = new Player(false, [p0HandContainer]);

	//const [p1Hand, setP1Hand] = useState([] as RankSuitCard[]);
	//const p1HandContainer = new CardContainer("hand", p1Hand, setP1Hand);
	//const p1 = new Player(true, [p1HandContainer]);

	//useEffect(() => {
	//	game.Init(cards, [drawContainer, discardContainer], [p0, p1]);
	//}, []);

	function OnCardPreClick(card: RankSuitCard) {

	}

	function OnCardClick(card: RankSuitCard) {
		setGame(game.Action(card));
	}


	return (
		<>
		<div className="playingCards">

			<div style={{ maxWidth: 400, marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>

				<ul className="hand">
					{game.Players[1].CardContainers[0].Contents.map(c =>
						<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={OnCardClick} />)}
				</ul>

				<hr />

				<ul style={{ display: "inline-block", width: "200px", height: "150px" }} className="deck">
					{game.DrawDeck.Contents.slice(-10).map(c =>
						<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={OnCardClick} />)}
				</ul>

				<ul style={{display:"inline-block", width: "200px", height: "150px"}} className="deck">
					{game.DiscardDeck.Contents.slice(-10).map(c =>
						<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={OnCardClick} />)}
				</ul>

				<hr />

				<ul className="hand">
					{game.Players[0].CardContainers[0].Contents.map(c =>
						<RankSuitCardComponent key={c.Id}  game={game} card={c} onClick={OnCardClick} />)}
				</ul>

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