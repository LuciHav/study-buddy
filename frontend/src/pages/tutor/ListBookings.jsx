import Loader from "@/components/Loader";
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
import UserAvatar from "@/components/UserAvatar";
import { getRequest, patchRequest, deleteRequest } from "@/utils/apiHelpers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/utils/helpers";
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

const STRIPE_DASHBOARD_URL = "https://dashboard.stripe.com/test/payments/";

export default function ListBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    const resData = await getRequest({ url: "/api/v1/bookings" });
    if (resData.success) {
      setBookings(resData.bookings);
    } else {
      console.log("Error:", resData.message);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApproveBooking = async (bookingId) => {
    setActionLoading(true);
    const response = await patchRequest({
      url: `/api/v1/bookings/${bookingId}/status`,
      data: { status: "approved" },
    });

    if (response.success) {
      toast.success("Booking request approved");
      await fetchBookings(); // Refresh the list
    } else {
      toast.error(response.message);
    }

    setActionLoading(false);
  };

  const handleRejectBooking = async (bookingId) => {
    setActionLoading(true);
    const response = await patchRequest({
      url: `/api/v1/bookings/${bookingId}/status`,
      data: { status: "rejected" },
    });

    if (response.success) {
      toast.success("Booking request rejected");
      await fetchBookings(); // Refresh the list
    } else {
      toast.error(response.message);
    }

    setActionLoading(false);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    setActionLoading(true);
    const response = await deleteRequest({
      url: `/api/v1/bookings/${bookingToDelete}`,
    });

    if (response.success) {
      toast.success("Booking deleted successfully");
      await fetchBookings(); // Refresh the list
    } else {
      toast.error(response.message);
    }

    setActionLoading(false);
    setShowDeleteDialog(false);
    setBookingToDelete(null);
  };

  const openDeleteDialog = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowDeleteDialog(true);
  };

  const handleShowDetails = (booking) => {
    setSelectedBooking(booking);
  };

  if (loading) return <Loader />;
  if (error) return <p>An Error Occurred</p>;

  return (
    <>
      <Table>
        <TableCaption>A list of all your bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Amount(Rs)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                You don&apos;t have any bookings yet
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>
                  <UserAvatar user={booking.user} />
                </TableCell>
                <TableCell>
                  {booking.user.firstName + " " + booking.user.lastName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {booking.teachingType.charAt(0).toUpperCase() +
                      booking.teachingType.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {booking.teachingType === "physical"
                    ? booking.location
                    : "Online"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <span>From: {formatDate(booking.startDate)}</span>
                    <span>To: {formatDate(booking.endDate)}</span>
                  </div>
                </TableCell>
                <TableCell>{booking.hours}</TableCell>
                <TableCell>
                  {booking.totalAmount ? booking.totalAmount : "Pending"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(booking.status)}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {booking.status === "requested" && (
                      <>
                        <Button
                          onClick={() => handleApproveBooking(booking.id)}
                          disabled={actionLoading}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectBooking(booking.id)}
                          disabled={actionLoading}
                          variant="destructive"
                          size="sm"
                        >
                          Reject
                        </Button>

                        <Button
                          onClick={() => handleShowDetails(booking)}
                          size="sm"
                          variant="outline"
                        >
                          Details
                        </Button>
                      </>
                    )}

                    {(booking.status === "rejected" ||
                      booking.status === "completed") && (
                      <Button
                        onClick={() => openDeleteDialog(booking.id)}
                        disabled={actionLoading}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    )}

                    {booking.status === "confirmed" &&
                      booking.paymentIntentId && (
                        <Button
                          onClick={() =>
                            window.open(
                              STRIPE_DASHBOARD_URL + booking.paymentIntentId
                            )
                          }
                          size="sm"
                        >
                          Stripe Payment
                        </Button>
                      )}

                    {booking.status === "confirmed" && (
                      <Button
                        onClick={() => navigate(`${booking.id}/chat`)}
                        size="sm"
                      >
                        Chat
                      </Button>
                    )}
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
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {actionLoading ? "Deleting..." : "Yes, delete booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <AlertDialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Booking Details</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 mt-4">
                {selectedBooking && (
                  <>
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        user={selectedBooking.user}
                        className="h-16 w-16"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {selectedBooking.user.firstName}{" "}
                          {selectedBooking.user.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Booking ID: {selectedBooking.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Teaching Type:</span>
                        <span>{selectedBooking.teachingType}</span>
                      </div>
                      {selectedBooking.teachingType === "physical" && (
                        <div className="flex justify-between">
                          <span className="font-medium">Location:</span>
                          <span>{selectedBooking.location}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium">Start Date:</span>
                        <span>{formatDate(selectedBooking.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">End Date:</span>
                        <span>{formatDate(selectedBooking.endDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hours:</span>
                        <span>{selectedBooking.hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(selectedBooking.status)}
                        >
                          {selectedBooking.status.charAt(0).toUpperCase() +
                            selectedBooking.status.slice(1)}
                        </Badge>
                      </div>
                      {selectedBooking.remarks && (
                        <div className="mt-4">
                          <span className="font-medium">Remarks:</span>
                          <p className="mt-1 text-muted-foreground whitespace-pre-line">
                            {selectedBooking.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
