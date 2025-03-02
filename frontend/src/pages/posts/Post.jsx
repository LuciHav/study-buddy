import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router";
import { CommentForm } from "@/components/CommentForm";
import { CommentItem } from "@/components/CommentItem";
import Loader from "@/components/Loader";
import { getRequest, postRequest } from "@/utils/apiHelpers";

export default function Post() {
  const { postId } = useParams();

  const [post, setPost] = useState();
  const [comments, setComments] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);

      const [postResData, commentsResData] = await Promise.all([
        getRequest({ url: `/api/v1/posts/${postId}` }),
        getRequest({ url: `/api/v1/posts/${postId}/comments` }),
      ]);

      if (postResData.success && commentsResData.success) {
        setPost(postResData.post);
        setComments(commentsResData.comments);
      } else {
        console.error(postResData.message || commentsResData.message);
      }
      setIsLoading(false);
    };

    if (postId) fetchPostData();
  }, [postId]);

  const handleAddComment = async (comment) => {
    const resData = await postRequest({
      url: `/api/v1/posts/${postId}/comments`,
      data: { comment },
    });
    if (resData.success) {
      setComments([...comments, resData.comment]);
    } else {
      console.error(resData.message);
    }
  };

  const handleAddReply = async (parentId, comment) => {
    const resData = await postRequest({
      url: `/api/v1/posts/${postId}/comments`,
      data: { comment, parentId },
    });
  
    if (resData.success) {
      const updatedComments = (comments) => {
        const addReplyRecursive = (commentList) => {
          return commentList.map((c) => {
            if (c.id === parentId) {
              return { ...c, replies: [...c.replies, resData.comment] };
            }
            return { ...c, replies: addReplyRecursive(c.replies) };
          });
        };
  
        return addReplyRecursive(comments);
      };
  
      setComments(updatedComments);
    } else {
      console.error(resData.message);
    }
  };
  

  if (isLoading) return <Loader />;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={post.User?.image} />
            <AvatarFallback>{`${post.User.firstName.charAt(
              0
            )}${post.User.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{`${post.User.firstName} ${post.User.lastName}`}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{post.subject}</p>
              <span className="text-sm text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </CardHeader>

        {post.image && (
          <div className="relative aspect-video">
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/${post.image}`}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <CardContent className="mt-4">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground">{post.description}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span>123 Likes</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} Comments</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </CardFooter>
      </Card>

      {/* Add comment section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentForm onSubmit={handleAddComment} />
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onAddReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
}
