import { ChevronDown, Search } from "lucide-react";

export default function Filters() {
  return (
    <div className="bg-black text-white px-8 py-6 flex flex-col md:flex-row items-center gap-4">
      <h2 className="text-lg font-semibold flex-1">Explore Content</h2>
      <div className="flex gap-4">
        <button className="bg-gray-900 px-4 py-2 rounded-lg flex items-center gap-2">
          Category <ChevronDown size={16} />
        </button>
        <button className="bg-gray-900 px-4 py-2 rounded-lg flex items-center gap-2">
          Price <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex items-center bg-gray-900 px-4 py-2 rounded-lg flex-1 md:max-w-sm">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search content, creators..."
          className="bg-transparent outline-none ml-2 flex-1 text-sm"
        />
      </div>
    </div>
  );
}
