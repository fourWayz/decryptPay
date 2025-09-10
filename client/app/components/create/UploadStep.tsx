"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";

export default function UploadStep({ onNext }: { onNext: () => void }) {
  const { setData } = useCreateFlow();
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleNext = () => {
    if (file && image) {
      setData({ file, image });
      onNext();
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Upload Your Content</h2>
      <label>Your file</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />

      <label>Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-4 block"
      />

      <button
        onClick={handleNext}
        className="bg-blue-500 px-4 py-2 rounded-lg"
        disabled={!file || !image}
      >
        Continue
      </button>
    </div>
  );
}
