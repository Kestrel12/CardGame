import { useState, useEffect, useRef } from 'react';
import { Game, Card, RankSuitCard } from '../CardEngine';
import type CSS from 'csstype';


function RankSuitCardComponent({ game, card, onClick }: { game: Game, card: RankSuitCard, onClick: ((c:RankSuitCard) => void) }) {

    const cardClass = "card rank-" + card.Rank + " " + card.Suit.SuitName;

    const [liClass, setLiClass] = useState("");
    const [liStyle, setLiStyle] = useState({ opacity: undefined, top: undefined } as CSS.Properties);
    [card.Moving, card.SetMoving] = useState(false);
    const liRef = useRef<HTMLLIElement>(null);


    function handleClick() {

        if (!game.IsPlayEnabled(card)) { return; }

        triggerAction();

    }

    function triggerAction() {
        setLiStyle({ opacity: 0, top: "-50px" });
        //setLiClass("");

        setTimeout(() => {
            onClick(card);

            // cleanup due to the card state getting re-used
            // by a different card when they shift down in the collection
            //setLiClass("cardLiTransition");
            //setLiStyle({ opacity: 1, top: "0px" });
            //card.SetMoving(false);
        }, 500);
    }

    useEffect(() => {
        if (card.Moving) {
            triggerAction();
        }
    }, [card.Moving]);

    useEffect(() => {
        setLiStyle({ opacity: 1, top: "0px" });
    }, []);


    if (card.FaceUp) {
        return (
            <li ref={liRef} className="cardLiTransition" style={liStyle}>
                <div className={cardClass} onClick={handleClick}>
                    <span className="rank">{card.Rank}</span>
                    <span className="suit">{card.Suit.SuitIcon}</span>
                </div>
            </li>
        );
    } else {
        return (
            <li ref={liRef} className="cardLiTransition" style={liStyle}>
                <div className="card back" onClick={handleClick}>
                </div>
            </li>
        );
    }
}

export { RankSuitCardComponent };