import ItemSelector from "@/components/ItemSelector";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editTutorSchema } from "@/schemas/tutorSchema";
import { getRequest, putFormDataRequest } from "@/utils/apiHelpers";
import { prepareFormData } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditTutor({ tutorId, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const form = useForm({
    resolver: zodResolver(editTutorSchema),
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
      image: undefined,
    },
  });

  const fetchTutorData = async () => {
    setLoading(true);
    const response = await getRequest({ url: `/api/v1/tutors/${tutorId}` });
    if (response.success) {
      const tutorData = response.tutor;
      setInitialData(tutorData);

      // Set form values with tutor data
      form.reset({
        firstName: tutorData.firstName,
        lastName: tutorData.lastName,
        email: tutorData.email,
        bio: tutorData.bio,
        phone: tutorData.phone,
        address: tutorData.address,
        subject: Array.isArray(tutorData.subject) ? tutorData.subject : [],
        experience: Array.isArray(tutorData.experience)
          ? tutorData.experience
          : [],
        hourlyRate: Number(tutorData.hourlyRate),
      });
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTutorData();
    }
  }, [isOpen, tutorId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = prepareFormData(
      values,
      ["subject", "experience"], // Array fields
      ["image"] // File fields
    );

    const resData = await putFormDataRequest({
      url: `/api/v1/tutors/${initialData.id}`,
      data: formData,
    });

    if (resData.success) {
      toast.success(resData.message);
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } else {
      toast.error(resData.message);
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          fetchTutorData();
        } else {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Tutor</DialogTitle>
          <DialogDescription>
            Update the tutor&apos;s information. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        {loading && !initialData ? (
          <div className="p-6 text-center">Loading tutor data...</div>
        ) : (
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
                    <FormLabel>Image (Optional)</FormLabel>
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
                disabled={loading}
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
