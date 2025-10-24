"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface ContentCardProps {
  id: number;
  title: string;
  creator: string;
  description?: string;
  price: string;
  usd?: string;
  thumbnail_path: string;
  onBuy?: (product: { id: number; title: string; price: string; creator: string }) => void;
}

export default function ContentCard({
  id,
  title,
  creator,
  description,
  price,
  usd,
  thumbnail_path,
  onBuy,
}: ContentCardProps) {
  const { address } = useAccount();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  // Fetch thumbnail
  useEffect(() => {
    if (thumbnail_path) {
      const { data } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(thumbnail_path);
      setImageUrl(data.publicUrl);
    }
  }, [thumbnail_path]);

  // Check if user already purchased
  useEffect(() => {
    const checkPurchase = async () => {
      if (!address) return;
      const { data, error } = await supabase
        .from("purchases")
        .select("id")
        .eq("content_id", id.toString())
        .eq("buyer_address", address.toString())
        .maybeSingle();

      if (!error && data) {
        setAlreadyPurchased(true);
      }
    };

    checkPurchase();
  }, [address, id]);

  // Shorten long descriptions
  const shortDescription =
    description && description.length > 80
      ? description.slice(0, 80) + "..."
      : description;

  const isCreator = address?.toLowerCase() === creator.toLowerCase();

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col">
      <Link href={`/content/${id}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="rounded-lg mb-4 w-full h-40 object-cover"
          />
        ) : (
          <div className="rounded-lg mb-4 w-full h-40 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No thumbnail</span>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-gray-400 text-xs mb-2">
          By {`${creator.slice(0, 6)}...${creator.slice(-4)}`}
        </p>

        {shortDescription && (
          <p className="text-gray-300 text-sm mb-3">{shortDescription}</p>
        )}

        <p className="text-blue-400 font-medium">
          {price} OG {usd && <span className="text-gray-400">({usd})</span>}
        </p>
      </Link>

      {/* Hide Buy button if creator or buyer */}
      {!isCreator && !alreadyPurchased && (
        <button
          onClick={() =>
            onBuy && onBuy({ id, title, price: price, creator })
          }
          className="mt-auto bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Buy
        </button>
      )}
      {(isCreator || alreadyPurchased) && (
        <p className="mt-auto text-green-400 text-sm text-center">
          {isCreator ? "You are the creator" : "Already purchased ✅"}
        </p>
      )}
    </div>
  );
}
