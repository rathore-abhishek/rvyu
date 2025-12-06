"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is rvyu?",
    answer:
      "rvyu is a platform that helps content creators, developers, and reviewers organize and collect project submissions. Instead of hunting through DMs and tweets, you can create a list, share the link, and let your community submit their work for your next review.",
  },
  {
    question: "Is rvyu free to use?",
    answer:
      "Yes! rvyu is completely free and open source. You can create unlimited lists, collect unlimited submissions, and share with your entire community without any cost.",
  },
  {
    question: "How do submissions work?",
    answer:
      "Once you create a list, you'll get a unique submission link to share. Anyone with the link can submit their project by providing details like the project name, description, live URL, and tech stack. You'll see all submissions in your dashboard.",
  },
  {
    question: "Can I organize projects into playlists?",
    answer:
      "Absolutely! You can link your lists to YouTube playlists, making it perfect for video reviewers. Each list can have its own playlist link and video number tracking.",
  },
  {
    question: "How does the review system work?",
    answer:
      "You can add detailed reviews with ratings across multiple criteria including Design, User Experience, Creativity, Functionality, and Hireability. Each rating is on a scale of 1-10, and you can add remarks to provide additional feedback.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="relative z-20 mx-auto max-w-3xl scroll-mt-24 px-4 pt-16"
      id="faq"
    >
      {/* Section Header */}
      <div className="mb-12 space-y-3 text-center">
        <h2 className="text-foreground font-serif text-2xl font-semibold tracking-wider sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground mx-auto max-w-md text-sm md:text-base">
          Got questions? We&apos;ve got answers. If you can&apos;t find what
          you&apos;re looking for, feel free to reach out.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FAQCard
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </section>
  );
};

interface FAQCardProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQCard = ({ question, answer, isOpen, onClick }: FAQCardProps) => {
  return (
    <motion.div
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border transition-colors duration-200",
        isOpen
          ? "border-border bg-card"
          : "border-border/50 hover:border-border hover:bg-card/50",
      )}
      initial={false}
      onClick={onClick}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <h3
          className={cn(
            "text-left font-serif text-base font-semibold tracking-wider transition-colors sm:text-lg",
            isOpen ? "text-foreground" : "text-foreground/80",
          )}
        >
          {question}
        </h3>

        {/* Toggle Icon */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
            isOpen
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </motion.svg>
        </div>
      </div>

      {/* Answer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2, ease: "easeInOut" },
            }}
          >
            <div className="border-t px-4 pt-4 pb-5 sm:px-5">
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQSection;
