import { useState } from "react";
import { useReadContract } from "wagmi";
import { useContracts } from "../hooks/useContracts";
import { BROILER_INFO } from "../config/contracts";

export default function Marketplace() {
  const { isConnected, isCorrectChain, marketplaceReady, marketplaceAddr, marketplaceABI, buyListing } = useContracts();
  const [busy, setBusy] = useState(false);

  const { data: listingCount } = useReadContract({
    abi: marketplaceABI,
    address: marketplaceAddr,
    functionName: "listingCount",
    query: { enabled: marketplaceReady },
  });

  const count = Number(listingCount ?? 0);

  const handleBuy = async (id: number, price: string) => {
    setBusy(true);
    try {
      const hash = await buyListing(id, price);
      alert(`Purchased! Tx: ${hash.slice(0, 10)}...`);
    } catch (e: any) {
      alert(e?.message ?? "Transaction failed");
    }
    setBusy(false);
  };

  if (!isConnected) {
    return (
      <section className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-gray-500">Connect wallet to browse marketplace</p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-12">
      <section className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Marketplace
          </h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p className="text-sm text-amber-700">
              ⚠ BRT has a {BROILER_INFO.taxPercent}% tax per transfer. Set slippage to{" "}
              <span className="font-medium">{BROILER_INFO.recommendedSlippage}</span> when trading.
            </p>
          </div>
        </div>
      </section>

      {!marketplaceReady && (
        <section className="pt-16 pb-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <p className="text-sm text-yellow-700">
                Marketplace contracts not yet deployed to this network.
              </p>
            </div>
          </div>
        </section>
      )}

      {marketplaceReady && (
        <section className="pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all p-8">
              <p className="text-center text-xs text-gray-500 mb-4">
                {count} listing{count !== 1 ? "s" : ""} on-chain
              </p>
              
              {count === 0 && (
                <p className="text-center text-gray-400 py-6 text-sm">
                  No listings yet — be the first!
                </p>
              )}
              
              {Array.from({ length: count }).map((_, i) => (
                <ListingCard 
                  key={i} 
                  id={i} 
                  addr={marketplaceAddr} 
                  abi={marketplaceABI} 
                  onBuy={handleBuy} 
                  busy={busy} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {!isCorrectChain && (
        <section className="pt-16 pb-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-sm text-red-700">
                Switch to Polygon Amoy to interact with testnet marketplace.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ListingCard({ id, addr, abi, onBuy, busy }: {
  id: number;
  addr: `0x${string}`;
  abi: readonly any[];
  onBuy: (id: number, price: string) => void;
  busy: boolean;
}) {
  const { data: listing } = useReadContract({
    abi,
    address: addr,
    functionName: "getListing",
    args: [BigInt(id)],
    query: { enabled: true },
  });

  if (!listing) return null;
  const [seller, price, active] = listing as [string, bigint, boolean];
  if (!active) return null;

  return (
    <div className="border-t pt-4 pb-2 flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-700">Listing #{id}</p>
        <p className="text-xs text-gray-400">
          Seller: {seller.slice(0, 6)}...{seller.slice(-4)}
        </p>
        <p className="text-xs text-gray-500">
          {Number(price) / 1e18} MATIC
        </p>
      </div>
      <button 
        onClick={() => onBuy(id, (Number(price) / 1e18).toString())} 
        disabled={busy}
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium 
                   disabled:opacity-50 hover:bg-emerald-600 transition-colors"
      >
        {busy ? "Buying..." : "Buy"}
      </button>
    </div>
  );
}
