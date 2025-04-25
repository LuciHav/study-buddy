import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { bookingSchema } from "@/schemas/bookingSchema";
import { getRequest, postRequest } from "@/utils/apiHelpers";
import { cn } from "@/lib/utils";
import { CalendarIcon, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BookTutor() {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      hours: 0,
      teachingType: "online",
      location: "",
      remarks: "",
    },
  });

  const teachingType = form.watch("teachingType");
  const hours = form.watch("hours");

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const bookingData = {
      tutorId: tutor.userId,
      ...data,
    };

    const resData = await postRequest({
      url: `/api/v1/bookings/request`,
      data: bookingData,
    });

    if (resData.success) {
      toast.success("Booking request sent to tutor");
      navigate("/booking/request-success");
    } else {
      toast.error(resData.message);
    }

    setIsSubmitting(false);
  };

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

  if (loading) return <Loader />;
  if (error) return <p>An Error Occurred</p>;

  const disabledDays = {
    before: new Date(),
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book Tutor</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tutor Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <UserAvatar user={tutor} className="w-20 h-20" />
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

          <CardContent className="grid gap-6">
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
          </CardContent>
        </Card>

        {/* Booking Form Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">
                  Book a session with {tutor.firstName}
                </h3>
                <p className="text-muted-foreground">
                  Your request will be sent to the tutor for approval. After
                  approval, you&apos;ll be able to make payment.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="teachingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teaching Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select teaching type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="physical">Physical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {teachingType === "physical" && (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter meeting location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={disabledDays}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={disabledDays}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add any specific requirements or notes for the tutor"
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span className="font-medium">Estimated Cost:</span>
                    <span className="font-bold">
                      Rs {tutor.hourlyRate * hours}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Sending Request..."
                      : "Send Booking Request"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
