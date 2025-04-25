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
import useAuth from "@/contexts/AuthProvider";

export default function PostOptions({ post, onPostUpdate }) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleEdit = () => {
    setEditDialogOpen(true);
    setDropdownOpen(false);
  };

  const handleReportClick = () => {
    setReportDialogOpen(true);
    setDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setDropdownOpen(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setEditDialogOpen(false);
    toast.success("Post updated successfully!");
    onPostUpdate(updatedPost);
  };

  return (
    <div className="relative z-10">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <CircleEllipsis className="w-full hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {currentUser.id !== post.User.id && (
            <DropdownMenuItem onClick={handleReportClick}>
              Report
            </DropdownMenuItem>
          )}
          {currentUser.id === post.User.id && (
            <>
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick}>
                Delete
              </DropdownMenuItem>
            </>
          )}
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
