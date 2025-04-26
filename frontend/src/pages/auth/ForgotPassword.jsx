import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/schemas/authSchema";
import { patchRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    try {
      setIsLoading(true);
      const resData = await patchRequest({
        url: "/api/v1/auth/forgot-password",
        data,
      });

      if (resData.success) {
        toast.success(resData.message);
      } else {
        console.log("Error:", resData.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      <img
        className="hidden md:block w-full col-span-6"
        src="./auth.jpg"
        alt="Authentication image"
      />
      <div className="col-span-1 px-4 md:px-0 md:col-start-8 md:col-span-4">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">Forgot Password</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter your email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" isLoading={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
