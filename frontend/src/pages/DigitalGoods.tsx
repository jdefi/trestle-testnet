import { useState } from "react";
import { useReadContract } from "wagmi";
import { useContracts } from "../hooks/useContracts";

export default function DigitalGoods() {
  const { isConnected, isCorrectChain, dgReady, dgAddr, dgABI, buyDigitalGood } = useContracts();
  const [busy, setBusy] = useState(false);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const { data: listingCount } = useReadContract({
    abi: dgABI,
    address: dgAddr,
    functionName: "listingCounter",
    query: { enabled: dgReady },
  });

  const count = Number(listingCount ?? 0);

  const handleBuy = async (id: number, price: string) => {
    setBusy(true);
    setBuyingId(id);
    try {
      const hash = await buyDigitalGood(id, price);
      alert(`Purchased! Tx: ${hash.slice(0, 10)}...`);
    } catch (e: any) {
      alert(e?.message ?? "Transaction failed");
    }
    setBusy(false);
    setBuyingId(null);
  };

  if (!isConnected) {
    return (
      <section className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-gray-500">Connect wallet to browse digital goods</p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-12">
      <section className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Goods</h2>
          <p className="text-lg text-gray-500">Browse and buy digital listings with secure escrow.</p>
        </div>
      </section>

      {!dgReady && (
        <section className="max-w-2xl mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <p className="text-sm text-yellow-700">Digital Goods contract not deployed on this network.</p>
          </div>
        </section>
      )}

      {!isCorrectChain && (
        <section className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-sm text-red-700">Switch to Polygon Amoy to interact with digital goods.</p>
          </div>
        </section>
      )}

      {dgReady && isCorrectChain && (
        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-center text-xs text-gray-500 mb-4">
              {count} listing{count !== 1 ? "s" : ""}
            </p>

            {count === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">No listings yet.</p>
            )}

            <div className="space-y-4">
              {Array.from({ length: count }).map((_, i) => (
                <ListingCard
                  key={i}
                  id={i + 1}
                  addr={dgAddr}
                  abi={dgABI}
                  onBuy={handleBuy}
                  busy={busy}
                  buyingId={buyingId}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ListingCard({ id, addr, abi, onBuy, busy, buyingId }: {
  id: number;
  addr: `0x${string}`;
  abi: readonly any[];
  onBuy: (id: number, price: string) => void;
  busy: boolean;
  buyingId: number | null;
}) {
  const { data: listing } = useReadContract({
    abi,
    address: addr,
    functionName: "listings",
    args: [BigInt(id)],
    query: { enabled: true },
  });

  if (!listing) return null;
  const data = listing as [bigint, string, bigint, string, boolean];
  const [, seller, price, token, active] = data;
  if (!active) return null;

  const isNative = token === "0x0000000000000000000000000000000000000000";
  const priceDisplay = isNative
    ? `${Number(price) / 1e18} MATIC`
    : `${Number(price) / 1e18} tokens`;

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center hover:border-emerald-200 transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-700">Listing #{id}</p>
        <p className="text-xs text-gray-400">Seller: {seller.slice(0, 6)}...{seller.slice(-4)}</p>
        <p className="text-xs text-gray-500">{priceDisplay}</p>
      </div>
      <button
        onClick={() => onBuy(id, (Number(price) / 1e18).toString())}
        disabled={busy}
        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-emerald-600 transition-colors"
      >
        {busy && buyingId === id ? "Buying..." : "Buy"}
      </button>
    </div>
  );
}
