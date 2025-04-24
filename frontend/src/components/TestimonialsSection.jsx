import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import UserAvatar from "./UserAvatar";

export default function TestimonialsSection() {
  const testimonials = [
    {
      user: { firstName: "Anisha", lastName: "Thapa" },
      role: "Biology Student",
      content:
        "Study Buddy helped me find an amazing tutor who explained complex concepts in a way I could understand. My grades improved significantly!",
      rating: 5,
    },
    {
      user: { firstName: "Suman", lastName: "Gurung" },
      role: "Computer Science Major",
      content:
        "The platform is intuitive and made it easy to connect with knowledgeable tutors. I've been using it for 6 months and it's been a game-changer.",
      rating: 5,
    },
    {
      user: { firstName: "Suman", lastName: "Gurung" },
      role: "Math Tutor",
      content:
        "As a tutor, Study Buddy has provided me with a steady stream of students and a reliable payment system. The chating tools are excellent!",
      rating: 4,
    },
    {
      user: { firstName: "Ramesh", lastName: "Adhikari" },
      role: "High School Student",
      content:
        "I was struggling with calculus until I found a tutor on Study Buddy. The question and answer forum is also incredibly helpful.",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  const stats = [
    { value: "4.8", label: "Average Rating" },
    { value: "10k+", label: "Active Students" },
    { value: "2k+", label: "Expert Tutors" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied students and tutors who have transformed
            their educational experience with Study Buddy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <UserAvatar
                    user={testimonial.user}
                    className="h-10 w-10 mr-4"
                  />

                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="italic">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary text-primary-foreground rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
