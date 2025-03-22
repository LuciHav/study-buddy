import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/contexts/AuthProvider";
import { Send, Image } from "lucide-react";
import { useState } from "react";
import UserAvatar from "./UserAvatar";

export function CommentForm({
  onSubmit,
  placeholder = "Add a comment...",
  buttonText = "Comment",
  initialValue = "",
}) {
  const [comment, setComment] = useState(initialValue);
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth();

  const handleSubmit = () => {
    if (!comment.trim() && !file) return;

    const formData = new FormData();
    formData.append("comment", comment);
    if (file) {
      formData.append("image", file);
    }

    onSubmit(formData);
    setComment("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="flex gap-4">
      <UserAvatar user={currentUser} />
      <div className="flex-1">
        <Textarea
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-2"
        />
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Image className="w-6 h-6 text-muted-foreground" />
          </label>
          {file && <span>{file.name}</span>}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!comment.trim() && !file}
          className="ml-auto"
        >
          <Send className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
