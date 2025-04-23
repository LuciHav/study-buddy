import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreatePostDialog } from "./CreatePostDialog";
import DeletePostDialog from "./DeletePostDialog";
import ReportPostDialog from "./ReportPostDialog";

export default function PostOptions({ post, onPostUpdate }) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handlePostUpdated = (updatedPost) => {
    setEditDialogOpen(false);
    toast.success("Post updated successfully!");
    onPostUpdate(updatedPost);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CircleEllipsis className="w-full hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
            Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog */}
      <ReportPostDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        postId={post.id}
      />

      {/* Delete Dialog */}
      <DeletePostDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        postId={post.id}
      />

      {/* Edit Post Dialog */}
      <CreatePostDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPostCreated={handlePostUpdated}
        postToEdit={post}
      />
    </div>
  );
}
