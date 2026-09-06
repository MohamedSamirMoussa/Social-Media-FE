import { io, Socket } from "socket.io-client";

export const socket: Socket = io(import.meta.env.VITE_BE_SOCKET_URI, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
});
