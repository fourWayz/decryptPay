"use client"
import "./globals.css";
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'sweetalert2/dist/sweetalert2.min.css';

const ogChainConfig = {
  id: 16602,
  name: "OG Galileo Testnet",
  network: "ogchain",
  nativeCurrency: {
    symbol: "OG",
    name: "OG Token",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://evmrpc-testnet.0g.ai"],
    },
    public: {
      http: ["https://evmrpc-testnet.0g.ai"],
    },
  },
} as const;



const queryClient = new QueryClient()
const wagmiConfig = createConfig({
    chains: [ogChainConfig] as const,
    transports: {
        [ogChainConfig.id]: http(),
    },
    connectors: [
        injected(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        })
    ]
})
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" >
            <body className="bg-black">
                    <WagmiProvider config={wagmiConfig}>
                        <QueryClientProvider client={queryClient}>
                            <RainbowKitProvider>
                                    {children}
                            </RainbowKitProvider>
                        </QueryClientProvider>
                    </WagmiProvider>
            </body>
        </html>
    );
}