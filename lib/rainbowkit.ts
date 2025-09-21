import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Filecoin network configurations
const filecoinMainnet = {
  id: 314,
  name: 'Filecoin Mainnet',
  network: 'filecoin-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'FIL',
  },
  rpcUrls: {
    default: {
      http: ['https://api.node.glif.io/rpc/v1'],
    },
    public: {
      http: ['https://api.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: { name: 'Filscan', url: 'https://filscan.io' },
  },
} as const

const filecoinCalibration = {
  id: 314159,
  name: 'Filecoin Calibration',
  network: 'filecoin-calibration',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: {
      http: ['https://api.calibration.node.glif.io/rpc/v1'],
    },
    public: {
      http: ['https://api.calibration.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: { name: 'Filscan Calibration', url: 'https://calibration.filscan.io' },
  },
  testnet: true,
} as const

export const config = getDefaultConfig({
  appName: 'ProofFlow',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [filecoinMainnet, filecoinCalibration, mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
})
