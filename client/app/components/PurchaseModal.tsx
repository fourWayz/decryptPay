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
import FilecoinPayABI from "@/lib/abi.json";

const CONTRACT_ADDRESS = "0xEC9c324a6136B055eC653a15A9116f77cc152f26"; // Payments contract on Calibration
const TOKEN_ADDRESS = "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0"; // tFIL ERC20

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    price: string; // e.g. "0.3 tFIL"
    creator: `0x${string}`; // Payee
  };
};

export default function PurchaseModal({ isOpen, onClose, item }: PurchaseModalProps) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [approvalHash, setApprovalHash] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const { isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const { isLoading: isApprovalPending } = useWaitForTransactionReceipt({
    hash: approvalHash as `0x${string}`,
  });

  // Check current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi: [
      {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
      },
    ],
    functionName: "allowance",
    args: [address as `0x${string}`, CONTRACT_ADDRESS as `0x${string}`],
    query: {
      enabled: !!address && isOpen,
    },
  });

    // Extract numeric price
  const extractNumericValue = (priceString: string): string => {
    const match = priceString.match(/(\d+\.?\d*)/);
    return match ? match[0] : "0";
  };
  const numericPrice = extractNumericValue(item.price);
  const priceInWei = ethers.parseEther(numericPrice); // convert tFIL amount to wei

  useEffect(() => {
    if (currentAllowance !== undefined) {
      const hasSufficientAllowance = BigInt(currentAllowance as unknown as bigint) >= priceInWei;
      setIsApproved(hasSufficientAllowance);
    }
  }, [currentAllowance, priceInWei]);

  if (!isOpen) return null;


  // Step 1: Approve tokens
  async function handleApprove() {
    if (!walletClient || !address) return;
    setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: [
          // Minimal ERC20 ABI
          {
            name: "approve",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "approve",
        args: [CONTRACT_ADDRESS, priceInWei],
      });
      setApprovalHash(hash);
      await publicClient?.waitForTransactionReceipt({ hash });
      await refetchAllowance(); // Refresh allowance after approval
      alert("Approval successful ✅");
    } catch (err: any) {
      console.error("Approval error:", err);
      alert("Approval failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Deposit to creator
  async function handleDeposit() {
    if (!walletClient || !address) return;
    setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FilecoinPayABI,
        functionName: "deposit",
        args: [TOKEN_ADDRESS, item.creator, priceInWei],
        value : priceInWei
      });
      setTxHash(hash);
      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      console.log(receipt,'rcp')
      alert("Payment successful 🎉");
    } catch (err: any) {
      console.error("Payment error:", err);
      alert("Payment failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  const isLoading = loading || isTxPending || isApprovalPending;

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
            {isLoading
              ? "🔄 Processing…"
              : txHash
              ? "✅ Payment complete"
              : isApproved
              ? "✅ Approved - Ready to pay"
              : "Ready to approve and deposit"}
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
            disabled={isLoading}
          >
            Cancel
          </button>
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <>
              <button
                onClick={handleApprove}
                disabled={isLoading || isApproved}
                className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isApproved ? "Approved" : "Approve"}
              </button>
              <button
                onClick={handleDeposit}
                disabled={isLoading || !isApproved}
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