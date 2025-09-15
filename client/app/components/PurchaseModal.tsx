"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";

import FilecoinPayABI from "@/lib/abi.json";

const CONTRACT_ADDRESS = "0xEC9c324a6136B055eC653a15A9116f77cc152f26"; // Calibration
const TOKEN_ADDRESS = "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0";

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    price: string; // e.g. "3 tFIL"
    creator: `0x${string}`; // payee
  };
};

export default function PurchaseModal({ isOpen, onClose, item }: PurchaseModalProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  if (!isOpen) return null;

  // Extract numeric price
  const extractNumericValue = (priceString: string): string => {
    const match = priceString.match(/(\d+\.?\d*)/);
    return match ? match[0] : "0";
  };
  const numericPrice = extractNumericValue(item.price);
  const priceInWei = ethers.parseEther(numericPrice);

  // Step 0: check approval
  useEffect(() => {
    async function checkApproval() {
      if (!address) return;
      try {
        const approval: any = await publicClient?.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: FilecoinPayABI,
          functionName: "operatorApprovals",
          args: [TOKEN_ADDRESS, address, address],
        });
        setIsApproved(approval?.isApproved ?? false);
      } catch (err) {
        console.error("Approval check failed:", err);
      }
    }
    checkApproval();
  }, [walletClient, address]);

  // Step 1: grant approval
  async function handleGrantApproval() {
    if (!walletClient || !address) return;
    setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "setOperatorApproval",
        args: [
          TOKEN_ADDRESS,
          address, // operator
          true,
          ethers.MaxUint256,
          ethers.MaxUint256,
          0,
        ],
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      setIsApproved(true);
    } catch (err: any) {
      console.error("Approval error:", err);
      alert("Approval failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // Utility: fetch existing railId if exists
  async function findExistingRail(): Promise<any | null> {
    try {
      const railId = await publicClient?.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "getRailId", // adjust if repo uses different getter
        args: [TOKEN_ADDRESS, address, item.creator],
      });
      return railId ?? null;
    } catch {
      return null; // means no existing rail
    }
  }

  // Step 2-3: handle payment
  async function handleConfirmPayment() {
    if (!walletClient || !address) return;
    setLoading(true);

    try {
      let railId = await findExistingRail();

      // If no rail, create one first
      if (!railId) {
        const hash1 = await writeContractAsync({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: FilecoinPayABI,
          functionName: "createRail",
          args: [
            TOKEN_ADDRESS,
            address,
            item.creator,
            ethers.ZeroAddress, // validator
            0, // commission
            address, // operator
          ],
        });
        const receipt1 = await publicClient?.waitForTransactionReceipt({ hash: hash1 });

        const event = receipt1?.logs.find(
          (log: any) =>
            log.topics[0] ===
            ethers.id("RailCreated(uint256,address,address,address,address,uint16,address)")
        );
        if (!event) throw new Error("RailCreated event not found");

        const iface = new ethers.Interface(FilecoinPayABI);
        const decoded = iface.parseLog(event);
        railId = decoded?.args.railId;
      }

      if (!railId) throw new Error("Could not resolve railId");

      // Lock funds
      const hash2 = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "modifyRailLockup",
        args: [railId, 0, priceInWei],
        value: priceInWei,
      });
      await publicClient?.waitForTransactionReceipt({ hash: hash2 });

      // Release payment
      const hash3 = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "modifyRailPayment",
        args: [railId, 0, priceInWei],
      });
      setTxHash(hash3);
      await publicClient?.waitForTransactionReceipt({ hash: hash3 });
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
          <p className="text-blue-400">{item.price}</p>
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
            {loading
              ? "🔄 Processing…"
              : isTxPending
              ? "⏳ Waiting confirmation…"
              : txHash
              ? "✅ Payment complete"
              : isApproved
              ? "Ready to pay"
              : "Approval required"}
          </p>
          {txHash && (
            <p className="text-blue-400 text-xs mt-2">
              <a
                href={`https://calibration.filfox.info/en/message/${txHash}`}
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
            disabled={loading || isTxPending}
          >
            Cancel
          </button>
          {!isConnected ? (
            <ConnectButton />
          ) : !isApproved ? (
            <button
              onClick={handleGrantApproval}
              disabled={loading || isTxPending}
              className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-500"
            >
              {loading ? "Processing…" : "Grant Approval"}
            </button>
          ) : (
            <button
              onClick={handleConfirmPayment}
              disabled={loading || isTxPending}
              className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500"
            >
              {loading ? "Processing…" : "Confirm Payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
