export default function handlePlaySocketService(
  socket,
  setGameOver,
  setWinner,
  setTurn,
  setPlayer1Deck,
  setPlayer2Deck,
  setCurrentColor,
  setCurrentNumber,
  setPlayedCardsPile,
  setDrawCardPile,
  setUsers,
  setRole,
  setCurrentOpponent
) {
  socket.on(
    "initGameState",
    ({
      gameOver,
      turn,
      player1Deck,
      player2Deck,
      currentColor,
      currentNumber,
      playedCardsPile,
      drawCardPile,
    }) => {
      setGameOver(gameOver);
      setTurn(turn);
      setPlayer1Deck(player1Deck);
      setPlayer2Deck(player2Deck);
      setCurrentColor(currentColor);
      setCurrentNumber(currentNumber);
      setPlayedCardsPile(playedCardsPile);
      setDrawCardPile(drawCardPile);
    }
  );

  socket.on(
    "updateGameState",
    ({
      gameOver,
      winner,
      turn,
      player1Deck,
      player2Deck,
      currentColor,
      currentNumber,
      playedCardsPile,
      drawCardPile,
    }) => {
      gameOver && setGameOver(gameOver);
      winner && setWinner(winner);
      turn && setTurn(turn);
      player1Deck && setPlayer1Deck(player1Deck);
      player2Deck && setPlayer2Deck(player2Deck);
      currentColor && setCurrentColor(currentColor);
      currentNumber && setCurrentNumber(currentNumber);
      playedCardsPile && setPlayedCardsPile(playedCardsPile);
      drawCardPile && setDrawCardPile(drawCardPile);
    }
  );

  socket.on("roomData", ({ users }) => {
    setUsers(users);
  });

  socket.on("currentUserData", ({ role, opponentName }) => {
    setRole(role);
    setCurrentOpponent(opponentName);
  });
}
