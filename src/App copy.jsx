import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // connect to server

export default function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("Player");
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("server_welcome", (msg) => {
      setMessages((prev) => [...prev, { from: "Server", text: msg }]);
    });

    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("server_welcome");
      socket.off("chat_message");
    };
  }, []);

  const onSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = { from: name, text };
    socket.emit("chat_message", msg);
    setText("");
  };

  return (
    <div
      style={{ maxWidth: 520, margin: "40px auto", fontFamily: "system-ui" }}
    >
      <h2>Socket.IO Demo {connected ? "🟢" : "🔴"}</h2>

      <form
        onSubmit={onSend}
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 12,
          borderRadius: 8,
          minHeight: 200,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.from}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
