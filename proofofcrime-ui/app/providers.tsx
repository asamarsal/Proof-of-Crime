// app/providers.tsx
"use client";

import { createAppKit } from "@reown/appkit/react";
import { mainnet, polygon } from "@reown/appkit/networks";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set");

const config = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});

// Konfigurasi HANYA Reown cloud wallet (tanpa QR / external wallets)
createAppKit({
  projectId,
  networks: [mainnet, polygon],
  features: {
    email: true,
    socials: ["google"],
    swaps: false,
  },
  // Perubahan penting:
  enableWallets: true,        // jangan tampilkan daftar external wallets
  enableEIP6963: true,        // matikan discovery EIP-6963
  enableInjected: true,       // matikan injected providers (MetaMask)
  enableCoinbase: false,
  enableWalletConnect: false,  // pastikan WalletConnect dimatikan
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
