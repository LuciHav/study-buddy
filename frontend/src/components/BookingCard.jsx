import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router";
import useAuth from "@/contexts/AuthProvider";
import { ROLES } from "@/constants";
import { patchRequest, postRequest, deleteRequest } from "@/utils/apiHelpers";
import { useState } from "react";
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
import { formatCurrency, formatDate, getStatusColor } from "@/utils/helpers";
import UserAvatar from "./UserAvatar";

export default function BookingCard({ booking, onStatusUpdate }) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleApproveBooking = async () => {
    setIsLoading(true);
    const response = await patchRequest({
      url: `/api/v1/bookings/${booking.id}/status`,
      data: { status: "approved" },
    });

    if (response.success) {
      toast.success("Booking request approved");
      if (onStatusUpdate) onStatusUpdate();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const handleRejectBooking = async () => {
    setIsLoading(true);
    const response = await patchRequest({
      url: `/api/v1/bookings/${booking.id}/status`,
      data: { status: "rejected" },
    });

    if (response.success) {
      toast.success("Booking request rejected");
      if (onStatusUpdate) onStatusUpdate();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const handleMakePayment = async () => {
    setIsLoading(true);
    const response = await postRequest({
      url: "/api/v1/bookings/checkout",
      data: { bookingId: booking.id },
    });

    if (response.success && response.session) {
      // Redirect to Stripe checkout
      window.location.href = response.session.url;
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const handleCancelBooking = async () => {
    setIsLoading(true);
    const response = await deleteRequest({
      url: `/api/v1/bookings/${booking.id}`,
    });

    if (response.success) {
      toast.success("Booking cancelled successfully");
      if (onStatusUpdate) onStatusUpdate();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
    setShowCancelDialog(false);
  };

  const canCancel = () => {
    // User can cancel booking if it's not confirmed
    if (currentUser?.role === ROLES.USER) {
      return ["requested", "approved", "pending", "rejected"].includes(
        booking.status.toLowerCase()
      );
    }

    // Tutor can cancel booking if it's not confirmed
    if (currentUser?.role === ROLES.TUTOR) {
      return booking.status.toLowerCase() !== "confirmed";
    }

    return false;
  };

  const renderActionButtons = () => {
    // Tutor actions for requested bookings
    if (currentUser?.role === ROLES.TUTOR && booking.status === "requested") {
      return (
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleApproveBooking}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            onClick={handleRejectBooking}
            disabled={isLoading}
            variant="destructive"
          >
            Reject
          </Button>
        </div>
      );
    }

    // Tutor cancel button (for non-confirmed bookings)
    if (currentUser?.role === ROLES.TUTOR && booking.status !== "confirmed") {
      return (
        <div className="mt-4">
          <Button
            onClick={() => setShowCancelDialog(true)}
            disabled={isLoading}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Delete Booking
          </Button>
        </div>
      );
    }

    // User actions for approved bookings
    if (
      currentUser?.role === ROLES.USER &&
      (booking.status === "approved" || booking.status === "pending")
    ) {
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            onClick={handleMakePayment}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            Make Payment to Confirm Booking
          </Button>

          {canCancel() && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              disabled={isLoading}
              variant="destructive"
            >
              Cancel Booking
            </Button>
          )}
        </div>
      );
    }

    // Show cancel button for requested or rejected bookings
    if (
      currentUser?.role === ROLES.USER &&
      (booking.status === "requested" || booking.status === "rejected")
    ) {
      return (
        <div className="mt-4">
          <Button
            onClick={() => setShowCancelDialog(true)}
            disabled={isLoading}
            variant="destructive"
          >
            {booking.status === "rejected"
              ? "Delete Booking"
              : "Cancel Request"}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Tutor/user info */}
            <div className="p-6 md:w-1/3 bg-muted/30 flex flex-col justify-center">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <UserAvatar user={booking.tutor} className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-center md:text-left">
                {currentUser?.role === ROLES.USER
                  ? `${booking.tutor.firstName} ${booking.tutor.lastName}`
                  : `${booking.user.firstName} ${booking.user.lastName}`}
              </h3>
              <Badge
                variant="outline"
                className={`mt-2 self-center md:self-start ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </Badge>
            </div>

            {/* Booking details */}
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hours</p>
                    <p className="font-medium">{booking.hours} hours</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Booked on</p>
                    <p className="font-medium">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {renderActionButtons()}

              {booking.status === "confirmed" && (
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/bookings/${booking.id}/chat`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Chat with{" "}
                    {currentUser?.role === ROLES.USER
                      ? booking.tutor.firstName
                      : booking.user.firstName}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              No, keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? "Cancelling..." : "Yes, remove booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
