import React from 'react';
import logo from './logo.svg';
import './App.css';
import './resources/css/cards.css';
import { Suit, RankSuitCard, CardContainer, Player } from './CardEngine';
import BoardEights from './components/BoardEights';


const suitSpades = new Suit("spades", "♠", "black");
const suitHearts = new Suit("hearts", "♥", "red");
const suitDiams = new Suit("diams", "♦", "red");
const suitClubs = new Suit("clubs", "♣", "black");

const deck = [
    new RankSuitCard("2", suitClubs),
    new RankSuitCard("4", suitHearts),
    new RankSuitCard("J", suitHearts),
    new RankSuitCard("7", suitClubs),
    new RankSuitCard("Q", suitClubs),
    new RankSuitCard("3", suitHearts),
    new RankSuitCard("J", suitSpades),
    new RankSuitCard("Q", suitHearts)]

const gameDefinitionEights2p = {

    /*decks: [
        new CardContainer("draw", [
            new RankSuitCard("2", suitClubs),
            new RankSuitCard("4", suitHearts),
            new RankSuitCard("J", suitSpades),
            new RankSuitCard("7", suitClubs)
        ]),
        new CardContainer("discard", [
            new RankSuitCard("K", suitDiams)
        ])
    ],

    players: [
        new Player(false, [new CardContainer("hand", [
            new RankSuitCard("K", suitClubs),
            new RankSuitCard("5", suitHearts),
            new RankSuitCard("6", suitSpades),
            new RankSuitCard("2", suitClubs)
        ])]),
        new Player(true, [new CardContainer("hand", [
            new RankSuitCard("Q", suitClubs),
            new RankSuitCard("3", suitHearts),
            new RankSuitCard("J", suitSpades),
            new RankSuitCard("Q", suitClubs)
        ])])
    ]*/

}

function App() {

  

  return (
      <>
          <BoardEights
              deck={deck} />
    </>
  );
}

export default App;
