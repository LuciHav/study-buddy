import { Button } from "@/components/ui/button";
import { putRequest } from "@/utils/apiHelpers";
import { MessageCircle, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PostActions({ post }) {
  const [reaction, setReaction] = useState(post?.reaction);
  const [thumbsUpCount, setThumbsUpCount] = useState(post.totalLikes);
  const [thumbsDownCount, setThumbsDownCount] = useState(post.totalDislikes);

  const handleReaction = async (userReaction) => {
    const response = await putRequest({
      url: `/api/v1/posts/${post.id}/reactions`,
      data: { userReaction },
    });

    if (response.success) {
      const newReaction = response?.reaction?.reaction;

      // Update the reaction state
      setReaction(newReaction);

      // Update the thumbs up and thumbs down counts based on the new reaction
      if (newReaction === true) {
        setThumbsUpCount((prev) => prev + 1);
        if (reaction === false) {
          setThumbsDownCount((prev) => prev - 1);
        }
      } else if (newReaction === false) {
        setThumbsDownCount((prev) => prev + 1);
        if (reaction === true) {
          setThumbsUpCount((prev) => prev - 1);
        }
      } else if (newReaction === undefined) {
        if (reaction === true) {
          setThumbsUpCount((prev) => prev - 1);
        } else if (reaction === false) {
          setThumbsDownCount((prev) => prev - 1);
        }
      }
    } else {
      console.error(response.message);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link has been copied!");
    });
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ThumbsUp
            className={`w-4 h-4 cursor-pointer ${
              reaction === true ? "text-blue-500" : ""
            }`}
            onClick={() => handleReaction(true)}
          />
          <span className="text-sm text-muted-foreground">{thumbsUpCount}</span>
          <ThumbsDown
            className={`w-4 h-4 cursor-pointer ${
              reaction === false ? "text-red-500" : ""
            }`}
            onClick={() => handleReaction(false)}
          />
          <span className="text-sm text-muted-foreground">
            {thumbsDownCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">
            {post.totalComments}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share className="w-4 h-4 mr-2" />
        Share
      </Button>
    </>
  );
}
