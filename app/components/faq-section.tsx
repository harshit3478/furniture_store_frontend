"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    question: "What are the rental periods available?",
    answer:
      "We offer flexible rental periods from 1 month to 24 months. You can extend your rental period at any time during your rental term.",
  },
  {
    id: "3",
    question: "Do you provide delivery and setup?",
    answer:
      "Yes! We provide free delivery and professional setup for all rentals within our service area. Our team will arrange the furniture exactly how you want it.",
  },
  {
    id: "4",
    question: "What happens if furniture gets damaged?",
    answer:
      "Normal wear and tear is expected and covered. For accidental damage, we offer affordable protection plans that cover most situations.",
  },
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-gray-400 font-gilroyMedium rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-500">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 md:text-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      >
        <span>{question}</span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 font-gilroy text-gray-400 md:text-lg border-t border-gray-200">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      // For single accordion behavior, clear all others
      newOpenItems.clear();
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

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
            <div className="w-full space-y-2">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openItems.has(faq.id)}
                  onToggle={() => toggleItem(faq.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Vector Image */}
      <Image
        src={"/home/faqs/asking-question.png?height=200&width=300"}
        alt="FAQs"
        width={240}
        height={160}
        className="absolute left-1/2 bottom-0 bg-white px-2 transform -translate-x-1/2 translate-y-[15%] md:left-0 md:translate-x-[0%] md:translate-y-[10%]"
      />
    </section>
  );
}