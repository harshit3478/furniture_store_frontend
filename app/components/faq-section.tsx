"use client";

import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sample FAQ data
const faqs = [
  {
    id: "1",
    question: "How can I rent from FurnitureCo.?",
    answer:
      "You can browse our catalog, select the items you want to rent, choose your rental period, and complete the checkout process. We'll deliver and set up the furniture for you.",
  },
  {
    id: "2",
    question: "How can I rent from FurnitureCo.?",
    answer:
      "You can browse our catalog, select the items you want to rent, choose your rental period, and complete the checkout process. We'll deliver and set up the furniture for you.",
  },
  {
    id: "3",
    question: "How can I rent from FurnitureCo.?",
    answer:
      "You can browse our catalog, select the items you want to rent, choose your rental period, and complete the checkout process. We'll deliver and set up the furniture for you.",
  },
  {
    id: "4",
    question: "How can I rent from FurnitureCo.?",
    answer:
      "You can browse our catalog, select the items you want to rent, choose your rental period, and complete the checkout process. We'll deliver and set up the furniture for you.",
  },
];

export function FaqSection() {
  return (
    <section className="py-12 w-full bg-white relative" id="faqs">
      <div className="container px-8 w-full md:mb-0 mb-[180px]">
        <div className="grid md:grid-cols-2 w-full">
          {/* Illustration (hidden on mobile, visible on desktop) */}
          <div className="md:block w-full text-left">
            <h1 className="md:text-6xl text-3xl font-extrabold text-gray-400 mb-6">
              FAQs
            </h1>
          </div>

          {/* FAQ Questions and Content */}
          <div className="w-full pt-4 md:p-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-gray-400 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="text-left px-4 py-3 md:text-lg text-gray-700 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-gray-500 md:text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Vector Image */}
      <Image
        src={"/home/faqs/asking-question.png?height=200&width=300"}
        alt="FAQs"
        width={240}
        height={160}
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[15%] md:left-0 md:translate-x-[0%] md:translate-y-[10%]"
      />
    </section>
  );
}
