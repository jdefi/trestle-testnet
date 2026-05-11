import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useContracts } from "../hooks/useContracts";
import WalletStatus from "./WalletStatus";
import Footer from "./Footer";
import { EXTERNAL_LINKS } from "../config/links";

const mainLinks = [
  { to: "/", label: "Dashboard" },
];

const marketSub = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/digital-goods", label: "Digital Goods" },
  { to: "/freelancers", label: "Freelancers" },
  { to: "/rwa", label: "RWA" },
];

const externalLinks = [
  { href: EXTERNAL_LINKS.home, label: "Home" },
  { href: EXTERNAL_LINKS.reward, label: "Rewards" },
  { href: EXTERNAL_LINKS.miniApp, label: "Mini App" },
  { href: EXTERNAL_LINKS.docs, label: "Docs" },
];

export default function Layout() {
  const { isCorrectChain, chainName } = useContracts();
  const [marketOpen, setMarketOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const marketRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (marketRef.current && !marketRef.current.contains(e.target as Node)) {
        setMarketOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener("touchstart", handler);
      return () => document.removeEventListener("touchstart", handler);
    }
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="text-xl font-bold text-emerald-600">
              Trestle
            </NavLink>
            <div className="flex items-center gap-2">
              <WalletStatus />
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 mt-3">
            {mainLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Market dropdown */}
            <div ref={marketRef} className="relative"
              onMouseEnter={() => setMarketOpen(true)}
              onMouseLeave={() => setMarketOpen(false)}
            >
              <button onClick={() => setMarketOpen(!marketOpen)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                Market <span className="text-xs">▼</span>
              </button>
              {marketOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-40 z-50">
                  {marketSub.map(({ to, label }) => (
                    <NavLink key={to} to={to}
                      onClick={() => setMarketOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${isActive ? "text-emerald-600 font-medium" : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"}`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-200">|</span>

            {externalLinks.map(({ href, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div ref={mobileRef} className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            {mainLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium ${isActive ? "text-emerald-600" : "text-gray-500"}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="text-sm font-medium text-gray-500 pt-1">Market</div>
            <div className="pl-4 space-y-1">
              {marketSub.map(({ to, label }) => (
                <NavLink key={to} to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm ${isActive ? "text-emerald-600 font-medium" : "text-gray-500"}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <hr className="border-gray-100" />
            {externalLinks.map(({ href, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="block text-sm text-gray-500"
              >
                {label}
              </a>
            ))}
          </div>
        )}

        {!isCorrectChain && (
          <div className="p-2 bg-red-100/50 backdrop-blur-sm text-red-700 text-sm text-center">
            Switch to Polygon Amoy or Polygon Mainnet
          </div>
        )}
        {isCorrectChain && (
          <div className="pb-1 text-xs text-gray-400 text-center">{chainName}</div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
