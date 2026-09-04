import { useEffect } from "react";
import { socket } from "../services/socket/socket";
import { useAppSelector } from "./hooks";

export const useSocket = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated && !socket.connected) {
      socket.connect();
    }

    if (!isAuthenticated && socket.connected) {
      socket.disconnect();
    }
  }, [isAuthenticated]);

  return socket;
};
