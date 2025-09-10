"use client";
import { Dispatch, SetStateAction } from "react";

interface EncryptStepProps {
  file: File | null;
  encryptedFile: Uint8Array | null;
  setEncryptedFile: Dispatch<SetStateAction<Uint8Array | null>>;
  setEncKey: Dispatch<SetStateAction<string | null>>;
  onNext: () => void;
  onPrev: () => void;
}

export default function EncryptStep({
  file,
  encryptedFile,
  setEncryptedFile,
  setEncKey,
  onNext,
  onPrev,
}: EncryptStepProps) {
  const handleEncrypt = async () => {
    if (!file) return;

    // Dummy encryption for now
    const buffer = new Uint8Array(await file.arrayBuffer());
    const key = "dummy-key-" + Date.now();

    setEncryptedFile(buffer);
    setEncKey(key);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Encryption</h2>
      {!encryptedFile ? (
        <button
          onClick={handleEncrypt}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
        >
          Encrypt File
        </button>
      ) : (
        <p className="text-green-400 mb-4">File encrypted successfully ✅</p>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="bg-gray-700 px-6 py-2 rounded-lg">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!encryptedFile}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
