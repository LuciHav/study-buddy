import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share } from "lucide-react";

export function PostCard({ post }) {
  const totalLikes = 123;
  const totalComments = 45;

  return (
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
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">{totalLikes}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">
              {totalComments}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
