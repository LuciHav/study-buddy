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
import { getRequest } from "@/utils/apiHelpers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const STRIPE_DASHBOARD_URL = "https://dashboard.stripe.com/test/payments/";

export default function ListBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const resData = await getRequest({ url: "/api/v1/bookings" });
      if (resData.success) {
        setBookings(resData.bookings);
      } else {
        console.log("Error:", resData.message);
        setError(true);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>An Error Occurred</p>;

  return (
    <Table>
      <TableCaption>A list of all your bookings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>User Name</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Amount(Rs)</TableHead>
          <TableHead>Payment Id</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
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
              <TableCell>{booking.hours}</TableCell>
              <TableCell>{booking.totalAmount}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    window.open(STRIPE_DASHBOARD_URL + booking.paymentIntentId)
                  }
                >
                  Open In Stripe
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => navigate(`${booking.id}/chat`)}
                >
                  Chat with {booking.user.firstName}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
