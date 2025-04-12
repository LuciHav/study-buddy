import { useEffect } from "react";
import useConversation from "@/contexts/ConversationProvider";
import { useSocketContext } from "@/contexts/SocketProvider";

const useListenToSocket = () => {
  const { socket } = useSocketContext();
  const { selectedContactUser, messages, setMessages, setIsTyping } =
    useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      if (message.senderId === selectedContactUser.id) {
        const sound = new Audio("/message-sound.mp3");
        sound.play().catch((err) => {
          console.error("Audio playback failed:", err);
        });
        setMessages([...messages, message]);
      }
    };

    const handleTyping = ({ senderId }) => {        
      if (senderId == selectedContactUser?.id) {  
        const sound = new Audio("/typing-sound.mp3");
        sound.play().catch((err) => {
          console.error("Audio playback failed:", err);
        });      
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId == selectedContactUser?.id) {
        setIsTyping(false);
      }
    };

    socket?.on("message", handleMessage);
    socket?.on("typing", handleTyping);
    socket?.on("stopTyping", handleStopTyping);

    return () => {
      socket?.off("message", handleMessage);
      socket?.off("typing", handleTyping);
      socket?.off("stopTyping", handleStopTyping);
    };
  }, [socket, setMessages, messages, selectedContactUser, setIsTyping]);

  return null;
};

export default useListenToSocket;
