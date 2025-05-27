import { RankSuitColorCard, CardContainer, Player } from '../CardEngine';

export default function BoardEights(
	{ decks, players }: { decks: CardContainer[], players: Player[] }) {
	return (
		<div className="playingCards">


			<ul className="hand">
				{players[0].CardContainers[0].map(c => 
					<li><div className="card rank-</li>)
			</ul>

			<ul className="deck">

			</ul>

		</div>
	)
}