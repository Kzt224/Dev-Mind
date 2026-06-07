import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId, uri, token) => {
    try {
        if (!socket) {
            socket = io(uri, {
                transports: ["websocket"],
                autoConnect: true,
                query: { userId, token },
            });

            return socket;
        }
    } catch (error) {
        console.log("Error", error);
    }
}

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
