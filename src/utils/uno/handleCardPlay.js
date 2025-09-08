import { checkGameOver, checkWinner } from "./checkGameStatus";

export default function handleCardPlayService(
  socket,
  card,
  turn,
  player1Deck,
  player2Deck,
  drawCardPile,
  currentNumber,
  currentColor,
  playedCardsPile
) {
  let nextTurn = turn === "player1" ? "player2" : "player1";
  let updatedPlayer1Deck = player1Deck;
  let updatedPlayer2Deck = player2Deck;
  let updatedDrawPile = [...drawCardPile];
  let numberOfPlayedCard = currentNumber;
  let colorOfPlayedCard = currentColor;

  const currentDeck = turn === "player1" ? player1Deck : player2Deck;
  const removeIndex = currentDeck.indexOf(card);

  // deck after playing card
  const updatedDeck = [
    ...currentDeck.slice(0, removeIndex),
    ...currentDeck.slice(removeIndex + 1),
  ];

  // default deck update
  if (turn === "player1") updatedPlayer1Deck = updatedDeck;
  else updatedPlayer2Deck = updatedDeck;

  // --- Skip ---
  if (card.startsWith("skip")) {
    nextTurn = turn; // same player keeps turn
    numberOfPlayedCard = 404;
    colorOfPlayedCard = card[4];
  }

  // --- Draw 2 ---
  else if (card.startsWith("D2")) {
    numberOfPlayedCard = 252;
    colorOfPlayedCard = card[2];

    const copiedDrawCardPileArray = [...updatedDrawPile];
    const drawCard1 = copiedDrawCardPileArray.pop();
    const drawCard2 = copiedDrawCardPileArray.pop();

    if (turn === "player1") {
      updatedPlayer1Deck = updatedDeck;
      updatedPlayer2Deck = [...player2Deck, drawCard1, drawCard2];
    } else {
      updatedPlayer2Deck = updatedDeck;
      updatedPlayer1Deck = [...player1Deck, drawCard1, drawCard2];
    }

    updatedDrawPile = copiedDrawCardPileArray;
  }

  // --- Wild card ---
  else if (card === "W") {
    const newColor = prompt(
      "Enter first letter of new color (R/G/B/Y)"
    ).toUpperCase();
    numberOfPlayedCard = 300;
    colorOfPlayedCard = newColor;
  }

  // --- Draw 4 ---
  else if (card === "D4W") {
    const newColor = prompt(
      "Enter first letter of new color (R/G/B/Y)"
    ).toUpperCase();
    numberOfPlayedCard = 600;
    colorOfPlayedCard = newColor;

    const copiedDrawCardPileArray = [...updatedDrawPile];
    const drawCard1 = copiedDrawCardPileArray.pop();
    const drawCard2 = copiedDrawCardPileArray.pop();
    const drawCard3 = copiedDrawCardPileArray.pop();
    const drawCard4 = copiedDrawCardPileArray.pop();

    if (turn === "player1") {
      updatedPlayer1Deck = updatedDeck;
      updatedPlayer2Deck = [
        ...player2Deck,
        drawCard1,
        drawCard2,
        drawCard3,
        drawCard4,
      ];
    } else {
      updatedPlayer2Deck = updatedDeck;
      updatedPlayer1Deck = [
        ...player1Deck,
        drawCard1,
        drawCard2,
        drawCard3,
        drawCard4,
      ];
    }

    updatedDrawPile = copiedDrawCardPileArray;
  }

  // --- Number card ---
  else if (/^\d[RGBY]$/.test(card) || card.startsWith("_")) {
    numberOfPlayedCard = card[0];
    colorOfPlayedCard = card[1];
  }

  // --- Only play if valid move ---
  if (
    currentColor === colorOfPlayedCard ||
    currentNumber === numberOfPlayedCard ||
    card === "W" ||
    card === "D4W"
  ) {
    socket.emit("updateGameState", {
      gameOver: checkGameOver(currentDeck),
      winner: checkWinner(currentDeck, turn),
      turn: nextTurn,
      playedCardsPile: [...playedCardsPile, card],
      player1Deck: updatedPlayer1Deck,
      player2Deck: updatedPlayer2Deck,
      currentColor: colorOfPlayedCard,
      currentNumber: numberOfPlayedCard,
      drawCardPile: updatedDrawPile,
    });
  }
}
