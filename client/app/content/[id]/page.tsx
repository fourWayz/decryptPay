"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import PurchaseModal from "@/app/components/PurchaseModal";

const mockItems = [
  {
    id: 1,
    title: "Decentralized Data Science Tutorial",
    creator: "Jane Doe",
    price: "0.5 FIL",
    usd: "15 USDFC",
    image: "/file.svg",
    description:
      "A comprehensive tutorial on decentralized approaches to data science, covering storage, computation, and privacy-preserving methods.",
  },
  {
    id: 2,
    title: "Blockchain UX Design Guide",
    creator: "John Smith",
    price: "0.3 FIL",
    usd: "10 USDFC",
    image: "/window.svg",
    description:
      "Step-by-step guide to creating user-friendly blockchain applications, with best practices for onboarding and design.",
  },
];

export default function ContentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [isModalOpen, setModalOpen] = useState(false);
  const item = mockItems.find((x) => x.id.toString() === id);
console.log(item)
  if (!item) return notFound();

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <h1 className="mt-6 text-3xl font-bold">{item.title}</h1>
        <p className="text-gray-400 mt-2">by {item.creator}</p>
        <div className="flex gap-4 mt-4">
          <span className="text-blue-400 font-semibold">{item.price}</span>
          <span className="text-gray-500">{item.usd}</span>
        </div>
        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          {item.description}
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500"
          >
            Purchase
          </button>
          <button className="bg-gray-800 px-6 py-2 rounded-lg hover:bg-gray-700">
            Share
          </button>
        </div>
      </div>

      {/* Modal */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        product={item}
      />
    </div>
  );
}
