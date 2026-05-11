import { NavLink } from "react-router-dom";
import { EXTERNAL_LINKS } from "../config/links";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/" className="hover:text-emerald-400">Dashboard</NavLink></li>
            <li><NavLink to="/marketplace" className="hover:text-emerald-400">Marketplace</NavLink></li>
            <li><NavLink to="/digital-goods" className="hover:text-emerald-400">Digital Goods</NavLink></li>
            <li><NavLink to="/freelancers" className="hover:text-emerald-400">Freelancers</NavLink></li>
            <li><NavLink to="/rwa" className="hover:text-emerald-400">RWA</NavLink></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Trestle Ecosystem</h3>
          <ul className="space-y-2 text-sm">
            <li><a href={EXTERNAL_LINKS.home} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Home</a></li>
            <li><a href={EXTERNAL_LINKS.reward} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Rewards</a></li>
            <li><a href={EXTERNAL_LINKS.miniApp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Mini App</a></li>
            <li><a href={EXTERNAL_LINKS.docs} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Docs</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Community</h3>
          <ul className="space-y-2 text-sm">
            <li><a href={EXTERNAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Telegram</a></li>
            <li><a href={EXTERNAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Twitter / X</a></li>
            <li><a href={EXTERNAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">GitHub</a></li>
            <li><a href={EXTERNAL_LINKS.miniApp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Mini-App</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-400">Terms</a></li>
            <li><a href="#" className="hover:text-emerald-400">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Trestle Protocol. All rights reserved.</p>
      </div>
    </footer>
  );
}
