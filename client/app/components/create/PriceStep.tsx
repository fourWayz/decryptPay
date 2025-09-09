type Props = { onNext: () => void; onPrev: () => void };

export default function PriceStep({ onNext, onPrev }: Props) {
  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Set Price & Details</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
        />
        <input
          type="number"
          placeholder="Price in ETH"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
        />
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-800">
          Previous
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
          Next Step
        </button>
      </div>
    </div>
  );
}
