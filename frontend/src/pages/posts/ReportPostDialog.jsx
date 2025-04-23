import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { reportSchema } from "@/schemas/reportSchema";
import { postRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ReportPostDialog({ open, onOpenChange, postId }) {
  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      postId: "",
      reason: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values) => {
    const resData = await postRequest({
      url: "/api/v1/reports",
      data: { postId, reason: values.reason },
    });

    if (resData.success) {
      toast.success(resData.message);
      form.reset();
      onOpenChange(false);
    } else {
      toast.error(resData.message);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Describe the issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="secondary" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
