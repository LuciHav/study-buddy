import { ArrowRight, BookOpen } from "lucide-react";
import NavButton from "./NavButton";

export default function HeroSection() {
  return (
    <section className="py-16 w-full overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Unlock Deeper Learning <br />
              <span className="text-5xl text-red-400 md:text-6xl lg:text-8xl">
                &amp;
              </span>{" "}
              Greater Wonders
            </h1>

            <p className="text-xl text-muted-foreground">
              Study Buddy is your go-to online platform for submitting questions
              and getting answers from other users. Find tutors, make private
              payments online, and enhance your learning experience with ease.
              Join us today and take your education to the next level!
            </p>

            <div className="flex flex-wrap gap-4">
              <NavButton to="/contact-us" size="lg" className="gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </NavButton>
              <NavButton
                to="/tutors"
                size="lg"
                variant="outline"
                className="gap-2"
              >
                Find a Tutor
                <BookOpen className="h-4 w-4" />
              </NavButton>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                className="w-full h-auto object-cover"
                src="./hero.jpg"
                alt="Students learning together"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
