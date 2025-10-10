import { io } from "socket.io-client";

export const socket = io("https://api-chat-azure.vercel.app", {
  transports: ['polling', 'websocket'],
  withCredentials: true,
  path: '/socket.io',
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});