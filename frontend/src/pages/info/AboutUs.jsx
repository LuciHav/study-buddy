import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  MessageCircle,
  GraduationCap,
  Target,
  Clock,
} from "lucide-react";
import { Link } from "react-router";

export default function AboutUs() {
  return (
    <div className="mb-24  mx-auto py-12">
      <section className="pb-12 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                How Study Buddy Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Connect with fellow students and expert tutors to enhance your
                learning journey.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<MessageCircle className="h-12 w-12 text-primary" />}
                title="Post Your Questions"
                description="Share your academic questions and get help from the community"
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 text-primary" />}
                title="Connect with Peers"
                description="Collaborate with students who share your academic interests"
              />
              <FeatureCard
                icon={<GraduationCap className="h-12 w-12 text-primary" />}
                title="Expert Tutors"
                description="Get guidance from verified tutors in your subject area"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-4">
            <StatsCard number="10k+" label="Active Students" />
            <StatsCard number="500+" label="Expert Tutors" />
            <StatsCard number="50k+" label="Questions Answered" />
            <StatsCard number="100+" label="Subjects Covered" />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <img
              src="/about-us.jpg"
              width={400}
              height={400}
              alt="Students studying"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                At Study Buddy, we believe that learning is better together. Our
                mission is to create a collaborative learning environment where
                every student can access the help they need to succeed in their
                academic journey.
              </p>
              <ul className="grid gap-4">
                <BenefitItem
                  icon={<Target />}
                  text="Personalized learning experience"
                />
                <BenefitItem
                  icon={<BookOpen />}
                  text="Access to quality educational resources"
                />
                <BenefitItem icon={<Clock />} text="24/7 academic support" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Join our community of learners and get the help you need to
              succeed in your studies.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/signup">
                <Button size="lg">Join Study Buddy</Button>
              </Link>
              <Link to="/posts">
                <Button variant="outline" size="lg">
                  Browse Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatsCard({ number, label }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="text-3xl font-bold">{number}</div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function BenefitItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}
