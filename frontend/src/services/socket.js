import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://mindcraft-s573.onrender.com");

export default socket;
