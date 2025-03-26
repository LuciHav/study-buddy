import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router";

export default function BookingCard({ booking }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left side with tutor info */}
          <div className="p-6 md:w-1/3 bg-muted/30 flex flex-col justify-center">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                {booking.tutor.firstName.charAt(0)}
                {booking.tutor.lastName.charAt(0)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center md:text-left">
              {booking.tutor.firstName} {booking.tutor.lastName}
            </h3>
            <Badge
              variant="outline"
              className={`mt-2 self-center md:self-start ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          {/* Right side with booking details */}
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
                  <p className="font-medium">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to={`/tutors/${booking.tutor.id}/chat`}
                className="text-primary hover:underline text-sm font-medium"
              >
                Chat with {booking.tutor.firstName}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
