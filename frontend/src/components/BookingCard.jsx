import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarRange, MapPin, Clock, DollarSign, Video } from "lucide-react";
import { Link } from "react-router";
import { postRequest, deleteRequest } from "@/utils/apiHelpers";
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
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleMakePayment = async () => {
    setIsLoading(true);
    const response = await postRequest({
      url: "/api/v1/bookings/checkout",
      data: { bookingId: booking.id },
    });

    if (response.success && response.session) {
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
    return ["requested", "approved", "pending", "rejected"].includes(
      booking.status.toLowerCase()
    );
  };

  const renderActionButtons = () => {
    if (booking.status === "completed") {
      return (
        <div className="mt-4">
          <Button
            onClick={() => setShowCancelDialog(true)}
            disabled={isLoading}
            variant="destructive"
          >
            Delete Booking
          </Button>
        </div>
      );
    }

    if (booking.status === "approved" || booking.status === "pending") {
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

    if (booking.status === "requested" || booking.status === "rejected") {
      return (
        <div className="mt-4">
          <Button
            onClick={() => setShowCancelDialog(true)}
            disabled={isLoading}
            variant="destructive"
          >
            {booking.status === "rejected" ? "Delete Booking" : "Cancel Request"}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Tutor info */}
            <div className="flex items-center space-x-4">
              <UserAvatar user={booking.tutor} className="w-12 h-12" />
              <div>
                <h3 className="text-lg font-semibold">
                  {booking.tutor.firstName} {booking.tutor.lastName}
                </h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(booking.status)}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Booking details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                {booking.teachingType === "online" ? (
                  <Video className="h-5 w-5 mr-2 text-muted-foreground" />
                ) : (
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Teaching Type</p>
                  <p className="font-medium capitalize">
                    {booking.teachingType}
                  </p>
                  {booking.teachingType === "physical" && booking.location && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <CalendarRange className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <div className="text-sm">
                    <p>From: {formatDate(booking.startDate)}</p>
                    <p>To: {formatDate(booking.endDate)}</p>
                  </div>
                </div>
              </div>

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
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">
                    {formatCurrency(booking.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {booking.remarks && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  Remarks
                </p>
                <p className="text-sm whitespace-pre-line">{booking.remarks}</p>
              </div>
            )}

            {renderActionButtons()}

            {booking.status === "confirmed" && (
              <div className="flex justify-end">
                <Link
                  to={`/bookings/${booking.id}/chat`}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Chat with {booking.tutor.firstName}
                </Link>
              </div>
            )}
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
