// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import ABI from "@/lib/abi.json";
import { supabase } from "@/lib/supabaseClient";
import Swal from 'sweetalert2';


const CONTRACT_ADDRESS = "0x666788808eE647f2fFeC1FBe6bedf7c378f93159"; // Payments contract 

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    title: string;
    creator: string;
    price: string;
    usd?: string;
    description?: string;
    thumbnail_path: string;
  };
};

export default function PurchaseModal({ isOpen, onClose, item }: PurchaseModalProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const numericPrice = item.price
  const priceInWei = ethers.parseEther(item.price.toString()); // convert og amount to wei

  if (!isOpen) return null;


  //  Deposit to the contract for creator
  async function handleDeposit() {
    if (!walletClient || !address) return;
    setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "deposit",
        args: [item.creator],
        value: priceInWei
      });
      setTxHash(hash);
      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      console.log(receipt)
      //  Save purchase to Supabase
      const { error } = await supabase.from("purchases").insert({
        content_id: item.id,
        buyer_address: address,
        creator_address: item.creator,
        price: numericPrice,
        tx_hash: hash,
        status: "completed",
      });

      if (error) {
        console.error("Supabase insert error:", error);
        Swal.fire({
          title: 'Database Error',
          text: 'Payment succeeded but saving to DB failed',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Success',
          text: 'Payment successful',
          icon: 'success',
        });

        onClose()
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      Swal.fire({
        title: 'Payment failed',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  const isLoading = loading || isTxPending ;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">Complete Your Purchase</h2>
        <p className="text-gray-400 text-sm mb-4">
          Review your order and finalize securely.
        </p>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400">Content Title:</p>
          <p className="font-semibold">{item.title}</p>
          <p className="mt-2 text-sm text-gray-400">Price:</p>
          <p className="text-blue-400">{item.price} OG</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">Wallet</p>
          {isConnected ? (
            <p className="text-green-400">
              Connected: {address?.slice(0, 6)}…{address?.slice(-4)}
            </p>
          ) : (
            <ConnectButton />
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">Status</p>
          <p className="text-sm text-gray-400">
            {isLoading
              ? "🔄 Processing…"
              : txHash
                ? "✅ Payment complete"
                  : "Ready to deposit"}
          </p>
          {txHash && (
            <p className="text-blue-400 text-xs mt-2">
              <a
                href={`http://chainscan-galileo.0g.ai/tx/${txHash}`}
                target="_blank"
                className="underline"
              >
                View on Explorer
              </a>
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            disabled={isLoading}
          >
            Cancel
          </button>
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <>
              <button
                onClick={handleDeposit}
                disabled={isLoading}
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Pay
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}