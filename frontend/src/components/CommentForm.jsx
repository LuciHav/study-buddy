import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/contexts/AuthProvider";
import { Send } from "lucide-react";
import { useState } from "react";
import UserAvatar from "./UserAvatar";

export function CommentForm({
  onSubmit,
  placeholder = "Add a comment...",
  buttonText = "Comment",
  initialValue = "",
}) {
  const [comment, setComment] = useState(initialValue);
  const { currentUser } = useAuth();

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment("");
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
        <Button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="ml-auto"
        >
          <Send className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
