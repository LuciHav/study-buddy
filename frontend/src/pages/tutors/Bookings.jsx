import BookingCard from "@/components/BookingCard";
import Loader from "@/components/Loader";
import { getRequest } from "@/utils/apiHelpers";
import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
  if (error) return <p>An Error Occured</p>;

  return (
    <div className="grid gap-6 p-4">
      {bookings.length === 0 ? (
        <p className="text-center">You don&apos;t have any bookings yet</p>
      ) : (
        bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      )}
    </div>
  );
}
