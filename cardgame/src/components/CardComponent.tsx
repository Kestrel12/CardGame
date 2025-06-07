import { useState, useEffect, useRef } from 'react';
import { Game, Card, RankSuitCard } from '../CardEngine';
import { DataStore } from '../DataStore';
import type CSS from 'csstype';


function RankSuitCardComponent({ game, card, onClick }: { game: Game, card: RankSuitCard, onClick: ((c:RankSuitCard) => void) }) {

    const cardClass = "card rank-" + card.Rank + " " + card.Suit.SuitName;

    const [liStyle, setLiStyle] = useState(card.IsNew ?
        { opacity: 0, top: "-50px" }
        : { opacity: 1, top: "0px" } as CSS.Properties);
    [card.IsMoving, card.SetIsMoving] = useState(false);
    const liRef = useRef<HTMLLIElement>(null);


    function handleClick() {

        if (!game.IsPlayEnabled(card)) { return; }

        animateCardUp().then(() => onClick(card));
    }

    async function animateCardUp() {
        setLiStyle({ opacity: 0, top: "-50px" });
        await new Promise(r => setTimeout(r, DataStore.Config.AnimationTimeMs));
    }

    useEffect(() => {
        if (card.IsMoving) {
            animateCardUp();
        }
    }, [card.IsMoving]);

    useEffect(() => {
        setTimeout(() => {
            setLiStyle({ opacity: 1, top: "0px" });
            card.IsNew = false;
            card.Animate = animateCardUp;
        }, 10);
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