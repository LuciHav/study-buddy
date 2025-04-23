import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteRequest } from "@/utils/apiHelpers";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function DeletePostDialog({ open, onOpenChange, postId }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const resData = await deleteRequest({
      url: `/api/v1/posts/${postId}`,
    });

    if (resData.success) {
      toast.success(resData.message);
      navigate("/posts");
    } else {
      toast.error(resData.message);
    }

    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
