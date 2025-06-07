import { Game, RankSuitCard, CardContainer} from '../CardEngine';
import { RankSuitCardComponent } from './CardComponent';

function HandComponent({ game, container, onCardClick }: { game: Game, container: CardContainer, onCardClick: (c: RankSuitCard) => void }) {
	return (
		<ul className= "hand" >
		{container.Contents.map(c =>
			<RankSuitCardComponent key={ c.Id } game = { game } card = { c } onClick = { onCardClick } />)
	}
		</ul>);
}

function DeckComponent({game, container, onCardClick }: { game: Game, container: CardContainer, onCardClick: (c: RankSuitCard) => void}) {
	return (
		<ul style={{ display: "inline-block", width: "110px", height: "100px" }} className="deck">
			{container.Contents.slice(-10).map(c =>
				<RankSuitCardComponent key={c.Id} game={game} card={c} onClick={onCardClick} />)}
		</ul>
	);
}

export {HandComponent, DeckComponent}