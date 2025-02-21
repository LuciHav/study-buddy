import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import useAuth from "@/contexts/AuthProvider";
import { getRequest } from "@/utils/apiHelpers";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreatePostDialog } from "./CreatePostDialog";
import { PostCard } from "./PostCard";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const resData = await getRequest({ url: "/api/v1/posts" });
    if (resData.success) {
      setPosts(resData.posts);
    } else {
      console.error(resData.message);
    }
    setIsLoading(false);
  };

  const onPostCreated = (newPost) => {
    const postWithUserDetails = {
      ...newPost,
      User: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        image: currentUser.image,
      },
    };

    setPosts((prevPosts) => [postWithUserDetails, ...prevPosts]);
    setOpen(false);
  };

  if (isLoading) <Loader />;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      <CreatePostDialog
        open={open}
        onOpenChange={setOpen}
        onPostCreated={onPostCreated}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-center col-span-full">
            No posts yet. Be the first to add one!
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
