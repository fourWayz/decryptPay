"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import PurchaseModal from "@/app/components/PurchaseModal";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { use } from "react";

interface ContentItem {
  id: number;
  title: string;
  creator: string;
  price: string;
  usd?: string;
  description?: string;
  thumbnail_path: string;
}

export default function ContentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

    const { id } = use(params);
  const [item, setItem] = useState<ContentItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Fetch content + user session
  useEffect(() => {
    const fetchData = async () => {
      // get user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);

      // fetch content by id
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return notFound();
      setItem(data);

      // get public thumbnail
      if (data.thumbnail_path) {
        const { data: thumb } = supabase.storage
          .from("thumbnails")
          .getPublicUrl(data.thumbnail_path);
        setImageUrl(thumb.publicUrl);
      }

      // check if user purchased
      if (user) {
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("content_id",id)
          .eq("buyer", user.id)
          .maybeSingle();
        if (purchase) setHasPurchased(true);
      }
    };

    fetchData();
  }, [id]);

  if (!item) return null;

  const isCreator = currentUser === item.creator;
  const showBuyButton = !isCreator && !hasPurchased;

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
            <span className="text-blue-400 font-semibold">
              {item.price} USDFC
            </span>
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
            <button className="bg-gray-800 px-6 py-2 rounded-lg hover:bg-gray-700">
              Share
            </button>
          </div>
        </div>

        {/* Modal */}
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
