import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/contexts/AuthProvider";
import { updateUserSchema } from "@/schemas/userSchema";
import { putRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ProfileForm() {
  const { currentUser, setCurrentUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    const resData = await putRequest({
      url: `/api/v1/users/${currentUser.id}`,
      data: values,
    });

    if (resData.success) {
      // Update the current user in context
      setCurrentUser({
        ...currentUser,
        ...values,
      });

      toast.success("Profile updated successfully");
    } else {
      toast.error(resData.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information here.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Profile
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
