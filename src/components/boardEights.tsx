import { useState } from 'react';
import { RankSuitCard, CardContainer, Player } from '../CardEngine';
import { CardComponent, RankSuitCardComponent } from './CardComponent';

export default function BoardEights(
	{ deck }: { deck: RankSuitCard[]}) {

	// cut inputs down to cards + instructions

	const [drawDeck, setDrawDeck] = useState(deck);
	const drawContainer = new CardContainer("draw", drawDeck, setDrawDeck);

	const [discardDeck, setDiscardDeck] = useState([] as RankSuitCard[]);
	const discardContainer = new CardContainer("discard", discardDeck, setDiscardDeck);

	const [p1Hand, setP1Hand] = useState([] as RankSuitCard[]);
	const p1HandContainer = new CardContainer("hand", p1Hand, setP1Hand);
	const p1 = new Player(false, [p1HandContainer]);

	const [p2Hand, setP2Hand] = useState([] as RankSuitCard[]);
	const p2HandContainer = new CardContainer("hand", p2Hand, setP2Hand);
	const p2 = new Player(true, [p2HandContainer]);
	

	function OnCardClick(card: RankSuitCard, container: CardContainer) {

	}


	return (
		<div className="playingCards">

			<div style={{ maxWidth: 400, marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>

				<ul className="hand">
					{p2.CardContainers[0].Contents.map(c => 
						<CardComponent card={c}/>)}
				</ul>

				<hr />

				<ul style={{ display: "inline-block", width: "100px", height: "150px" }} className="deck">
					{drawContainer.Contents.map(c =>
						<RankSuitCardComponent card={c} />)}
				</ul>

				<ul style={{display:"inline-block", width: "100px", height: "150px"}} className="deck">
					{discardContainer.Contents.map(c =>
						<CardComponent card={c}/>)}
				</ul>

				<hr />

				<ul className="hand">
					{p1.CardContainers[0].Contents.map(c =>
						<RankSuitCardComponent card={c} />)}
				</ul>

			</div>

		</div>
	)
}