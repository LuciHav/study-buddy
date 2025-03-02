import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRequest, deleteRequest } from "@/utils/apiHelpers";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/Loader";

export default function ListPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    (async () => {
      const resData = await getRequest({ url: "/api/v1/posts" });
      if (resData.success) {
        setPosts(resData.posts);
      } else {
        console.log("Error:", resData.message);
        setError(true);
      }
      setLoading(false);
    })();
  }, []);

  const handleDelete = async () => {
    if (postToDelete) {
      const resData = await deleteRequest({
        url: `/api/v1/posts/${postToDelete.id}`,
      });
      if (resData.success) {
        setPosts(posts.filter((post) => post.id !== postToDelete.id));
        setShowDeleteDialog(false);
        setPostToDelete(null);
      } else {
        console.log("Error:", resData.message);
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>An error occurred.</p>;

  return (
    <div>
      <Table>
        <TableCaption>A list of all posts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                {post.image ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/${post.image}`}
                    alt={post.title}
                    className="w-16 h-16 object-cover cursor-pointer rounded"
                    onClick={() => setSelectedPost(post)}
                  />
                ) : "No Image"}
              </TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.description}</TableCell>
              <TableCell>{post.subject}</TableCell>
              <TableCell>{`${post.User.firstName} ${post.User.lastName}`}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setPostToDelete(post);
                    setShowDeleteDialog(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPost && (
        <Dialog open={true} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
              <DialogDescription>{selectedPost.description}</DialogDescription>
            </DialogHeader>
            {selectedPost.image && (
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/${selectedPost.image}`}
                alt={selectedPost.title}
                className="w-full rounded"
              />
            )}
          </DialogContent>
        </Dialog>
      )}

      {showDeleteDialog && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
