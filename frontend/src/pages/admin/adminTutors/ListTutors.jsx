import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAvatar from "@/components/UserAvatar";
import { deleteRequest } from "@/utils/apiHelpers";
import { useState } from "react";
import EditTutor from "./EditTutor";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/Loader";

export default function ListTutors({ tutors, loading, error, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteTutor = async () => {
    if (!tutorToDelete) return;

    setIsDeleting(true);
    const response = await deleteRequest({
      url: `/api/v1/tutors/${tutorToDelete.id}`,
    });

    if (response.success) {
      toast.success("Tutor and all associated bookings deleted successfully");
      if (onSuccess) onSuccess();
    } else {
      toast.error(response.message);
    }

    setIsDeleting(false);
    setShowDeleteDialog(false);
    setTutorToDelete(null);
  };

  const openDeleteDialog = (tutor) => {
    setTutorToDelete(tutor);
    setShowDeleteDialog(true);
  };

  if (loading) return <Loader />;
  if (error) return <p>An Error Occurred</p>;

  return (
    <>
      <Table>
        <TableCaption>A list of all the tutors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tutor ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No tutors found
              </TableCell>
            </TableRow>
          ) : (
            tutors.map((tutor) => (
              <TableRow key={tutor.id}>
                <TableCell>{tutor.id}</TableCell>
                <TableCell>
                  <UserAvatar user={tutor} />
                </TableCell>
                <TableCell>{tutor.firstName + " " + tutor.lastName}</TableCell>
                <TableCell>{tutor.email}</TableCell>
                <TableCell>{tutor.phone}</TableCell>
                <TableCell>{tutor.address}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditTutor tutorId={tutor.id} onSuccess={onSuccess} />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => openDeleteDialog(tutor)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tutor {tutorToDelete?.firstName}{" "}
              {tutorToDelete?.lastName} and all their associated booking
              records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTutor}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Tutor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
