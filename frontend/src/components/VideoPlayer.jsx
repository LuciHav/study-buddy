import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhoneOff, Video } from "lucide-react";
import { useSocketContext } from "@/contexts/SocketProvider";
import useConversation from "@/contexts/ConversationProvider";
import useAuth from "@/contexts/AuthProvider";
import { toast } from "sonner";
import Peer from "peerjs";

export default function VideoPlayer() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const callRef = useRef(null);

  const { socket } = useSocketContext();
  const {
    callStatus,
    setCallStatus,
    selectedContactUser,
    remotePeerId,
    setRemotePeerId,
  } = useConversation();
  const { currentUser } = useAuth();

  const [connectionStatus, setConnectionStatus] = useState("");
  const isCaller = useRef(callStatus === "calling");

  // Initialize PeerJS
  useEffect(() => {
    let peer = null;
    let stream = null;

    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peer = new Peer();
        peerRef.current = peer;

        peer.on("open", (id) => {
          console.log("My PeerJS ID:", id);
          if (!isCaller.current && selectedContactUser) {
            socket.emit("peer-id-ready", {
              receiverId: selectedContactUser.id,
              peerId: id,
            });
            setCallStatus("in-call");
            setConnectionStatus("waiting-for-caller");
          }
        });

        peer.on("call", (call) => {
          console.log("Incoming PeerJS call");
          callRef.current = call;
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            console.log("Received remote stream");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setConnectionStatus("connected");
          });

          call.on("close", handleEndCall);
          call.on("error", (err) => {
            console.error("PeerJS Call error:", err);
            toast.error("Call connection error");
            handleEndCall();
          });
        });

        peer.on("error", (err) => {
          console.error("PeerJS Peer error:", err);
          toast.error("Peer connection error");
          handleEndCall();
        });
      } catch (err) {
        console.error("Media/PeerJS setup error:", err);
        toast.error("Could not access camera/mic or initialize call.");
        handleEndCall();
      }
    };

    if (callStatus === "calling" || callStatus === "in-call") {
      init();
    }

    return () => {
      console.log("Cleaning up VideoPlayer PeerJS");
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (callRef.current) callRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
      localStreamRef.current = null;
      callRef.current = null;
      peerRef.current = null;
    };
  }, [callStatus, setCallStatus, selectedContactUser, socket]);

  // Initiate PeerJS Call
  useEffect(() => {
    let connectionTimeout;

    if (
      callStatus === "in-call" &&
      remotePeerId &&
      peerRef.current &&
      localStreamRef.current &&
      !callRef.current
    ) {
      console.log(`Calling remote peer: ${remotePeerId}`);
      setConnectionStatus("connecting");
      const call = peerRef.current.call(remotePeerId, localStreamRef.current);

      if (!call) {
        console.error("Failed to initiate PeerJS call");
        toast.error("Failed to initiate call");
        handleEndCall();
        return;
      }
      callRef.current = call;

      connectionTimeout = setTimeout(() => {
        if (connectionStatus !== "connected") {
          console.error("PeerJS call connection timeout");
          toast.error("Call connection timed out after 30 seconds");
          handleEndCall();
        }
      }, 30000);

      call.on("stream", (remoteStream) => {
        console.log("Received remote stream (caller)");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setConnectionStatus("connected");
        clearTimeout(connectionTimeout);
      });

      call.on("close", handleEndCall);
      call.on("error", (err) => {
        console.error("PeerJS Call error (caller):", err);
        toast.error("Call connection error");
        clearTimeout(connectionTimeout);
        handleEndCall();
      });
    }

    return () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [callStatus, remotePeerId]);

  const handleEndCall = () => {
    console.log("Ending call...");
    if (socket && selectedContactUser) {
      socket.emit("end-call", { receiverId: selectedContactUser.id });
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }

    // Reset state
    setCallStatus("idle");
    setRemotePeerId(null);
    setConnectionStatus("");
    isCaller.current = false;
  };

  // Render logic
  if (callStatus !== "in-call" && callStatus !== "calling") {
    return null;
  }

  return (
    <Card className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full">
        <div className="flex justify-between items-center mb-4 absolute top-4 left-4 right-4 z-10 bg-black/30 p-2 rounded">
          <div className="flex items-center space-x-2 text-white">
            <Video className="h-5 w-5" />
            <h3 className="text-lg font-medium">
              {callStatus === "calling"
                ? `Calling ${selectedContactUser?.firstName}...`
                : `Video Call with ${selectedContactUser?.firstName}`}
            </h3>
            {connectionStatus === "connecting" && (
              <span className="text-xs text-amber-400 animate-pulse ml-2">
                Connecting...
              </span>
            )}
            {connectionStatus === "waiting-for-caller" && (
              <span className="text-xs text-blue-400 animate-pulse ml-2">
                Waiting for connection...
              </span>
            )}
          </div>
          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="h-4 w-4 mr-2" /> End Call
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full pt-16">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden h-full w-full flex items-center justify-center relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            {(connectionStatus === "connecting" ||
              connectionStatus === "waiting-for-caller" ||
              (callStatus === "calling" &&
                connectionStatus !== "connected")) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                <p className="animate-pulse">
                  {connectionStatus === "connecting"
                    ? "Connecting..."
                    : "Waiting..."}
                </p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {selectedContactUser?.firstName}
            </div>
          </div>

          <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden relative h-full w-full flex items-center justify-center">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover scale-x-[-1]"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              You ({currentUser.firstName})
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
