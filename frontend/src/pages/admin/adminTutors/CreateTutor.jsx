import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { tutorSchema } from "@/schemas/tutorSchema";
import { postFormDataRequest } from "@/utils/apiHelpers";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function CreateTutor() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  const form = useForm({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      phone: "",
      address: "",
      subject: [],
      experience: [],
      hourlyRate: 1,
      image: null,
    },
  });

  const addSubject = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newSubjects = [...subjects, e.target.value];
      setSubjects(newSubjects);
      form.setValue("subject", newSubjects);
      e.target.value = "";
    }
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (Array.isArray(values[key])) {
        values[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, values[key]);
      }
    }

    // Handle image file separately
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    formData.append("subject", "Other");

    const resData = await postFormDataRequest({
      url: "/api/v1/tutors",
      data: formData,
    });
    if (resData.success) {
      toast.success(resData.message);
      navigate("/admin/tutors");
    } else {
      console.log("Error:", resData.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Tutor</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Tutor</DialogTitle>
          <DialogDescription>
            Fill up the form. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"
          >
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <Input {...field} autoComplete="given-name" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <Input {...field} autoComplete="family-name" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} autoComplete="email" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <Input type="tel" {...field} autoComplete="tel" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input {...field} autoComplete="street-address" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <Input
                    type="file"
                    accept="*/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="bio"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Bio</FormLabel>
                  <Textarea {...field} autoComplete="off" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="subject"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Subjects</FormLabel>
                  <Input
                    type="text"
                    placeholder="Type and press Enter"
                    onKeyDown={addSubject}
                    {...field}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 rounded-md"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  {subjects.length === 0 && <FormMessage />}
                </FormItem>
              )}
            />

            <FormField
              name="hourlyRate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate (Rs)</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="md:col-span-2">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
