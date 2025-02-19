import NavButton from "@/components/NavButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/constants";
import useAuth from "@/contexts/AuthProvider";
import { loginSchema } from "@/schemas/authSchema";
import { postRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function Login() {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    const resData = await postRequest({ url: "/api/v1/auth/login", data });
    if (resData.success) {
      setCurrentUser(resData.user);
      if (resData.user.role === ROLES.ADMIN) {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
        <h1 className="text-3xl font-semibold mb-12">Login to your account</h1>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <NavButton
                      to="/forgot-password"
                      className="p-0"
                      type="button"
                      variant="link"
                    >
                      Forgot Password?
                    </NavButton>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Login
            </Button>
            <NavButton
              to="/signup"
              className="w-full"
              type="button"
              variant="link"
            >
              Don&apos;t have an account?
            </NavButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
