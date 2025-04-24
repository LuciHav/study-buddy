import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavButton from "./NavButton";

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I find a tutor on Study Buddy?",
      answer:
        "You navigate to the tutors page and find tutors by browsing their experiences, subjects, and detailed profiles.",
    },
    {
      question: "How are payments handled?",
      answer:
        "Payments are handled securely through Stripe, our trusted payment processor.",
    },
    {
      question: "Who are the tutors on Study Buddy?",
      answer:
        "Tutors are subject experts who are verified by the Study Buddy admin team before they are allowed to offer sessions.",
    },
    {
      question: "How can I contact Study Buddy?",
      answer:
        "You can get in touch with us through the 'Contact Us' page and we will follow up with you as soon as possible.",
    },
    {
      question: "How are bookings done?",
      answer:
        "You first request a booking, and then the tutor views your request and either accepts or rejects it based on their availability.",
    },
    {
      question: "How do online tutoring sessions work?",
      answer:
        "Online sessions work through chat or video call features integrated within the platform, allowing direct communication between students and tutors.",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about using Study Buddy for your
            learning journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">Still have questions?</p>
          <NavButton to="/contact-us" variant="outline" size="lg">
            Contact Support
          </NavButton>
        </div>
      </div>
    </section>
  );
}
