import { useRef, useEffect } from "react";

const WS_PORT = 8080;
const WS_URL = `ws://localhost:${WS_PORT}`;

const useSocket = () => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket(WS_URL);

    return () => {
      socket.current.close();
    };
  }, []);

  return socket; 
};

export default useSocket;