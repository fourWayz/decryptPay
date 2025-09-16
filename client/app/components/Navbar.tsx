"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      // Get all purchases where current user is the creator
      const { data, error } = await supabase
        .from("purchases")
        .select("price, creator_address")
        .eq("creator_address", address.toString());

      if (error) {
        console.error("Error fetching purchases:", error.message);
        return;
      }

      if (data) {
        const total = data.reduce((acc, p) => acc + Number(p.price), 0);
        setBalance(total);
      }
    };

    fetchBalance();
  }, [address]);

  return (
    <header className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-blue-400 font-bold text-xl">DecryptPay</span>
        <span className="font-semibold">DecryptPay</span>
      </div>

      <nav className="hidden md:flex gap-6 text-gray-300">
        <Link href="/" className="hover:text-white">Browse</Link>
        <Link href="/create" className="hover:text-white">Create</Link>
        <Link href="#" className="hover:text-white">Dashboard</Link>
      </nav>

      <div className="flex items-center gap-4">
        {address && (
          <span className="text-sm text-gray-300">
            Sales Balance: <span className="text-blue-400 font-semibold">{balance} tFIL</span>
          </span>
        )}
        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
          <ConnectButton chainStatus="icon" accountStatus="address" />
        </div>
      </div>
    </header>
  );
}
