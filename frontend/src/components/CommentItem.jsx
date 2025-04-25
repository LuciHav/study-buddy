import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./CommentForm";
import UserAvatar from "./UserAvatar";

export function CommentItem({ comment, onAddReply }) {
  const [isReplying, setIsReplying] = useState(false);

  const handleAddReply = (formData) => {
    onAddReply(formData);
    setIsReplying(false);
  };

  // Show reply button for (level < 5)
  const canReply = comment.level < 5;

  // Margin for nested comments
  const nestedMargin = `${Math.min(comment.level * 3, 12)}rem`;

  return (
    <div
      className="space-y-4"
      style={{ marginLeft: comment.level > 0 ? nestedMargin : 0 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <UserAvatar user={comment.user} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{`${comment.user.firstName} ${comment.user.lastName}`}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p>{comment.comment}</p>
              {comment.image && (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/${comment.image}`}
                  alt="Comment Attachment"
                  className="mt-2 max-w-xs rounded-lg"
                />
              )}
              {canReply && (
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
              )}

              {isReplying && (
                <div className="mt-4">
                  <CommentForm
                    onSubmit={handleAddReply}
                    placeholder="Write a reply..."
                    buttonText="Reply"
                    parentId={comment.id}
                    id={`reply-${comment.id}`}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display replies */}
      {comment.replies?.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
