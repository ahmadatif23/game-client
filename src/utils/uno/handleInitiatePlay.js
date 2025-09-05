import { PACK_OF_CARDS } from "../../constants/cards";
import shuffleArray from "../shuffleArray";

export default function handleInitiatePlayService(socket) {
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

  socket.emit("initGameState", {
    gameOver: false,
    turn: "player1",
    player1Deck: [...player1Deck],
    player2Deck: [...player2Deck],
    currentColor:
      playedCardsPile.length > 0 ? playedCardsPile[0].charAt(1) : null,
    currentNumber:
      playedCardsPile.length > 0 ? playedCardsPile[0].charAt(0) : null,
    playedCardsPile: [...playedCardsPile],
    drawCardPile: [...drawCardPile],
  });
}
