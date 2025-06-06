import { Game, RankSuitCard, CardContainer} from '../CardEngine';
import { RankSuitCardComponent } from './CardComponent';

export default function HandComponent(game: Game, container: CardContainer, onCardClick: (c: RankSuitCard) => void) {
	return (
		<ul className= "hand" >
		{container.Contents.map(c =>
			<RankSuitCardComponent key={ c.Id } game = { game } card = { c } onClick = { onCardClick } />)
	}
		</ul>);
}