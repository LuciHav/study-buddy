import { Shield } from "lucide-react";
import { Link } from "react-router";

export default function DataProtection() {
  const effectiveDate = "April 24, 2025";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-muted p-6 rounded-full mb-6">
          <Shield className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Effective Date: {effectiveDate}</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="mb-8">
          <p className="text-lg">
            Welcome to Study Buddy! This Privacy Policy explains how we collect,
            use, and protect your information when you use our website and
            services.
          </p>
        </div>

        <div className="relative w-full h-64 md:h-80 my-10 rounded-lg overflow-hidden">
          <img
            src="/privacy-policy.jpg"
            alt="Data privacy and security"
            className="object-cover w-full h-full"
          />
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Personal Information:</span> such as
              your name, email address, contact number, and educational
              background when you register.
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> including your
              login history, search preferences, and interaction with tutors or
              other users.
            </li>
            <li>
              <span className="font-medium">Payment Information:</span> for
              booking tutoring sessions, we collect limited payment details.
              These are securely processed by our third-party payment provider.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our services</li>
            <li>Facilitate tutor-student interactions</li>
            <li>Process payments and send invoices</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>
              Send notifications and updates about services or your account
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Information Sharing
          </h2>
          <p>
            We do not sell your personal information. We may share information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With tutors or students to facilitate learning interactions</li>
            <li>With service providers (e.g., payment processors)</li>
            <li>If required by law or legal process</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and update your personal information</li>
            <li>Delete your account</li>
            <li>Object to certain data uses</li>
            <li>Contact us with questions or complaints</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We use encryption and access controls to protect your data. Only
            authorized personnel can access sensitive information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
          <p>
            We use cookies to improve user experience and website performance.
            You can manage cookie settings through your browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. You will be notified of
            significant changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this policy or your data, contact us
            at:
          </p>
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
