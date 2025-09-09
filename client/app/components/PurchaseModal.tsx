interface PurchaseModalProps {
  onClose: () => void;
  product: {
    title: string;
    price: string;
  };
}

export default function PurchaseModal({ onClose, product }: PurchaseModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Complete Your Purchase</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <p>
            <span className="font-medium">Content Title:</span> {product.title}
          </p>
          <p>
            <span className="font-medium">Price:</span>{" "}
            <span className="text-blue-400">{product.price}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">Estimated Gas Fee: 0.0001 FIL</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Wallet Connection</h3>
          <div className="text-gray-400 mb-2">Wallet Disconnected</div>
          <button className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition">
            Connect Wallet
          </button>
        </div>

        {/* Transaction Status */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Transaction Status</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>✅ Payment verified</li>
            <li>🔑 Key released</li>
            <li>📂 File ready to decrypt</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
