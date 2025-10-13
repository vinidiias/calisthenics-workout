import { io } from "socket.io-client";
// https://api-chat-azure.vercel.app
// https://calisthenics-workout.onrender.com
// http://localhost:5000
export const socket = io("http://localhost:5000");