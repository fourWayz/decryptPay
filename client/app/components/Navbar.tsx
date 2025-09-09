import { Wallet } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-blue-400 font-bold text-xl">DecryptPay</span>
        <span className="font-semibold">DecryptPay</span>
      </div>
      <nav className="hidden md:flex gap-6 text-gray-300">
        <a href="#" className="hover:text-white">Browse</a>
        <a href="#" className="hover:text-white">Create</a>
        <a href="#" className="hover:text-white">Dashboard</a>
      </nav>
      <button className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
        <Wallet size={18}/> Connect Wallet
      </button>
    </header>
  );
}
