import { ScrollText } from "lucide-react";
import { Link } from "react-router";

export default function TermsOfService() {
  const effectiveDate = "April 24, 2025";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-muted p-6 rounded-full mb-6">
          <ScrollText className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">
          Terms and Conditions
        </h1>
        <p className="text-muted-foreground">Effective Date: {effectiveDate}</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="mb-8">
          <p className="text-lg">
            Welcome to Study Buddy! By using our platform, you agree to these
            Terms and Conditions. Please read them carefully.
          </p>
        </div>

        <div className="relative w-full h-64 md:h-80 my-10 rounded-lg overflow-hidden">
          <img
            src="/terms-of-service.jpg"
            alt="Terms and agreement"
            className="object-cover w-full h-full"
          />
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Using Our Service</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You must be at least 16 years old or have permission from a
              guardian.
            </li>
            <li>
              You agree to provide accurate information during registration.
            </li>
            <li>You are responsible for keeping your login details safe.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Roles</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Students can book tutors, join discussions, leave reviews, and
              make payments through the platform.
            </li>
            <li>
              Tutors must be verified by our team before offering services.
            </li>
            <li>
              Admins manage platform content and handle disputes if they arise.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Booking & Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              All tutoring sessions (online or offline) must be booked through
              the platform.
            </li>
            <li>
              Payments are processed securely through our integrated payment
              system.
            </li>
            <li>
              Once booked, session changes or cancellations must follow our
              cancellation policy.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Users must not post offensive, illegal, or misleading content in
              discussions or reviews.
            </li>
            <li>
              We reserve the right to remove any content that violates community
              standards or these terms.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Online Communication
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Video calls and chats are provided for educational purposes only.
            </li>
            <li>
              Inappropriate behavior during video calls or in chat may result in
              account termination.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate these Terms</li>
            <li>Engage in fraud, harassment, or misuse of the platform</li>
            <li>Provide false information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Limitations of Liability
          </h2>
          <p>We do our best to provide a safe and reliable platform, but:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We are not responsible for personal interactions outside the
              platform.
            </li>
            <li>
              We are not liable for tutor performance or learning outcomes.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Changes to the Terms
          </h2>
          <p>
            We may update these Terms occasionally. Continued use of Study Buddy
            means you agree to the latest version.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>Got questions about these Terms? Contact us anytime at:</p>
          <p className="mt-2">
            <span className="inline-block">📧</span>{" "}
            <a
              href="mailto:support@studybuddy.com"
              className="text-primary hover:underline"
            >
              support@studybuddy.com
            </a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link to="/" className="text-primary hover:underline flex items-center">
          <span className="mr-2">←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
