import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LineChartIcon,
  MessageCircleIcon,
  UserCheckIcon,
} from "lucide-react";
import NavButton from "./NavButton";

export default function FeaturesSection() {
  const features = [
    {
      title: "Ask Questions, Get Answers",
      description:
        "Post your academic questions and receive detailed answers from qualified tutors and peers.",
      icon: <HelpCircleIcon className="h-10 w-10" />,
    },
    {
      title: "Find Expert Tutors",
      description:
        "Connect with verified tutors specializing in your subject area for personalized learning.",
      icon: <UserCheckIcon className="h-10 w-10" />,
    },
    {
      title: "Secure Payments",
      description:
        "Make secure payments for tutoring sessions directly through our platform.",
      icon: <CreditCardIcon className="h-10 w-10" />,
    },
    {
      title: "Make Bookings",
      description:
        "Book and manage tutoring sessions with an easy-to-use interface.",
      icon: <CalendarIcon className="h-10 w-10" />,
    },
    {
      title: "Track Progress with Post Queries",
      description:
        "Monitor your learning journey by asking questions, getting answers, and through discussions.",
      icon: <LineChartIcon className="h-10 w-10" />,
    },
    {
      title: "Community Learning with Chat & Video Call",
      description:
        "Collaborate with students and tutors in real-time through interactive chat and video calling features.",
      icon: <MessageCircleIcon className="h-10 w-10" />,
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Study Buddy offers everything you need to enhance your learning
            experience and connect with knowledgeable tutors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <NavButton to="/posts" size="lg" className="px-8">
            Explore All Features
          </NavButton>
        </div>
      </div>
    </section>
  );
}
