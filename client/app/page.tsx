import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Filters from "@/app/components/Filters";
import ContentCard from "@/app/components/ContentCard";
import Footer from "@/app/components/Footer";

export default function Home() {
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
  
  ];

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Filters />
      <main className="px-8 py-10 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <ContentCard key={i} {...item} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="bg-gray-900 px-6 py-2 rounded-lg hover:bg-gray-800">
            Load More
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
