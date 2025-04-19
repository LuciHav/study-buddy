import Loader from "@/components/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ROLES } from "@/constants";
import useAuth from "@/contexts/AuthProvider";
import useConversation from "@/contexts/ConversationProvider";
import { getRequest, postFormDataRequest } from "@/utils/apiHelpers";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import ConversationHeader from "./ConversationHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useSetupSocket } from "@/contexts/SocketProvider";
import { toast } from "sonner";
import useListenToSocket from "@/hooks/useListenToSocket";
import VideoPlayer from "@/components/VideoPlayer";

export default function Conversation() {
  useSetupSocket();
  useListenToSocket();

  const { id: bookingId } = useParams();
  const { currentUser } = useAuth();

  const { selectedContactUser, setSelectedContactUser, messages, setMessages } =
    useConversation();

  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Fetch booking details
      const bookingRes = await getRequest({
        url: `/api/v1/bookings/${bookingId}`,
      });

      if (bookingRes.success) {
        const booking = bookingRes.booking;

        let contactUserId;

        if (currentUser.role === ROLES.TUTOR) {
          contactUserId = booking.user.id;
          setSelectedContactUser(booking.user);
        } else if (currentUser.role === ROLES.USER) {
          contactUserId = booking.tutor.id;
          setSelectedContactUser(booking.tutor);
        }

        // Fetch messages for the booking
        const messagesRes = await getRequest({
          url: `/api/v1/messages/${contactUserId}`,
        });

        if (messagesRes.success) {
          setMessages(messagesRes.messages);
        } else {
          console.error("Error fetching messages:", messagesRes.message);
          setError(true);
        }
      } else {
        console.error("Error fetching booking:", bookingRes.message);
        setError(true);
      }
      setLoading(false);
    })();
  }, [bookingId, currentUser.role, setMessages, setSelectedContactUser]);

  const handleSendMessage = async (e, selectedFile) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) {
      toast.warning("Please enter a message or select a file");
      return;
    }

    const formData = new FormData();
    formData.append("content", newMessage);
    formData.append("receiverId", selectedContactUser.id);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const resData = await postFormDataRequest({
      url: "/api/v1/messages",
      data: formData,
    });

    if (resData.success) {
      const message = resData.message;
      setMessages([...messages, message]);
      setNewMessage("");
    } else {
      console.error("Error sending message:", resData.message);
    }
  };

  // Scroll to the last message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) return <Loader />;
  if (error) return <p>An Error Occurred</p>;

  return (
    <div className="flex flex-col min-h-[80vh] max-h-[80vh]">
      <ConversationHeader user={selectedContactUser} />
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">
              Send a message to start the conversation.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                contactUser={selectedContactUser}
              />
            ))
          )}
        </div>
        <div ref={lastMessageRef} />
      </ScrollArea>
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSubmit={handleSendMessage}
      />
      <VideoPlayer />
    </div>
  );
}
