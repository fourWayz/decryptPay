"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full flex justify-between items-center py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="text-gray-400 pb-4">{answer}</p>}
    </div>
  );
}
