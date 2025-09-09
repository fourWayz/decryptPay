"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Filters from "@/app/components/Filters";
import ContentCard from "@/app/components/ContentCard";
import Footer from "@/app/components/Footer";
import PurchaseModal from "@/app/components/PurchaseModal";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<null | {
    title: string;
    price: string;
  }>(null);

  const items = [
    {
      image: "/blog.jpg",
      title: "Decentralized Blog Post Kit",
      creator: "CryptoWriter",
      price: "0.5 FIL",
      usd: "15 USDFC",
    },
    {
      image: "/smart-contract.jpg",
      title: "Smart Contract Template",
      creator: "ChainCoders",
      price: "1.2 FIL",
      usd: "35 USDFC",
    },
    {
      id: 1,
      title: "Decentralized Data Science Tutorial",
      creator: "Jane Doe",
      price: "0.5 FIL",
      image: "/file.svg",
    },
    {
      id: 2,
      title: "Blockchain UX Design Guide",
      creator: "John Smith",
      price: "0.3 FIL",
      image: "/window.svg",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Filters />
      <main className="px-8 py-10 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <ContentCard key={i} {...item} onBuy={setSelectedProduct} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="bg-gray-900 px-6 py-2 rounded-lg hover:bg-gray-800">
            Load More
          </button>
        </div>
      </main>
      <Footer />

      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
