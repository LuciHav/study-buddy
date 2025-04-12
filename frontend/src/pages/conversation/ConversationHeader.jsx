import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import useConversation from "@/contexts/ConversationProvider";
import { useSocketContext } from "@/contexts/SocketProvider";
import { PhoneCall, Video } from "lucide-react";

export default function ConversationHeader({ user }) {
  const { onlineUsers } = useSocketContext();
  const { selectedContactUser } = useConversation();

  const isUserOnline = onlineUsers.includes(String(selectedContactUser.id));

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
        <Button variant="ghost" size="icon">
          <PhoneCall className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
