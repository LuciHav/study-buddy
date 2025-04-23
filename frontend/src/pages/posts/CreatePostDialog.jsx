import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS } from "@/constants";
import { postSchema } from "@/schemas/postSchema";
import { postFormDataRequest, putFormDataRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function CreatePostDialog({
  open,
  onOpenChange,
  onPostCreated,
  postToEdit = null,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!postToEdit;

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
    },
  });

  // Update form values when editing a post
  useEffect(() => {
    if (isEditing && postToEdit) {
      form.reset({
        title: postToEdit.title || "",
        description: postToEdit.description || "",
        subject: postToEdit.subject || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        subject: "",
      });
    }
  }, [postToEdit, form, isEditing]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("subject", values.subject);
    if (values.image) {
      formData.append("image", values.image);
    }

    let resData;

    if (isEditing) {
      // Update existing post
      resData = await putFormDataRequest({
        url: `/api/v1/posts/${postToEdit.id}`,
        data: formData,
      });
    } else {
      // Create new post
      resData = await postFormDataRequest({
        url: "/api/v1/posts",
        data: formData,
      });
    }

    if (resData.success) {
      onPostCreated(resData.post);
      form.reset();
    } else {
      console.error(resData.message);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your post details"
              : "Fill out the form to share your query"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SUBJECTS).map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>
                    Image {isEditing && "(Leave empty to keep current image)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update" : "Create"} Post
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
