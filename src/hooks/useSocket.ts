import { useEffect } from "react";
import { socket } from "../services/socket/socket";
import { useAppSelector } from "./hooks";
import { jwtDecode } from "jwt-decode";
export const useSocket = () => {
  const { isAuthenticated, socketToken, signatureLevel } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && socketToken) {
      console.log({
        signatureLevel,
        tokenPayload: jwtDecode(socketToken),
      });
      socket.auth = {
        token: socketToken,
        signatureLevel,
      };

      if (!socket.connected) {
        socket.connect();
      }

      return;
    }

    if (socket.connected) {
      socket.disconnect();
    }
  }, [isAuthenticated, signatureLevel, socketToken]);

  return socket;
};
