import Loader from "@/components/Loader";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteRequest, getRequest, patchRequest } from "@/utils/apiHelpers";
import { format } from "date-fns";
import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    const resData = await getRequest({ url: "/api/v1/contacts" });
    if (resData.success) {
      setContacts(resData.contacts);
    } else {
      toast.error(resData.message);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkAsReplied = async (id) => {
    const resData = await patchRequest({
      url: `/api/v1/contacts/${id}`,
      data: { status: "replied" },
    });

    if (resData.success) {
      toast.success(resData.message);
      setContacts(
        contacts.map((contact) =>
          contact.id === id ? { ...contact, status: "replied" } : contact
        )
      );
    } else {
      toast.error(resData.message);
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;

    const resData = await deleteRequest({
      url: `/api/v1/contacts/${contactToDelete.id}`,
    });

    if (resData.success) {
      toast.success(resData.message);
      setContacts(contacts.filter((c) => c.id !== contactToDelete.id));
      setContactToDelete(null);
      setShowDeleteDialog(false);
    } else {
      toast.error(resData.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>An error occurred.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Contact Messages</h1>
      <Table>
        <TableCaption>A list of all contact messages</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.subject}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {contact.message}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    contact.status === "pending" ? "destructive" : "success"
                  }
                >
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(contact.createdAt), "PPp")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {contact.status === "pending" && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-green-500 hover:text-green-700"
                      onClick={() => handleMarkAsReplied(contact.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => {
                      setContactToDelete(contact);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contact message. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
