"use client";
import { useState } from "react";
import { useCreateFlow } from "@/app/context/CreateFlowContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAccount } from "wagmi";

export default function ConfirmStep({ onPrev }: { onPrev: () => void }) {
  const { data } = useCreateFlow();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing upload...");
  const router = useRouter();
  const { address } = useAccount();

  const showSuccessAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Your content has been uploaded successfully!",
      icon: "success",
      confirmButtonText: "Awesome!",
      confirmButtonColor: "#3B82F6",
    }).then((result) => {
      if (result.isConfirmed) router.push("/");
    });
  };

  const showErrorAlert = (errorMessage: string) => {
    Swal.fire({
      title: "Upload Failed",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Try Again",
      confirmButtonColor: "#EF4444",
    });
  };

  const showProgressAlert = (message: string, percent: number) => {
    Swal.fire({
      title: "Uploading...",
      html: `
        <div style="text-align: center;">
          <p>${message}</p>
          <div style="background: #e0e0e0; border-radius: 20px; margin: 15px 0;">
            <div style="background: #3B82F6; height: 20px; border-radius: 20px; width: ${percent}%; transition: width 0.3s;"></div>
          </div>
          <p>${percent}% complete</p>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const handleConfirm = async () => {
    if (!data.encryptedFile || !data.file || !data.image) {
      Swal.fire({
        title: "Missing Files",
        text: "Please make sure all files are selected",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus("Starting upload...");
    showProgressAlert("Initializing upload...", 0);

    try {
      // Step 1: Upload encrypted file to /api/store
      setStatus("Uploading encrypted file to OG...");
      setProgress(40);
      Swal.update({ html: generateProgressHTML("Uploading encrypted file...", 40) });

      const formData = new FormData();
      formData.append("file", data.encryptedFile);

      const response = await fetch("/api/store", { method: "POST", body: formData });
console.log(response,'res')
      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

      const uploadResult = await response.json();
      console.log(uploadResult)
      const fileCid = uploadResult?.root;
      if (!fileCid) throw new Error("Failed to upload to OG storage");

      setStatus("Uploading thumbnail...");
      setProgress(70);
      Swal.update({ html: generateProgressHTML("📁 Uploading thumbnail to storage...", 70) });

      // Step 2: Upload thumbnail image to Supabase
      const fileName = `${Date.now()}-${data.image.name}`;
      const { data: storageRes, error: storageError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, data.image);
      if (storageError) throw storageError;

      const thumbnailPath = storageRes.path;

      // Step 3: Save metadata to Supabase
      setStatus("Saving product metadata...");
      setProgress(90);
      Swal.update({ html: generateProgressHTML("Saving metadata to database...", 90) });

      const { error: dbError } = await supabase.from("products").insert([
        {
          title: data.title,
          description: data.description,
          price: data.price,
          file_cid: fileCid,
          encryption_key: data.encryptionKey,
          thumbnail_path: thumbnailPath,
          creator: address,
          file_name: data.file.name,
        },
      ]);

      if (dbError) throw dbError;

      setProgress(100);
      Swal.update({ html: generateProgressHTML("✅ Finalizing upload...", 100) });

      Swal.close();
      showSuccessAlert();
    } catch (err: any) {
      console.error("Error confirming upload:", err);
      Swal.close();
      showErrorAlert(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateProgressHTML = (message: string, percent: number) => `
    <div style="text-align: center;">
      <p>${message}</p>
      <div style="background: #e0e0e0; border-radius: 20px; margin: 15px 0;">
        <div style="background: #3B82F6; height: 20px; border-radius: 20px; width: ${percent}%; transition: width 0.3s;"></div>
      </div>
      <p>${percent}% complete</p>
    </div>
  `;

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Confirm & Upload</h2>

      <div className="mb-6 space-y-2">
        <p><strong>Title:</strong> {data.title}</p>
        <p><strong>Description:</strong> {data.description}</p>
        <p><strong>Price:</strong> {data.price} OG</p>
        <p><strong>File:</strong> {data.file?.name}</p>
        <p><strong>Thumbnail:</strong> {data.image?.name}</p>
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{status}</span>
            <span className="text-sm text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {status}
            </>
          ) : (
            "Confirm & Upload"
          )}
        </button>
      </div>
    </div>
  );
}
