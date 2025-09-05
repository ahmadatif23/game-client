import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CardBack from "../../components/CardBack";
import CardFront from "../../components/CardFront";
import { PACK_OF_CARDS } from "../../constants/cards";
import shuffleArray from "../../utils/shuffleArray";
import { useSocket } from "../../context/SocketContext";

//NUMBER CODES FOR ACTION CARDS
//SKIP - 404
//DRAW 2 - 252
//WILD - 300
//DRAW 4 WILD - 600

export default function UnoRoom() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const room = queryParams.get("roomCode");
  const playerName = queryParams.get("name");

  const { socket, connected, attempting } = useSocket();

  // useState: Initialize socket state
  const [roomFull, setRoomFull] = useState(false);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [currentOpponent, setCurrentOpponent] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // useEffect: Initialize socket
  useEffect(() => {
    if (!socket || !room) return;

    socket?.emit("join", { room, playerName }, (error) => {
      if (error) setRoomFull(true);
    });
  }, [room]);

  // useState: Initialize game state
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [drawCardPile, setDrawCardPile] = useState([]);

  // map UNO colors → Tailwind background classes
  const COLOR_MAP = {
    B: "bg-blue-100",
    G: "bg-green-100",
    R: "bg-red-100",
    Y: "bg-yellow-100",
    "": "bg-gray-100",
  };

  useEffect(() => {
    if (!socket) return;

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
  }, []);

  useEffect(() => {
    if (!socket) return;

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
        console.log({
          gameOver,
          winner,
          turn,
          player1Deck,
          player2Deck,
          currentColor,
          currentNumber,
          playedCardsPile,
          drawCardPile,
        });
        gameOver && setGameOver(gameOver);
        gameOver === true && playGameOverSound();
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

    // cleanup
    return () => {
      socket.off("initGameState");
      socket.off("updateGameState");
      socket.off("roomData");
      socket.off("currentUserData");
    };
  }, []);

  const handleCardPlay = (card) => {
    if (/^\d[RGBY]$/.test(card) || card.startsWith("skip")) {
      let numberOfPlayedCard = null;
      let colorOfPlayedCard = null;

      // Skip card
      if (card.startsWith("skip")) {
        colorOfPlayedCard = card[4]; // e.g. "skipR" → "R"
        numberOfPlayedCard = 404; // special code for skip
      }

      // Number card (regex match like "5R")
      else if (/^\d[RGBY]$/.test(card)) {
        numberOfPlayedCard = card[0]; // "5"
        colorOfPlayedCard = card[1]; // "R"
      }

      // Determine next turn
      let nextTurn = turn === "player1" ? "player2" : "player1";

      // If skip card → keep the same player’s turn
      if (card.startsWith("skip")) {
        nextTurn = turn;
      }

      if (
        currentColor === colorOfPlayedCard ||
        currentNumber === numberOfPlayedCard
      ) {
        // choose deck based on turn
        const currentDeck = turn === "player1" ? player1Deck : player2Deck;
        const removeIndex = currentDeck.indexOf(card);

        // build updated deck after playing card
        const updatedDeck = [
          ...currentDeck.slice(0, removeIndex),
          ...currentDeck.slice(removeIndex + 1),
        ];

        socket.emit("updateGameState", {
          // gameOver: checkGameOver(player1Deck),
          // winner: checkWinner(player1Deck, "Player 1"),
          turn: nextTurn,
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            card,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          player1Deck: turn === "player1" ? updatedDeck : player1Deck,
          player2Deck: turn === "player2" ? updatedDeck : player2Deck,
          currentColor: colorOfPlayedCard,
          currentNumber: numberOfPlayedCard,
        });
      }
    }

    if (card.startsWith("_")) {
      console.log("reverse", card);
    }

    if (card.startsWith("D2")) {
      console.log("draw2", card);
    }

    if (card === "W") {
      console.log("wild", card);
    }

    if (card === "D4W") {
      console.log("draw4", card);
    }
  };

  return (
    <div className={`w-screen h-screen p-4 ${COLOR_MAP[currentColor]}`}>
      {roomFull ? (
        <div className="flex w-full h-full items-center justify-center">
          <h1>Room Full</h1>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          {users.length === 1 && role === "player2" && (
            <h1>Player 1 has left the game.</h1>
          )}

          {users.length === 1 && role === "player1" && (
            <h1>Waiting for Player 2 to join the game.</h1>
          )}

          {users.length === 2 && (
            <div className="w-full h-full flex flex-col justify-between">
              <div>
                <p>{currentOpponent}</p>

                <div className="flex items-start justify-center">
                  {(role === "player1" ? player2Deck : player1Deck).map(
                    (_, i) => (
                      <CardBack key={i} i={i} />
                    )
                  )}
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

              <div>
                <p>{playerName}</p>

                <div className="flex items-start justify-center">
                  {(role === "player1" ? player1Deck : player2Deck).map(
                    (item, i) => (
                      <div
                        key={i}
                        onClick={() => handleCardPlay(item)}
                        className="cursor-pointer"
                      >
                        <CardFront item={item} i={i} />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
