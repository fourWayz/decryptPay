"use client";
import { Dispatch, SetStateAction } from "react";

interface UploadStepProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  onNext: () => void;
}

export default function UploadStep({ file, setFile, onNext }: UploadStepProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Upload File</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      {file && <p className="text-sm text-green-400">Selected: {file.name}</p>}
      <button
        onClick={onNext}
        disabled={!file}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
