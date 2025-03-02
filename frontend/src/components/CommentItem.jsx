import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { CommentForm } from "./CommentForm";
import UserAvatar from "./UserAvatar";

export function CommentItem({ comment, onAddReply }) {
  const [isReplying, setIsReplying] = useState(false);

  const handleAddReply = (content) => {
    onAddReply(comment.id, content);
    setIsReplying(false);
  };

  return (
    <div className="space-y-4">
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
              <div className="flex items-center gap-4 mt-2">
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Heart className="w-3 h-3 mr-1" />
                  <span className="text-xs">0</span>
                </Button>
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

              {isReplying && (
                <div className="mt-4">
                  <CommentForm
                    onSubmit={handleAddReply}
                    placeholder="Write a reply..."
                    buttonText="Reply"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested replies */}
      {comment.replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {comment.replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={reply.user.image} />
                    <AvatarFallback>{`${reply.user.firstName.charAt(
                      0
                    )}${reply.user.lastName.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{`${reply.user.firstName} ${reply.user.lastName}`}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p>{reply.comment}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <Heart className="w-3 h-3 mr-1" />
                        <span className="text-xs">0</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
