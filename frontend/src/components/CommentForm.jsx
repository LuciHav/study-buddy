import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import useAuth from "@/contexts/AuthProvider";
import { Send, Image } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useState } from "react";
import { commentSchema } from "@/schemas/commentSchema";

export function CommentForm({
  onSubmit,
  placeholder = "Add a comment...",
  buttonText = "Comment",
  parentId,
  id = "main", // Unique id prop
}) {
  const { currentUser } = useAuth();
  const [fileName, setFileName] = useState("");

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
      parentId,
      image: undefined,
    },
  });

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    if (data.comment) formData.append("comment", data.comment);
    if (data.image instanceof File) formData.append("image", data.image);
    if (data.parentId) formData.append("parentId", data.parentId);

    onSubmit(formData);
    form.reset();
    setFileName("");
  };

  const fileUploadId = `file-upload-${id}`; // Unique id for file input

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex gap-4"
      >
        <UserAvatar user={currentUser} />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    {...field}
                    className="mb-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setFileName(file.name);
                        }
                      }}
                      className="hidden"
                      id={fileUploadId}
                    />
                    <label htmlFor={fileUploadId} className="cursor-pointer">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </label>
                    {fileName && <span>{fileName}</span>}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="ml-auto"
            disabled={form.formState.isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
