import { Input } from "@/components/ui/input";
import useConversation from "@/contexts/ConversationProvider";
import { useSocketContext } from "@/contexts/SocketProvider";
import { Send, Plus } from "lucide-react";
import { useState } from "react";

export default function MessageInput({ value, onChange, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const { selectedContactUser, isTyping } = useConversation();
  const { socket } = useSocketContext();

  const handleInputChange = (e) => {
    onChange(e);

    if (!socket || !selectedContactUser) return;

    if (!isTyping) {
      socket.emit("typing", { receiverId: selectedContactUser.id });
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedContactUser.id });
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, selectedFile);
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <>
      {filePreview && (
        <div className="mb-2 flex items-center space-x-2">
          <img
            src={filePreview}
            alt="File Preview"
            className="w-16 h-16 object-cover rounded border"
          />
          <p className="text-sm text-gray-500">{selectedFile?.name}</p>
        </div>
      )}

      {isTyping && (
        <div className="text-sm text-gray-500 italic mb-2">
          {selectedContactUser?.firstName || "User"} is typing...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t p-4 flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <label
            htmlFor="fileInput"
            className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <Input
            value={value}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </>
  );
}
