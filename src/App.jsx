import { Link } from "react-router-dom";

export default function App() {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Game Hub 🎮</h1>
      <nav
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Link to="/chat">Chat Room</Link>
        <Link to="/uno">Play UNO</Link>
        <Link to="/tic-tac-toe">Play Tic Tac Toe</Link>
      </nav>
    </div>
  );
}
