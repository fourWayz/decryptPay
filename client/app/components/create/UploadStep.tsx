type Props = { onNext: () => void };

export default function UploadStep({ onNext }: Props) {
  return (
    <div className="bg-gray-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Upload Your Digital Content</h2>
      <div className="border-2 border-dashed border-gray-600 rounded-lg h-48 flex flex-col items-center justify-center">
        <span className="text-gray-400">Drag & Drop Your File Here</span>
        <button className="mt-3 px-4 py-2 bg-gray-700 rounded-md">Browse Files</button>
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onNext} className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
          Next Step
        </button>
      </div>
    </div>
  );
}
