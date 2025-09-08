import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CardBack from "../../components/CardBack";
import CardFront from "../../components/CardFront";

import { useSocket } from "../../context/SocketContext";
import handleCardPlayService from "../../utils/uno/handleCardPlay";
import handleInitiatePlayService from "../../utils/uno/handleInitiatePlay";
import handlePlaySocketService from "../../utils/uno/handlePlaySocket";
import MyModal from "../../components/Modal";
import { DialogTitle } from "@headlessui/react";
import handleCardDrawService from "../../utils/uno/handleCardDraw";

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
    B: "bg-blue-200",
    G: "bg-green-200",
    R: "bg-red-200",
    Y: "bg-yellow-200",
    "": "bg-gray-200",
  };

  useEffect(() => {
    if (!socket) return;

    handleInitiatePlayService(socket);
  }, []);

  useEffect(() => {
    if (!socket) return;

    handlePlaySocketService(
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
    );

    // cleanup
    return () => {
      socket.off("initGameState");
      socket.off("updateGameState");
      socket.off("roomData");
      socket.off("currentUserData");
    };
  }, []);

  const handleCardPlay = (card) => {
    handleCardPlayService(
      socket,
      card,
      turn,
      player1Deck,
      player2Deck,
      drawCardPile,
      currentNumber,
      currentColor,
      playedCardsPile
    );
  };

  const handleCardDraw = () => {
    handleCardDrawService(
      socket,
      turn,
      player1Deck,
      player2Deck,
      drawCardPile,
      currentNumber,
      currentColor,
      playedCardsPile
    );
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
              <div className="flex-1 flex justify-start flex-col">
                <div className="flex w-full items-center justify-center text-center pb-4">
                  <p className="font-bold">{currentOpponent}</p>
                </div>

                <div className="flex flex-wrap justify-center">
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
                    type="button"
                    disabled={turn !== role}
                    onClick={handleCardDraw}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:focus-visible:outline-indigo-500 cursor-pointer disabled:cursor-default disabled:bg-indigo-200"
                  >
                    Draw Card
                  </button>
                </div>

                <div className="flex justify-center">
                  {playedCardsPile?.length > 0 && (
                    <CardFront
                      item={playedCardsPile[playedCardsPile.length - 1]}
                      i={playedCardsPile.length - 1}
                      stack={true}
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 flex justify-end flex-col">
                <div className="flex flex-wrap justify-center">
                  {(role === "player1" ? player1Deck : player2Deck).map(
                    (item, i) => (
                      <button
                        key={i}
                        disabled={turn !== role}
                        onClick={() => handleCardPlay(item)}
                        className="cursor-pointer disabled:grayscale-75 disabled:cursor-default"
                      >
                        <CardFront item={item} i={i} />
                      </button>
                    )
                  )}
                </div>

                <div className="flex w-full items-center justify-center text-center pt-4">
                  <p className="font-bold">{playerName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {gameOver && (
        <MyModal isOpen={!!gameOver} setIsOpen={setGameOver}>
          <DialogTitle
            as="h3"
            className="text-lg/7 text-center font-medium text-black"
          >
            {winner === role ? "You Won" : "You Lose"}
          </DialogTitle>

          {/* <p className="mt-2 text-sm/6 text-white/50"></p> */}

          <div className="mt-4 flex items-center justify-center">
            <Link
              to="/uno/main"
              className="flex w-auto justify-center rounded-md px-3 py-2 text-sm/6 font-semibold shadow-xs bg-indigo-500 text-white hover:bg-indigo-400 dark:bg-indigo-400 aria-disabled:bg-indigo-200 aria-disabled:pointer-events-none"
            >
              Play New Game
            </Link>
          </div>
        </MyModal>
      )}
    </div>
  );
}
