import { useEffect } from "react";
import useConversation from "@/contexts/ConversationProvider";
import { useSocketContext } from "@/contexts/SocketProvider";
import { toast } from "sonner";

const useListenToSocket = () => {
  const { socket } = useSocketContext();
  const {
    selectedContactUser,
    messages,
    setMessages,
    setIsTyping,
    setCallStatus,
    setIncomingCall,
    setRemotePeerId,
  } = useConversation();

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

    // Handle incoming video call (Callee receives)
    const handleIncomingCall = ({ callerId }) => {
      setIncomingCall({ callerId });
    };

    // Handle call answer response (Caller receives)
    const handleCallAnswered = ({ accepted }) => {
      if (accepted) {
        setCallStatus("in-call");
      } else {
        toast.info("Call rejected.");
        setCallStatus("idle");
      }
    };

    // Handle PeerJS ID readiness (Caller receives from Callee)
    const handlePeerIdReady = ({ peerId }) => {
      setRemotePeerId(peerId);
    };

    // Handle call ending (Either user can receive)
    const handleCallEnded = () => {
      setCallStatus("idle");
      setIncomingCall(null);
      setRemotePeerId(null);
    };

    socket?.on("message", handleMessage);
    socket?.on("typing", handleTyping);
    socket?.on("stopTyping", handleStopTyping);
    socket?.on("incoming-call", handleIncomingCall);
    socket?.on("call-answered", handleCallAnswered);
    socket?.on("peer-id-ready", handlePeerIdReady);
    socket?.on("call-ended", handleCallEnded);

    return () => {
      socket?.off("message", handleMessage);
      socket?.off("typing", handleTyping);
      socket?.off("stopTyping", handleStopTyping);
      socket?.off("incoming-call", handleIncomingCall);
      socket?.off("call-answered", handleCallAnswered);
      socket?.off("peer-id-ready", handlePeerIdReady);
      socket?.off("call-ended", handleCallEnded);
    };
  }, [
    socket,
    setMessages,
    messages,
    selectedContactUser,
    setIsTyping,
    setCallStatus,
    setIncomingCall,
    setRemotePeerId,
  ]);

  return null;
};

export default useListenToSocket;
