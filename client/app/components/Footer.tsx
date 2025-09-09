export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">🌙</a>
          <a href="#" className="hover:text-white">🔗</a>
          <a href="#" className="hover:text-white">in</a>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Company</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Resources</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Roadmap/FAQ</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Legal</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
