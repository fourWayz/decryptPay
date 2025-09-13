"use client";
import { useState } from "react";
import { useAccount, useWalletClient, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";

import FilecoinPayABI from "@/lib/abi.json"; // adjust the path

const CONTRACT_ADDRESS = "0x0E690D3e60B0576D01352AB03b258115eb84A047"; // Calibration

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    price: string;        // in FIL, e.g. "3 tFIL"
    creator: `0x${string}`;  // payee address
  };
};

export default function PurchaseModal({ isOpen, onClose, item }: PurchaseModalProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Wait for transaction
  const { isLoading: isTxPending, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  // Extract numeric value from price string (e.g., "3 tFIL" -> "3")
  const extractNumericValue = (priceString: string): string => {
    // Match the first number in the string (including decimals)
    const match = priceString.match(/(\d+\.?\d*)/);
    return match ? match[0] : '0';
  };

  const numericPrice = extractNumericValue(item.price);
  const priceInWei = ethers.parseEther(numericPrice);

  async function handleConfirmPayment() {
    if (!walletClient) {
      alert("Wallet not connected");
      return;
    }
    setLoading(true);
    try {
      // Step 1: createRail
      const hash1 = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "createRail",
        args: [
          ethers.ZeroAddress, // token = native FIL
          address,
          '0x9C805e6A52435a6a11e5C037F1BBB61B5232702a',
          ethers.ZeroAddress, // no validator
          0, // commission bps
          ethers.ZeroAddress  // operator
        ],
      });

      console.log(hash1,'hash1')
      // Wait for transaction receipt
      const receipt1 = await publicClient?.waitForTransactionReceipt({ hash: hash1 });
      
      // Parse railId from events
      const event = receipt1?.logs.find((log: any) => 
        log.topics[0] === ethers.id("RailCreated(uint256,address,address,address,address,uint16,address)")
      );
      
      if (!event) {
        throw new Error("RailCreated event not found");
      }
      
      // Decode the event data to get railId
      const iface = new ethers.Interface(FilecoinPayABI);
      const decoded = iface.parseLog(event);
      const railId = decoded?.args.railId;

      if (!railId) {
        throw new Error("Could not extract railId from event");
      }

      // Step 2: Lock up funds (one-time payment)
      const hash2 = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "modifyRailLockup",
        args: [
          railId,
          0,              // lockupPeriod = 0 for immediate
          priceInWei,
        ],
        value: priceInWei,
      });
      await publicClient?.waitForTransactionReceipt({ hash: hash2 });

      // Step 3: Trigger payment
      const hash3 = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "modifyRailPayment",
        args: [
          railId,
          0,              // paymentRate = 0 (for one-time payment)
          priceInWei
        ],
      });
      
      setTxHash(hash3);
      await publicClient?.waitForTransactionReceipt({ hash: hash3 });

      // Optional: you can wait for receipt3.confirmations or isSuccess flag
      // Unlock content / notify backend etc

    } catch (err: any) {
      console.error("Payment error:", err);
      alert("Payment failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">Complete Your Purchase</h2>
        <p className="text-gray-400 text-sm mb-4">
          Review your order and finalize the transaction securely.
        </p>

        {/* Payment Summary */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400">Content Title:</p>
          <p className="font-semibold">{item.title}</p>
          <p className="mt-2 text-sm text-gray-400">Price:</p>
          <p className="text-blue-400">{item.price}</p>
          <p className="text-sm text-gray-400 mt-1">(Numeric value: {numericPrice} FIL)</p>
          <p className="mt-2 text-sm text-gray-400">Estimated Gas Fee: ~0.0001 tFIL</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">Wallet Connection</p>
          {isConnected ? (
            <p className="text-green-400">
              Connected: {address?.slice(0, 6)}…{address?.slice(-4)}
            </p>
          ) : (
            <ConnectButton />
          )}
        </div>

        {/* Transaction Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">Transaction Status</p>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li>
              {loading
                ? "🔄 Sending transactions…"
                : isTxPending
                ? "⏳ Waiting confirmation"
                : txHash
                ? "✅ Payment completed"
                : "🔐 Ready to pay"}
            </li>
            {txHash && (
              <li>
                Tx:{" "}
                <a
                  href={`https://calibration.filfox.info/en/message/${txHash}`}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  {txHash}
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            disabled={loading || isTxPending}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            disabled={!isConnected || loading || isTxPending}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500"
          >
            {loading ? "Processing…" : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}