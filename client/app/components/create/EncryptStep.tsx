type Props = { onNext: () => void; onPrev: () => void };

export default function EncryptStep({ onNext, onPrev }: Props) {
  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Encryption</h2>
      <p className="text-gray-400 mb-4">
        Choose your encryption settings before publishing.
      </p>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox text-blue-500" />
          <span>Encrypt file content</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox text-blue-500" />
          <span>Password protection</span>
        </label>
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
