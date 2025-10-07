"use client"

import React from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { config } from '@/lib/rainbowkit'
import { SynapseProvider } from '@/providers/SynapseProvider'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function RainbowKitThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  
  return (
    <RainbowKitProvider
      theme={theme === 'dark' ? darkTheme() : lightTheme()}
      appInfo={{
        appName: 'ProofFlow',
        learnMoreUrl: 'https://proof-flow.vercel.app',
      }}
    >
      {children}
    </RainbowKitProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitThemeProvider>
          <SynapseProvider>
            {children}
          </SynapseProvider>
        </RainbowKitThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
