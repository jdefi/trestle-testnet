import { useAccount, useDisconnect } from "wagmi";

export default function WalletStatus() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center gap-2">
      <w3m-button />
      {isConnected && (
        <button
          onClick={() => disconnect()}
          className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      )}
    </div>
  );
}
