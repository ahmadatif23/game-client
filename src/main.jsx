import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Chat from "./pages/Chat";
import Uno from "./pages/Uno";
import TicTacToe from "./pages/TicTacToe";
import { SocketProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/uno" element={<Uno />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </React.StrictMode>
);
