import UserAvatar from "@/components/UserAvatar";
import useAuth from "@/contexts/AuthProvider";
import { formatDistanceToNow } from "date-fns";

export default function MessageBubble({ message, contactUser }) {
  const { currentUser } = useAuth();
  const isMine = currentUser.id === message.senderId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-2 ${
          isMine ? "flex-row-reverse" : "flex-row"
        } items-end max-w-[80%]`}
      >
        {!isMine && <UserAvatar user={contactUser} />}
        <div
          className={`
            px-4 py-2 rounded-2xl 
            ${
              isMine
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }
          `}
        >
          {message.content && <p>{message.content}</p>}

          {message.fileType && message.filePath && (
            <div className="mt-2">
              {message.fileType.startsWith("image/") ? (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/${message.filePath}`}
                  alt="Attached file"
                  className="max-w-2xl h-auto rounded"
                />
              ) : (
                <a
                  href={`${import.meta.env.VITE_SERVER_URL}/${
                    message.filePath
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  View File
                </a>
              )}
            </div>
          )}

          {/* Display timestamp */}
          <span
            className={`text-xs block mt-1 ${
              isMine ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
