import { useState, useEffect, useRef } from 'react';
import { Card, RankSuitCard } from '../CardEngine';
import type CSS from 'csstype';

function CardComponent({ card }: { card: Card }) {
    return (
        <li>
            <div className="card back">
            
            </div>
        </li>
    );
}

function RankSuitCardComponent({ card, onClick }: { card: RankSuitCard, onClick: ((c:RankSuitCard) => void) }) {

    const cardClass = "card rank-" + card.Rank + " " + card.Suit.SuitName;

    const [liClass, setLiClass] = useState("");
    const [liStyle, setLiStyle] = useState({ opacity: undefined, top: undefined } as CSS.Properties);
    const liRef = useRef<HTMLLIElement>(null);


    function handleClick() {
        //let newContainer = card.StartHandleClick();
        if (liRef.current) {

            //const rect = liRef.current.getBoundingClientRect();

            setLiStyle({ opacity: 0, top: "-50px" });
            setLiClass("");

            setTimeout(() => {
                onClick(card);
                setLiClass("cardLiTransition");
                setLiStyle({ opacity: 1, top: "0px" });
            }, 500);

        }

    }

    useEffect(() => {
        setLiStyle({ opacity: 1, top: "0px" });
    }, []);


    if (card.FaceUp) {
        return (
            <li key={card.Id} ref={liRef} className="cardLiTransition" style={liStyle}>
                <div className={cardClass} onClick={handleClick}>
                    <span className="rank">{card.Rank}</span>
                    <span className="suit">{card.Suit.SuitIcon}</span>
                </div>
            </li>
        );
    } else {
        return (
            <li key={card.Id} ref={liRef} className="cardLiTransition" style={liStyle}>
                <div className="card back" onClick={handleClick}>
                </div>
            </li>
        );
    }
}

export { CardComponent, RankSuitCardComponent };