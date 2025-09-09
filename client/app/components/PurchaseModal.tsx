"use client";
import { useState } from "react";

export default function PurchaseModal({ onClose }: { onClose: () => void }) {
  const [connected, setConnected] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Complete Your Purchase</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <p className="text-gray-400 mb-6">
          Review your order and finalize the transaction securely.
        </p>

        {/* Payment Summary */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <p className="text-sm">Content Title: <span className="text-gray-300">Decentralized Data Science Tutorial</span></p>
          <p className="text-sm">
            Price: <span className="text-blue-400">0.5 FIL</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">Estimated Gas Fee: 0.0001 FIL</p>
        </div>

        {/* Wallet */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Wallet Connection</h3>
          {!connected ? (
            <button
              onClick={() => setConnected(true)}
              className="bg-blue-600 w-full py-2 rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          ) : (
            <p className="text-green-400">Wallet Connected ✅</p>
          )}
        </div>

        {/* Transaction Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Transaction Status</h3>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>✔ Payment verified</li>
            <li>✔ Key released</li>
            <li>✔ File ready to decrypt</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
