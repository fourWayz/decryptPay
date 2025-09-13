"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Filters from "@/app/components/Filters";
import ContentCard from "@/app/components/ContentCard";
import Footer from "@/app/components/Footer";
import PurchaseModal from "@/app/components/PurchaseModal";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<null | {
    title: string;
    price: string;
  }>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Filters />
      <main className="px-8 py-10 flex-1">
        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                {...item}
                onBuy={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />

      {selectedProduct && (
        <PurchaseModal
          isOpen={true}
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
