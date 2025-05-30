import { useState, useEffect, useRef } from 'react';
import { Card, RankSuitCard } from '../CardEngine';
import CSS from 'csstype';

function CardComponent({ card }: { card: Card }) {
    return (
        <li>
            <div className="card back">
            
            </div>
        </li>
    );
}

function RankSuitCardComponent({ card, onClick }: { card: RankSuitCard, onClick: ((c:RankSuitCard) => void) }) {

    const cardCss = "card rank-" + card.Rank + " " + card.Suit.SuitName;

    const [liClass, setLiClass] = useState("");
    const [liStyle, setLiStyle] = useState({ opacity: 1, top: undefined } as CSS.Properties);
    const liRef = useRef<HTMLLIElement>(null);


    function handleClick() {
        //let newContainer = card.StartHandleClick();
        if (liRef.current) {

            //const rect = liRef.current.getBoundingClientRect();

            setLiStyle({ opacity: 0, top: "-50px" });

            setTimeout(() => onClick(card), 500);

            //setTimeout(() => {
            //    setLiClass(".cardLiTransition");
            //}, 1000);

            //setTimeout(() => {
            //    setLiStyle({ position: "fixed", top: rect.top + 100, left: rect.left + 100 });
            //}, 2000);
            //setLiStyle({ position: "fixed", top: rect.top + 100, left: rect.left + 100});

        }
        //setLiStyle({ position: "fixed", top: "0px", left: "0px"});
        //setLiStyle({ position: "fixed", top: "100px", left: "100px"});

    }

    useEffect(() => {
        setLiStyle({ opacity: 1, top: "0px" });
    }, []);

    //useEffect(() => {
    //    setTimeout(() => {
    //        setLiStyle({ opacity: 1, top: "0px" });
    //    }, 5);
    //}, []);

    return (
        <li key={card.Id} ref={liRef} className="cardLiTransition" style={liStyle}>
            <div className={cardCss} onClick={handleClick}> 
                <span className="rank">{card.Rank}</span>
                <span className="suit">{card.Suit.SuitIcon}</span>
            </div>
        </li>
    );
}

export { CardComponent, RankSuitCardComponent };