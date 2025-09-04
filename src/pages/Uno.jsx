import { useEffect, useState } from "react";
import CardBack from "../components/CardBack";
import CardFront from "../components/CardFront";
import { PACK_OF_CARDS } from "../constants/cards";
import shuffleArray from "../utils/shuffleArray";

export default function Uno() {
  const [gameOver, setGameOver] = useState(true);
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [drawCardPile, setDrawCardPile] = useState([]);
  const [turn, setTurn] = useState("");

  useEffect(() => {
    const shuffledCards = shuffleArray(PACK_OF_CARDS);
    const player1Deck = shuffledCards.splice(0, 5);
    const player2Deck = shuffledCards.splice(0, 5);

    let startingCardIndex;
    while (true) {
      startingCardIndex = Math.floor(Math.random() * 94);
      if (
        shuffledCards[startingCardIndex] === "skipR" ||
        shuffledCards[startingCardIndex] === "_R" ||
        shuffledCards[startingCardIndex] === "D2R" ||
        shuffledCards[startingCardIndex] === "skipG" ||
        shuffledCards[startingCardIndex] === "_G" ||
        shuffledCards[startingCardIndex] === "D2G" ||
        shuffledCards[startingCardIndex] === "skipB" ||
        shuffledCards[startingCardIndex] === "_B" ||
        shuffledCards[startingCardIndex] === "D2B" ||
        shuffledCards[startingCardIndex] === "skipY" ||
        shuffledCards[startingCardIndex] === "_Y" ||
        shuffledCards[startingCardIndex] === "D2Y" ||
        shuffledCards[startingCardIndex] === "W" ||
        shuffledCards[startingCardIndex] === "D4W"
      ) {
        continue;
      } else break;
    }

    const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);
    const drawCardPile = shuffledCards;

    // set game state to start
    setGameOver(false);
    setTurn("Player 1");
    setPlayer1Deck(player1Deck);
    setPlayer2Deck(player2Deck);
    setCurrentColor(
      playedCardsPile.length > 0 ? playedCardsPile[0].charAt(1) : null
    );
    setCurrentNumber(
      playedCardsPile.length > 0 ? playedCardsPile[0].charAt(0) : null
    );
    setPlayedCardsPile(...playedCardsPile);
    setDrawCardPile(...drawCardPile);
  }, []);

  const handleCardPlay = (card) => {
    console.log(card);
  };

  return (
    <div className="w-screen h-screen p-4 flex flex-col justify-between">
      <div className="player2Deck">
        <p className="playerDeckText">Player 2</p>

        <div className="flex items-start justify-center">
          {player2Deck.map((item, i) => (
            <CardBack key={i} i={i} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:focus-visible:outline-indigo-500"
          >
            Draw Card
          </button>
        </div>

        <div className="flex justify-center">
          {playedCardsPile?.length > 0 && (
            <CardFront
              item={playedCardsPile[playedCardsPile.length - 1]}
              i={playedCardsPile.length - 1}
            />
          )}
        </div>
      </div>

      <div className="player1Deck">
        <p className="playerDeckText">Player 1</p>

        <div className="flex items-start justify-center">
          {player1Deck.map((item, i) => (
            <div
              key={i}
              onClick={() => handleCardPlay(item)}
              className="cursor-pointer"
            >
              <CardFront item={item} i={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
