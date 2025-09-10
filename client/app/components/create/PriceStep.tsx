"use client";
import { Dispatch, SetStateAction } from "react";

interface PriceStepProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  price: string;
  setPrice: Dispatch<SetStateAction<string>>;
  onNext: () => void;
  onPrev: () => void;
}

export default function PriceStep({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  onNext,
  onPrev,
}: PriceStepProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Set Price & Details</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-3 rounded-lg bg-gray-800 border border-gray-700"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-3 rounded-lg bg-gray-800 border border-gray-700"
      />
      <input
        type="number"
        placeholder="Price (FIL)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 mb-3 rounded-lg bg-gray-800 border border-gray-700"
      />

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="bg-gray-700 px-6 py-2 rounded-lg">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!title || !price}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
