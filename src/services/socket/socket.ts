import { io, Socket } from "socket.io-client";

const socketOrigin = import.meta.env.DEV
  ? import.meta.env.VITE_BE_SOCKET_URI
  : window.location.origin;

export const socket: Socket = io(socketOrigin, {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
