import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/bookings");
    }, 3000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const handleManualRedirect = () => {
    navigate("/bookings");
  };

  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Booking Successful!</CardTitle>
          <CardDescription>Your booking has been confirmed.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            You will be redirected to your bookings in {countdown} seconds...
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleManualRedirect}>Go to Bookings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
