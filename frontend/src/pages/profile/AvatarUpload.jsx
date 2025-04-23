import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import useAuth from "@/contexts/AuthProvider";
import { updateUserSchema } from "@/schemas/userSchema";
import { putFormDataRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AvatarUpload() {
  const { currentUser, setCurrentUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const isUploading = form.formState.isSubmitting;

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("image", values.image);

    const resData = await putFormDataRequest({
      url: `/api/v1/users/${currentUser.id}`,
      data: formData,
    });

    if (resData.success) {
      setCurrentUser({
        ...currentUser,
        image: resData.user.image,
      });
      toast.success("Profile picture updated successfully");
    } else {
      toast.error(resData.message);
    }

    form.reset();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("image", file);
    form.handleSubmit(onSubmit)();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload a profile picture to personalize your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative h-40 w-40 rounded-full overflow-hidden border">
          {currentUser.image ? (
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/${currentUser.image}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div>
                      <label htmlFor="avatar-upload">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          disabled={isUploading}
                          type="button"
                          asChild
                        >
                          <div className="flex items-center gap-2">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload size={16} />
                            )}
                            {isUploading ? "Uploading..." : "Upload new image"}
                          </div>
                        </Button>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: Square JPG, PNG. Max 5MB.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
