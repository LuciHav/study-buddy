import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import PostActions from "./PostActions";

export function PostCard({ post }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <Card className="max-h-[600px] overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={post.User?.image} />
            <AvatarFallback>{`${post.User.firstName.charAt(
              0
            )}${post.User.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{`${post.User.firstName} ${post.User.lastName}`}</p>
            <p className="text-sm text-muted-foreground">{post.subject}</p>
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
          <h3 className="font-semibold">{post.title}</h3>
          <p className="mt-2 text-muted-foreground">{post.description}</p>
        </CardContent>

        <CardFooter
          className="flex justify-between items-center p-4 border-t"
          onClick={(e) => e.stopPropagation()} // Prevents navigation when clicking the footer
        >
          <PostActions post={post} />
        </CardFooter>
      </Card>
    </div>
  );
}
