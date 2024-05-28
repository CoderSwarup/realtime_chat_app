import io from "socket.io-client";

let socket;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const connectSocket = (user_id) => {
  if (!user_id) {
    return;
  }
  socket = io(SOCKET_URL, {
    query: { user_id: user_id },
  });
};

export { socket, connectSocket };
