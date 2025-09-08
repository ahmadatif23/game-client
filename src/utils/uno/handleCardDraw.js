export default function handleCardDrawService(
  socket,
  turn,
  player1Deck,
  player2Deck,
  drawCardPile,
  currentNumber,
  currentColor,
  playedCardsPile
) {
  let nextTurn = turn === "player1" ? "player2" : "player1";
  let updatedPlayer1Deck = [...player1Deck];
  let updatedPlayer2Deck = [...player2Deck];
  let updatedDrawPile = [...drawCardPile];

  // Draw top card
  const drawCard = updatedDrawPile.pop();
  if (!drawCard) return; // safety

  let colorOfDrawnCard = drawCard[drawCard.length - 1];
  let numberOfDrawnCard = drawCard[0];

  // --- Check if drawn card is playable ---
  let isPlayable =
    currentColor === colorOfDrawnCard || // same color
    currentNumber === numberOfDrawnCard || // same number
    drawCard === "W" ||
    drawCard === "D4W";

  // ✅ Special rule: Skip/D2 only playable if color matches
  const isSkipOrD2 = drawCard.startsWith("skip") || drawCard.startsWith("D2");
  if (isSkipOrD2) {
    isPlayable =
      currentColor === colorOfDrawnCard || currentNumber === numberOfDrawnCard;
  }

  if (isPlayable) {
    // --- Apply effects only if actually played ---
    if (drawCard.startsWith("skip")) {
      nextTurn = turn; // same player keeps turn
      numberOfDrawnCard = 404;
    } else if (drawCard.startsWith("D2")) {
      numberOfDrawnCard = 252;
      const penaltyCards = [
        updatedDrawPile.pop(),
        updatedDrawPile.pop(),
      ].filter(Boolean);
      if (turn === "player1") {
        updatedPlayer2Deck.push(...penaltyCards);
      } else {
        updatedPlayer1Deck.push(...penaltyCards);
      }
    } else if (drawCard === "W") {
      const newColor = prompt(
        "Enter first letter of new color (R/G/B/Y)"
      )?.toUpperCase();
      numberOfDrawnCard = 300;
      if (newColor) colorOfDrawnCard = newColor;
    } else if (drawCard === "D4W") {
      const newColor = prompt(
        "Enter first letter of new color (R/G/B/Y)"
      )?.toUpperCase();
      numberOfDrawnCard = 600;
      if (newColor) colorOfDrawnCard = newColor;

      const penaltyCards = [
        updatedDrawPile.pop(),
        updatedDrawPile.pop(),
        updatedDrawPile.pop(),
        updatedDrawPile.pop(),
      ].filter(Boolean);

      if (turn === "player1") {
        updatedPlayer2Deck.push(...penaltyCards);
      } else {
        updatedPlayer1Deck.push(...penaltyCards);
      }
    }

    // ✅ Play immediately
    socket.emit("updateGameState", {
      turn: nextTurn,
      playedCardsPile: [...playedCardsPile, drawCard],
      player1Deck: updatedPlayer1Deck,
      player2Deck: updatedPlayer2Deck,
      currentColor: colorOfDrawnCard,
      currentNumber: numberOfDrawnCard,
      drawCardPile: updatedDrawPile,
    });
  } else {
    // Not playable → goes into hand
    if (turn === "player1") {
      updatedPlayer1Deck.push(drawCard);
    } else {
      updatedPlayer2Deck.push(drawCard);
    }

    socket.emit("updateGameState", {
      turn: nextTurn,
      playedCardsPile,
      player1Deck: updatedPlayer1Deck,
      player2Deck: updatedPlayer2Deck,
      currentColor,
      currentNumber,
      drawCardPile: updatedDrawPile,
    });
  }
}
