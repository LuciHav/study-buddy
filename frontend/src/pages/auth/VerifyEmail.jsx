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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyEmailSchema } from "@/schemas/authSchema";
import { patchRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  async function onSubmit(data) {
    const resData = await patchRequest({
      url: "/api/v1/auth/verify-email",
      data,
    });
    if (resData.success) {
      toast.success(resData.message);
      navigate("/login");
    } else {
      console.log("Error:", resData.message);
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
        <h1 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12">Verify your email</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the code sent to your email.
                  </FormDescription>
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
