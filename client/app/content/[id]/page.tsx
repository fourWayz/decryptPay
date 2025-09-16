// eslint-disable-next-line @typescript-eslint/no-explicit-any

"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import PurchaseModal from "@/app/components/PurchaseModal";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useAccount } from "wagmi";
import { Synapse } from "@filoz/synapse-sdk";
import { ethers } from "ethers";

interface ContentItem {
  id: number;
  title: string;
  creator: string;
  price: string;
  usd?: string;
  description?: string;
  thumbnail_path: string;
  file_cid: string;
  encryption_key?: string;
  file_name? : string
}

export default function ContentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { address } = useAccount();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [decryptedBlobUrl, setDecryptedBlobUrl] = useState<string | null>(null);

  // load content metadata and thumbnail
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Failed to fetch content:", error);
        return notFound();
      }

      setItem(data as ContentItem);

      if (data.thumbnail_path) {
        const { data: thumb } = supabase.storage
          .from("thumbnails")
          .getPublicUrl(data.thumbnail_path);
        setImageUrl(thumb.publicUrl);
      }

      // check purchase for current address
      if (address) {
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("content_id", id)
          .eq("buyer_address", address)
          .maybeSingle();

        if (purchase) setHasPurchased(true);
      }
    };

    fetchData();
  }, [id, address]);

  if (!item) return null;

  const isCreator = address?.toLowerCase() === item.creator.toLowerCase();
  const showBuyButton = !isCreator && !hasPurchased;

  // helper: convert base64 key -> CryptoKey for AES-GCM
  async function importKeyFromBase64(base64Key: string) {
    const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
      "raw",
      raw.buffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
  }

  // helper: decrypt bytes (assumes first 12 bytes = IV)
  async function decryptBytes(encryptedBytes: Uint8Array, base64Key: string) {
    const iv = encryptedBytes.slice(0, 12);
    const ciphertext = encryptedBytes.slice(12);
    const key = await importKeyFromBase64(base64Key);

    // subtle.decrypt needs ArrayBuffer
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext.buffer
    );
    return decryptedBuffer; // ArrayBuffer
  }

  // core: download from Synapse, decrypt, return Blob
  async function downloadAndDecryptBlob(fileCid: string, base64Key: string, filename?: string) {
    // ensure window.ethereum exists
    if (typeof window === "undefined" || !(window as any).ethereum) {
      throw new Error("Wallet provider not found (window.ethereum)");
    }

    // Create Synapse using the browser provider
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const synapse = await Synapse.create({ provider });

    // download returns Uint8Array (per your note)
    const result: Uint8Array = await synapse.storage.download(fileCid);
    // decrypt
    const decryptedArrayBuffer = await decryptBytes(result, base64Key);

    // create blob and return
    const blob = new Blob([decryptedArrayBuffer], { type: "application/octet-stream" });

    // filename fallback
    const safeName = filename || `${item?.title.replace(/\s+/g, "-")}.bin`;
    return { blob, filename: safeName };
  }

  // Called when user clicks View
  async function handleView() {
    if (!item) return;
    try {
      setIsProcessing(true);

      const isCreator = address?.toLowerCase() === item.creator.toLowerCase();

      if (!hasPurchased && !isCreator) {
        alert("You must purchase this item to view it.");
        setIsProcessing(false);
        return;
      }

      // Fetch encryption key & file_cid from DB 
      const { data: contentRow, error } = await supabase
        .from("products")
        .select("encryption_key, file_cid,file_name")
        .eq("id", id)
        .single();

      if (error || !contentRow) throw new Error("Failed to fetch content info");

      const encKey = contentRow.encryption_key;
      const fileCid = contentRow.file_cid;
      const fileName = contentRow.file_name || `${item.title}.bin`;

      if (!encKey || !fileCid) throw new Error("Missing encryption key or CID");

      // Download and decrypt
      const { blob } = await downloadAndDecryptBlob(fileCid, encKey, fileName);
      console.log(blob)
      // Open in new tab as blob URL
      const url = URL.createObjectURL(blob);
      setDecryptedBlobUrl(url);
      window.open(url, "_blank");

    } catch (err: any) {
      console.error("View error:", err);
      alert("Failed to retrieve or decrypt file: " + (err.message || err));
    } finally {
      setIsProcessing(false);
    }
  }

  // Called when user clicks Download
  async function handleDownload() {
    if (!item) return;
    try {
      setIsProcessing(true);
      const isCreator = address?.toLowerCase() === item.creator.toLowerCase();

      if (!hasPurchased && !isCreator) {
        alert("You must purchase this item to download it.");
        setIsProcessing(false);
        return;
      }

      const { data: contentRow, error } = await supabase
        .from("products")
        .select("encryption_key, file_cid")
        .eq("id", id)
        .single();

      if (error || !contentRow) throw new Error("Failed to fetch content info");

      const encKey = contentRow.encryption_key;
      const fileCid = contentRow.file_cid;
      const fileName = `${item.title}.rtf`;

      if (!encKey || !fileCid) throw new Error("Missing encryption key or CID");

      const { blob } = await downloadAndDecryptBlob(fileCid, encKey, fileName);

      // trigger download
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Download error:", err);
      alert("Failed to download/decrypt file: " + (err.message || err));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-black text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No thumbnail</span>
            </div>
          )}
          <h1 className="mt-6 text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-400 mt-2">
            by {`${item.creator.slice(0, 6)}...${item.creator.slice(-4)}`}
          </p>
          <div className="flex gap-4 mt-4">
            <span className="text-blue-400 font-semibold">{item.price} tFIL</span>
            {item.usd && <span className="text-gray-500">({item.usd})</span>}
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            {item.description}
          </p>

          <div className="mt-8 flex gap-4">
            {showBuyButton && (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500"
              >
                Purchase
              </button>
            )}

            {/* If buyer (or creator) allow view/download */}
            {!showBuyButton && (
              <>
                <button
                  onClick={handleView}
                  disabled={isProcessing}
                  className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-500"
                >
                  {isProcessing ? "Processing…" : "View Content"}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="bg-gray-800 px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  {isProcessing ? "Processing…" : "Download"}
                </button>
              </>
            )}

            <button className="bg-gray-800 px-6 py-2 rounded-lg hover:bg-gray-700">
              Share
            </button>
          </div>
        </div>

        {/* Purchase Modal */}
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          item={item}
        />
      </div>
      <Footer />
    </>
  );
}
