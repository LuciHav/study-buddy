import { useEffect } from "react";
import { create } from "zustand";
import io from "socket.io-client";
import useAuth from "./AuthProvider";

const useSocketStore = create((set) => ({
  socket: null,
  onlineUsers: [],
  setSocket: (socket) => set({ socket }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

export const useSocketContext = () => {
  return useSocketStore();
};

export const useSetupSocket = () => {
  const { setSocket, setOnlineUsers } = useSocketStore();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        query: {
          userId: currentUser.id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.close();
    } else {
      const { socket } = useSocketStore.getState();
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [currentUser, setSocket, setOnlineUsers]);
};
