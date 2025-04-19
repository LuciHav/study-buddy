import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import useConversation from "@/contexts/ConversationProvider";
import { useSocketContext } from "@/contexts/SocketProvider";
import { Check, PhoneOff, Video } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ConversationHeader({ user }) {
  const { onlineUsers } = useSocketContext();
  const {
    selectedContactUser,
    callStatus,
    setCallStatus,
    incomingCall,
    setIncomingCall,
  } = useConversation();
  const { socket } = useSocketContext();
  const incomingCallSoundRef = useRef(null);

  const isUserOnline = onlineUsers.includes(String(selectedContactUser?.id));

  useEffect(() => {
    if (incomingCall && !incomingCallSoundRef.current) {
      incomingCallSoundRef.current = new Audio("/call-sound.mp3");
      incomingCallSoundRef.current.loop = true;
      incomingCallSoundRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
        incomingCallSoundRef.current = null;
      });
    } else if (!incomingCall && incomingCallSoundRef.current) {
      incomingCallSoundRef.current.pause();
      incomingCallSoundRef.current.currentTime = 0;
      incomingCallSoundRef.current = null;
    }

    return () => {
      if (incomingCallSoundRef.current) {
        incomingCallSoundRef.current.pause();
        incomingCallSoundRef.current.currentTime = 0;
        incomingCallSoundRef.current = null;
      }
    };
  }, [incomingCall]);

  const stopIncomingCallSound = () => {
    if (incomingCallSoundRef.current) {
      incomingCallSoundRef.current.pause();
      incomingCallSoundRef.current.currentTime = 0;
      incomingCallSoundRef.current = null;
    }
  };

  const handleVideoCallRequest = () => {
    if (!socket || !selectedContactUser) return;
    socket.emit("call-user", { receiverId: selectedContactUser.id });
    setCallStatus("calling");
  };

  const handleAcceptCall = () => {
    if (socket && incomingCall) {
      stopIncomingCallSound();
      socket.emit("answer-call", {
        receiverId: incomingCall.callerId,
        accepted: true,
      });
      setCallStatus("in-call");
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    if (socket && incomingCall) {
      stopIncomingCallSound();
      socket.emit("answer-call", {
        receiverId: incomingCall.callerId,
        accepted: false,
      });
      setIncomingCall(null);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center space-x-3">
        <UserAvatar user={user} />
        <div>
          <h2 className="font-medium">
            {user.firstName + " " + user.lastName}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isUserOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            {isUserOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        {incomingCall ? (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
            <span className="text-sm font-medium animate-pulse text-red-500">
              Incoming Call...
            </span>
            <Button
              onClick={handleAcceptCall}
              variant="ghost"
              size="icon"
              className="text-green-500 hover:text-green-600 hover:bg-green-100/30"
            >
              <Check className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleRejectCall}
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-100/30"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleVideoCallRequest}
            variant="ghost"
            size="icon"
            disabled={callStatus !== "idle" || !isUserOnline}
          >
            <Video className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
