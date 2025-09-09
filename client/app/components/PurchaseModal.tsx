"use client";
import { useState } from "react";

export default function PurchaseModal({ isOpen, onClose, item }: any) {
  if (!isOpen) return null;

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
          <p className="mt-2 text-sm text-gray-400">Estimated Gas Fee: 0.0001 FIL</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">Wallet Connection</p>
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Wallet Disconnected</p>
            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500">
              Connect Wallet
            </button>
          </div>
        </div>

        {/* Transaction Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">Transaction Status</p>
          <ul className="space-y-1 text-gray-400 text-sm">
            <li>🔄 Payment verified</li>
            <li>🔑 Key released</li>
            <li>📂 File ready to decrypt</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
