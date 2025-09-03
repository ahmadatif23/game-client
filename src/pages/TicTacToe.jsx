import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function TicTacToe() {
  const { socket, connected } = useSocket();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");

  useEffect(() => {
    if (!socket) return;

    socket.on("game_state", (game) => {
      setBoard(game.board);
      setTurn(game.turn);
    });

    return () => {
      socket.off("game_state");
    };
  }, [socket]);

  const makeMove = (i) => {
    if (!connected) return;
    socket.emit("make_move", i);
  };

  const resetGame = () => {
    socket.emit("reset_game");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Tic Tac Toe {connected ? "🟢" : "🔴"}</h2>
      <p>Turn: {turn}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridGap: 5,
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => makeMove(i)}
            style={{
              width: 100,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              border: "2px solid #333",
              cursor: cell ? "not-allowed" : "pointer",
              background: cell ? "#f9f9f9" : "#fff",
            }}
          >
            {cell}
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{ marginTop: 20, padding: "8px 16px" }}
      >
        Reset Game
      </button>
    </div>
  );
}
