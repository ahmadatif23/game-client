import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [attempting, setAttempting] = useState(false);

  // 👇 configure socket with retries
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_SERVER_URL, {
      // transports: ["websocket", "polling"],
      reconnection: true, // enable auto-reconnect
      reconnectionAttempts: Infinity, // keep trying forever
      reconnectionDelay: 1000, // start retrying after 1s
      reconnectionDelayMax: 5000, // max delay 5s
    });
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Connected to server");
      setConnected(true);
      setAttempting(false);
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected from server");
      setConnected(false);
    };

    const handleReconnectAttempt = (attempt) => {
      console.log("♻️ Reconnecting… attempt:", attempt);
      setAttempting(true);
    };

    const handleReconnectFailed = () => {
      console.log("⚠️ Reconnect failed");
      setAttempting(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);
    socket.io.on("reconnect_failed", handleReconnectFailed);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.io.off("reconnect_failed", handleReconnectFailed);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connected, attempting }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
