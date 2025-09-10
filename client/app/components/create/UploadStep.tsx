// components/create/UploadStep.tsx
"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";

export default function UploadStep({ onNext }: { onNext: () => void }) {
  const { setData } = useCreateFlow();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setData({ file: e.target.files[0] });
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Upload your file</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={onNext}
        disabled={!file}
        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
