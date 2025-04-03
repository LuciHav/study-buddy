import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { bookingSchema } from "@/schemas/bookingSchema";
import { getRequest, postRequest } from "@/utils/apiHelpers";
import { Mail, MapPin, Phone } from "lucide-react";

export default function BookTutor() {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      hours: 1,
    },
  });

  const hours = form.watch("hours");

  useEffect(() => {
    (async () => {
      const resData = await getRequest({ url: `/api/v1/tutors/${id}` });
      if (resData.success) {
        setTutor(resData.tutor);
      } else {
        setError(true);
      }
      setLoading(false);
    })();
  }, [id]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const bookingData = {
      tutorId: tutor.userId,
      hours: data.hours,
    };

    const resData = await postRequest({
      url: `/api/v1/bookings`,
      data: bookingData,
    });

    if (resData.success) {
      window.location.href = resData.session.url;
    } else {
      console.log("Error:", resData.message);
    }

    setIsSubmitting(false);
  };

  if (loading) return <Loader />;
  if (error) return <p>An Error Occurred</p>;

  return (
    <div className="grid gap-6 p-4">
      <Card className="w-full m-auto max-w-3xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              className="object-cover"
              src={`${import.meta.env.VITE_SERVER_URL}/${tutor.image}`}
              alt={`${tutor.firstName} ${tutor.lastName}`}
            />
            <AvatarFallback>
              {tutor.firstName[0]}
              {tutor.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">
              {tutor.firstName} {tutor.lastName}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{tutor.address}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{tutor.bio}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {tutor.subject.map((subject, index) => (
                <Badge key={index} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          {tutor.experience?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {tutor.experience.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{tutor.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{tutor.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Hourly Rate</div>
            <div className="text-2xl font-bold">Rs {tutor.hourlyRate}/hr</div>
          </div>

          <Separator />

          {/* Booking Form */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Book a Session</h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Hours</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          max={1000}
                          placeholder="Enter hours"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hours && (
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-bold">
                      Rs {tutor.hourlyRate * hours}
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Book Session"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
