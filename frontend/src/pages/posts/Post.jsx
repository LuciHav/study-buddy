import { CommentForm } from "@/components/CommentForm";
import { CommentItem } from "@/components/CommentItem";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import {
  getRequest,
  postFormDataRequest,
  postRequest,
} from "@/utils/apiHelpers";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostActions from "./PostActions";
import ReportOptions from "./ReportOptions";
import Loader from "@/components/Loader";

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

  const handleAddComment = async (formData) => {
    const resData = await postFormDataRequest({
      url: `/api/v1/posts/${postId}/comments`,
      data: formData,
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
        <CardHeader className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-row items-center gap-4">
            <UserAvatar user={post.User} />
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
          </div>
          <div>
            <ReportOptions postId={postId} />
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
          <PostActions post={post} />
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
