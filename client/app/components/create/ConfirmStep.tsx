"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";
import { supabase } from "@/lib/supabaseClient";
import { Synapse } from "@filoz/synapse-sdk";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { TOKENS, CONTRACT_ADDRESSES } from '@filoz/synapse-sdk'
import { useFileUpload } from "@/hooks/useFileUpload";
export default function ConfirmStep({ onPrev }: { onPrev: () => void }) {
  const { data } = useCreateFlow();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { uploadFileMutation, uploadedInfo, handleReset, status, progress } =
    useFileUpload();

  const { isPending: isUploading, mutateAsync: uploadFile } =
    uploadFileMutation;

  const handleConfirm = async () => {
    if (!data.encryptedFile || !data.file || !data.image) {
      alert("Missing file or image");
      return;
    }
      console.log(data.encryptedFile, data.file)


    setLoading(true);

    try {
 
     const uploadResult = await uploadFile(data.encryptedFile);
      console.log(uploadResult, 'upload result');
      
      const fileCid = uploadResult?.pieceCid; // Use the result from the mutation, not the state
      console.log('File CID:', fileCid);

      if (!fileCid) throw new Error("Failed to upload to Filecoin Synapse");

      // 2️⃣ Upload thumbnail image to Supabase storage
      const fileName = `${Date.now()}-${data.image.name}`;
      const { data: storageRes, error: storageError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, data.image);

      if (storageError) throw storageError;

      const thumbnailPath = storageRes.path;

      // 3️⃣ Save metadata in Supabase DB
      const { error: dbError } = await supabase.from("contents").insert([
        {
          title: data.title,
          description: data.description,
          price: data.price,
          file_cid: fileCid,
          thumbnail_path: thumbnailPath,
          creator: "Anonymous",
        },
      ]);

      if (dbError) throw dbError;

      alert("Upload successful ✅");
      router.push("/"); // redirect to homepage
    } catch (err) {
      console.error("Error confirming upload:", err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Confirm & Upload</h2>

      <div className="mb-6 space-y-2">
        <p><strong>Title:</strong> {data.title}</p>
        <p><strong>Description:</strong> {data.description}</p>
        <p><strong>Price:</strong> {data.price} FIL</p>
        <p><strong>File:</strong> {data.file?.name}</p>
        <p><strong>Thumbnail:</strong> {data.image?.name}</p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Confirm & Upload"}
        </button>
      </div>
    </div>
  );
}
