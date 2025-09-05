import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.jsx";
import App from "./App";
import Chat from "./pages/Chat";
import TicTacToe from "./pages/TicTacToe";
import UnoMain from "./pages/Uno/UnoMain.jsx";
import UnoRoom from "./pages/Uno/UnoRoom.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/uno">
            <Route path="main" element={<UnoMain />} />
            <Route path="room" element={<UnoRoom />} />
          </Route>
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </React.StrictMode>
);
