import { Synapse } from '@filoz/synapse-sdk'
import { ethers } from 'ethers'

// Filecoin network configurations for Synapse SDK
export const FILECOIN_NETWORKS = {
  mainnet: {
    chainId: 314,
    name: 'Filecoin Mainnet',
    rpcUrl: 'https://api.node.glif.io/rpc/v1',
  },
  calibration: {
    chainId: 314159,
    name: 'Filecoin Calibration',
    rpcUrl: 'https://api.calibration.node.glif.io/rpc/v1',
  }
} as const

// Synapse SDK configuration
export interface SynapseConfig {
  network: 'mainnet' | 'calibration'
  signer: ethers.Signer
  withCDN?: boolean
}

// Create Synapse instance using the proper API
export async function createSynapseInstance(config: SynapseConfig): Promise<Synapse> {
  try {
    const synapse = await Synapse.create({
      signer: config.signer,
      network: config.network,
      withCDN: config.withCDN ?? true, // Enable CDN by default
    })
    
    return synapse
  } catch (error) {
    console.error('Failed to create Synapse instance:', error)
    throw error
  }
}

// Default configuration for development
export const DEFAULT_SYNAPSE_CONFIG: Partial<SynapseConfig> = {
  network: 'calibration', // Use testnet by default
  withCDN: true,
}
