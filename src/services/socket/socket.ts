import { io, Socket } from "socket.io-client";

export const socket: Socket = io(import.meta.env.VITE_BE_SOCKET_URI, {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
