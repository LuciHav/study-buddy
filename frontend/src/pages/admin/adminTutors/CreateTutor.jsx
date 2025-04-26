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
import { prepareFormData } from "@/utils/helpers";
import { toast } from "sonner";
import ItemSelector from "@/components/ItemSelector";

export default function CreateTutor({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      bio: "",
      phone: "",
      address: "",
      subject: [],
      experience: [],
      hourlyRate: 1,
      image: null,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const formData = prepareFormData(
      values,
      ["subject", "experience"],
      ["image"]
    );

    const resData = await postFormDataRequest({
      url: "/api/v1/tutors",
      data: formData,
    });

    if (resData.success) {
      toast.success(resData.message);
      form.reset();
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } else {
      toast.error(resData.message);
    }

    setIsSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add Tutor</Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl max-w-2xl md:min-w-3xl md:max-w-3xl">
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
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 md:gap-6 md:p-6"
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
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="new-password"
                  />
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
                    accept="image/*"
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
                  <ItemSelector
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add a subject and press Enter"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="experience"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Experience (Optional)</FormLabel>
                  <ItemSelector
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add an experience and press Enter"
                  />
                  <FormMessage />
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

            <Button
              type="submit"
              className="md:col-span-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Tutor..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
