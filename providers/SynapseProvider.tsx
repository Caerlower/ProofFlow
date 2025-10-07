"use client"

import { Synapse, WarmStorageService } from '@filoz/synapse-sdk'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { ethers } from 'ethers'

export const SynapseContext = createContext<{
  synapse: Synapse | null
  warmStorageService: WarmStorageService | null
}>({ synapse: null, warmStorageService: null })

export function SynapseProvider({ children }: { children: React.ReactNode }) {
  const { data: walletClient } = useWalletClient()
  const [synapse, setSynapse] = useState<Synapse | null>(null)
  const [warmStorageService, setWarmStorageService] = useState<WarmStorageService | null>(null)

  useEffect(() => {
    const init = async () => {
      if (!walletClient) return
      const provider = new ethers.BrowserProvider(walletClient)
      const signer = await provider.getSigner()

      const instance = await Synapse.create({ signer, withCDN: true, disableNonceManager: false })
      const warm = await WarmStorageService.create(instance.getProvider(), instance.getWarmStorageAddress())
      setSynapse(instance)
      setWarmStorageService(warm)
    }
    init()
  }, [walletClient])

  return (
    <SynapseContext.Provider value={{ synapse, warmStorageService }}>
      {children}
    </SynapseContext.Provider>
  )
}

export function useSynapseContext() {
  return useContext(SynapseContext)
}


