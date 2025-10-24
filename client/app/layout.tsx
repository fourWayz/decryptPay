"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, http } from 'wagmi'
import { filecoin, filecoinCalibration } from 'viem/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { SynapseProvider } from "@/providers/SynapseProvider";
import 'sweetalert2/dist/sweetalert2.min.css';

const queryClient = new QueryClient()
const wagmiConfig = createConfig({
    chains: [filecoin, filecoinCalibration] as const,
    transports: {
        [filecoin.id]: http(),
        [filecoinCalibration.id]: http(),
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