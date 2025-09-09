type Props = { onPrev: () => void };

export default function ConfirmStep({ onPrev }: Props) {
  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Confirm & Sign</h2>
      <p className="text-gray-400 mb-4">
        Review your details and confirm the transaction.
      </p>
      <ul className="text-sm text-gray-300 mb-6 space-y-2">
        <li>📄 File: example.pdf</li>
        <li>🔒 Encrypted: Yes</li>
        <li>💰 Price: 0.05 ETH</li>
      </ul>
      <div className="flex justify-between">
        <button onClick={onPrev} className="px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-800">
          Previous
        </button>
        <button className="px-6 py-2 bg-green-600 rounded-md hover:bg-green-700">
          Confirm & Sign
        </button>
      </div>
    </div>
  );
}
