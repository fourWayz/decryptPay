"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";

export default function ConfirmStep({ onPrev }: { onPrev: () => void }) {
  const { data } = useCreateFlow();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyDecryption = async () => {
    if (!data.encryptedFile || !data.encryptionKey) return;

    setVerifying(true);
    setError(null);
    try {
      // Read encrypted blob
      const arrayBuffer = await data.encryptedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // First 12 bytes = IV
      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      // Import the base64 key
      const rawKey = Uint8Array.from(atob(data.encryptionKey), c => c.charCodeAt(0));
      const key = await crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Attempt decryption
      await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      );

      setVerified(true);
    } catch (err) {
      console.error("Decryption failed:", err);
      setError("Decryption failed. Please retry encryption.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    // Later we will integrate Supabase + Synapse SDK upload here
    alert("✅ Confirmed! Ready to upload to storage/payment flow.");
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Confirm & Sign</h2>

      {!verified ? (
        <>
          <p className="mb-4">
            Before finalizing, we’ll verify your encrypted file can be decrypted.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg"
              disabled={verifying}
            >
              Back
            </button>
            <button
              onClick={verifyDecryption}
              className="bg-blue-500 px-4 py-2 rounded-lg"
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify Encryption"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </>
      ) : (
        <>
          <p className="text-green-400 mb-4">✅ Encryption verified successfully!</p>
          <div className="flex space-x-4">
            <button
              onClick={onPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              Confirm & Upload
            </button>
          </div>
        </>
      )}
    </div>
  );
}
