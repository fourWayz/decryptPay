"use client";
import { useCreateFlow } from "@/app/context/CreateFlowContext";

type PriceStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function PriceStep({ onNext, onPrev }: PriceStepProps) {
  const { data, setData } = useCreateFlow();

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Set Price & Details</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={data.title || ""}
          onChange={(e) => setData({ title: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <textarea
          placeholder="Description"
          value={data.description || ""}
          onChange={(e) => setData({ description: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="number"
          placeholder="Price (USDFC)"
          value={data.price || ""}
          onChange={(e) => setData({ price: Number(e.target.value) })}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="bg-gray-700 px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
