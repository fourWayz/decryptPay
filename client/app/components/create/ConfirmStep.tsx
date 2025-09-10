"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmStep({ onPrev }: { onPrev: () => void }) {
  const { data } = useCreateFlow();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!data.encryptedFile || !data.title || !data.price || !data.image) {
      setError("Missing required data.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload encrypted file to Supabase Storage
      const fileName = `${Date.now()}-${data.file?.name || "content.enc"}`;
      const imageName = `${Date.now()}-${data.image?.name || "cover.png"}`;

//       await supabase.storage.createBucket('images', {
//   public: true,
//   fileSizeLimit: 10485760, // 10MB
//   allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
// })
      const { data: storageData, error: storageError } = await supabase.storage
        .from("content")
        .upload(fileName, data.encryptedFile);

      const { data: imageData, error: imageError } = await supabase.storage
        .from("thumbnails")
        .upload(imageName, data.image);

      if (imageError) throw imageError;

      if (storageError) throw storageError;

      const filePath = storageData.path;
      const imagePath = imageData.path;

      // Insert metadata into Supabase DB
      const { error: dbError } = await supabase.from("products").insert([
        {
          title: data.title,
          description: data.description,
          price: data.price,
          file_path: filePath,
          thumbnail_path: imagePath,
          encryption_key: data.encryptionKey,
          creator: "demo-user",
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Confirm & Upload</h2>

      {!success ? (
        <>
          <p className="mb-4 text-gray-300">
            We’ll now upload your encrypted file and save its details securely.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg"
              disabled={uploading}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 px-4 py-2 rounded-lg"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Confirm & Upload"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </>
      ) : (
        <p className="text-green-400">✅ Upload successful! Your content is now live.</p>
      )}
    </div>
  );
}
