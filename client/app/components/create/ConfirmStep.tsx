"use client";
import { ethers } from "ethers";
import { Synapse, RPC_URLS } from "@filoz/synapse-sdk";
import { createClient } from "@supabase/supabase-js";

interface ConfirmStepProps {
  file: File | null;
  encryptedFile: Uint8Array | null;
  encKey: string | null;
  title: string;
  description: string;
  price: string;
  onPrev: () => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default function ConfirmStep({
  file,
  encryptedFile,
  encKey,
  title,
  description,
  price,
  onPrev,
}: ConfirmStepProps) {
  const handleConfirm = async () => {
    if (!file || !encryptedFile) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const synapse = await Synapse.create({ provider });

      // Upload encrypted file
      const uploadResult = await synapse.storage.upload(encryptedFile);
      const cid = uploadResult.pieceCid;

      // Save metadata in Supabase
      await supabase.from("listings").insert([
        {
          title,
          description,
          price,
          cid,
          enc_key: encKey,
          creator: await provider.getAddress(),
        },
      ]);

      alert("File uploaded & metadata saved!");
    } catch (err) {
      console.error(err);
      alert("Error: " + (err as any).message);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Confirm & Sign</h2>
      <p><strong>Title:</strong> {title}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Price:</strong> {price} FIL</p>
      <p><strong>File:</strong> {file?.name}</p>

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="bg-gray-700 px-6 py-2 rounded-lg">
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
        >
          Confirm & Upload
        </button>
      </div>
    </div>
  );
}
