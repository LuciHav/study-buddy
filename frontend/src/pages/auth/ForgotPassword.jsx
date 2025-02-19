import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/schemas/authSchema";
import { patchRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    const resData = await patchRequest({
      url: "/api/v1/auth/forgot-password",
      data,
    });
    
    if (resData.success) {
      toast.success(resData.message);
      navigate("/reset-password");
    } else {
      console.log("Error:", resData.message);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6 w-full">
      <img
        className="w-full col-span-6"
        src="./auth.jpg"
        alt="Authentication image"
      />
      <div className="col-start-8 col-span-4">
        <h1 className="text-3xl font-semibold mb-12">Forgot Password</h1>
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
                  <FormDescription>Please enter your email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
