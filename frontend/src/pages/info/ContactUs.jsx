import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/schemas/contactSchema";
import { postRequest } from "@/utils/apiHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const resData = await postRequest({
      url: "/api/v1/contacts",
      data,
    });

    if (resData.success) {
      toast.success(resData.message);
      form.reset();
    } else {
      toast.error(resData.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
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
                    <FormControl>
                      <Input placeholder="How can we help?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              title="Email"
              details="support@studybuddy.com"
            />
            <ContactCard
              icon={<Phone className="h-6 w-6" />}
              title="Phone"
              details="+977 9800000000"
            />
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-semibold">Office Location</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sundarharaicha
                    <br />
                    Morang, Nepal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="aspect-video w-full overflow-hidden rounded-b-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1419.6480751391728!2d87.30123877732912!3d26.65519349043812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e1!3m2!1sen!2snp!4v1745504816009!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Study Buddy Office Location"
                  className="aspect-video"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Follow Us</h3>
              <div className="flex space-x-4">
                <SocialLink
                  href="#"
                  icon={<Facebook className="h-5 w-5" />}
                  label="Facebook"
                />
                <SocialLink
                  href="#"
                  icon={<Twitter className="h-5 w-5" />}
                  label="Twitter"
                />
                <SocialLink
                  href="#"
                  icon={<Linkedin className="h-5 w-5" />}
                  label="LinkedIn"
                />
                <SocialLink
                  href="#"
                  icon={<Instagram className="h-5 w-5" />}
                  label="Instagram"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, details }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {icon}
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{details}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
}
