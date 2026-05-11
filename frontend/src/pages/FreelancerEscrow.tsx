import { useReadContract } from "wagmi";
import { useContracts } from "../hooks/useContracts";

export default function FreelancerEscrow() {
  const { isConnected, isCorrectChain, feReady, feAddr, feABI } = useContracts();

  const { data: serviceCount } = useReadContract({
    abi: feABI,
    address: feAddr,
    functionName: "serviceCounter",
    query: { enabled: feReady },
  });

  const count = Number(serviceCount ?? 0);

  if (!isConnected) {
    return (
      <section className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-gray-500">Connect wallet to browse freelance services</p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-12">
      <section className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Freelancer Escrow</h2>
          <p className="text-lg text-gray-500">Hire freelancers with milestone-based escrow payments.</p>
        </div>
      </section>

      {!feReady && (
        <section className="max-w-2xl mx-auto px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <p className="text-sm text-yellow-700">Freelancer Escrow contract not deployed on this network.</p>
          </div>
        </section>
      )}

      {!isCorrectChain && (
        <section className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-sm text-red-700">Switch to Polygon Amoy to interact with freelance services.</p>
          </div>
        </section>
      )}

      {feReady && isCorrectChain && (
        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-center text-xs text-gray-500 mb-4">
              {count} service{count !== 1 ? "s" : ""}
            </p>

            {count === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">No services posted yet.</p>
            )}

            <div className="space-y-4">
              {Array.from({ length: count }).map((_, i) => (
                <ServiceCard key={i} id={i + 1} addr={feAddr} abi={feABI} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ServiceCard({ id, addr, abi }: { id: number; addr: `0x${string}`; abi: readonly any[] }) {
  const { data: service } = useReadContract({
    abi,
    address: addr,
    functionName: "services",
    args: [BigInt(id)],
    query: { enabled: true },
  });

  if (!service) return null;
  const data = service as [bigint, string, bigint, string, string, number, boolean, number];
  const [, freelancer, totalPrice, token, metaURI, milestoneCount, active] = data;

  if (!active) return null;

  const metaStr = metaURI.startsWith("0x")
    ? Buffer ? atob(metaURI.slice(2)) : metaURI.slice(0, 10) + "..."
    : metaURI;

  return (
    <div className="border rounded-xl p-4 hover:border-emerald-200 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-700">Service #{id}</p>
          <p className="text-xs text-gray-400">Freelancer: {freelancer.slice(0, 6)}...{freelancer.slice(-4)}</p>
          <p className="text-xs text-gray-500">{Number(totalPrice) / 1e18} MATIC</p>
          <p className="text-xs text-gray-400 mt-1">{milestoneCount} milestone{milestoneCount !== 1 ? "s" : ""}</p>
        </div>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Active</span>
      </div>
    </div>
  );
}
