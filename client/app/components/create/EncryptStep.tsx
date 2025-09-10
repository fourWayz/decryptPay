"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";

export default function EncryptStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const { data, setData } = useCreateFlow();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!data.file) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <p className="text-gray-400">No file selected. Please go back.</p>
        <button onClick={onPrev} className="mt-4 bg-gray-700 px-4 py-2 rounded-lg">
          Back
        </button>
      </div>
    );
  }

  const encryptFile = async () => {
    setLoading(true);
    try {
      if(!data.file) return
      // Convert file to ArrayBuffer
      const arrayBuffer = await data.file.arrayBuffer();

      // Generate AES-GCM key
      const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      // Export key to base64
      const rawKey = await crypto.subtle.exportKey("raw", key);
      const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));

      // Create random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        arrayBuffer
      );

      // Store encrypted file as Blob
      const encryptedBlob = new Blob([iv, new Uint8Array(encrypted)], { type: "application/octet-stream" });

      // Update context
      setData({
        encryptedFile: encryptedBlob,
        encryptionKey: keyBase64,
      });

      setDone(true);
    } catch (err) {
      console.error("Encryption error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Encrypt File</h2>
      {!done ? (
        <>
          <p className="mb-4">We’ll encrypt your file using AES-GCM before storing it securely.</p>
          <div className="flex space-x-4">
            <button
              onClick={onPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={encryptFile}
              className="bg-blue-500 px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Encrypting..." : "Encrypt"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-green-400 mb-4">✅ File encrypted successfully!</p>
          <div className="flex space-x-4">
            <button
              onClick={onPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}
