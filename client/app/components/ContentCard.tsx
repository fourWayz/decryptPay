import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface ContentCardProps {
  id: number;
  title: string;
  creator: string;
  description?: string;
  price: number;
  usd?: string;
  thumbnail_path: string;
  onBuy?: (product: { title: string; price: string }) => void;
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (thumbnail_path) {
      const { data } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(thumbnail_path);
      setImageUrl(data.publicUrl);
    }
  }, [thumbnail_path]);

  // Shorten long descriptions
  const shortDescription =
    description && description.length > 80
      ? description.slice(0, 80) + "..."
      : description;

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
        <p className="text-gray-400 text-xs mb-2">By {creator}</p>

        {shortDescription && (
          <p className="text-gray-300 text-sm mb-3">{shortDescription}</p>
        )}

        <p className="text-blue-400 font-medium">
          {price} tFIL {usd && <span className="text-gray-400">({usd})</span>}
        </p>
      </Link>

      <button
        onClick={() => onBuy && onBuy({ title, price: `${price} tFIL` })}
        className="mt-auto bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Buy
      </button>
    </div>
  );
}
