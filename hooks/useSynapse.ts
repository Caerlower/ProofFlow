"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { Synapse } from '@filoz/synapse-sdk'
import { createSynapseInstance, DEFAULT_SYNAPSE_CONFIG } from '@/lib/synapse'
import { ethers } from 'ethers'

// Hook for Synapse SDK instance
export function useSynapse() {
  const { address, isConnected, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [synapse, setSynapse] = useState<Synapse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && address && walletClient) {
      setIsLoading(true)
      setError(null)
      
      const initializeSynapse = async () => {
        try {
          // Convert wallet client to ethers signer
          const provider = new ethers.BrowserProvider(walletClient)
          const signer = await provider.getSigner()
          
          // Determine network based on connected chain
          const network = chain?.id === 314159 ? 'calibration' : 'mainnet'
          
          const synapseInstance = await createSynapseInstance({
            ...DEFAULT_SYNAPSE_CONFIG,
            network,
            signer,
          })
          
          setSynapse(synapseInstance)
        } catch (err) {
          console.error('Failed to create Synapse instance:', err)
          setError('Failed to initialize Synapse SDK')
        } finally {
          setIsLoading(false)
        }
      }

      initializeSynapse()
    } else {
      setSynapse(null)
    }
  }, [isConnected, address, chain, walletClient])

  return {
    synapse,
    isLoading,
    error,
    isConnected,
    address,
    chain,
  }
}

// Hook for USDFC balance
export function useUSDFCBalance() {
  const { synapse, isConnected } = useSynapse()
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!synapse || !isConnected) return

    setIsLoading(true)
    setError(null)

    try {
      // Get USDFC balance from the payments service
      const balanceResult = await synapse.payments.balance()
      setBalance(balanceResult.toString())
    } catch (err) {
      console.error('Failed to fetch USDFC balance:', err)
      setError('Failed to fetch balance')
    } finally {
      setIsLoading(false)
    }
  }, [synapse, isConnected])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  }
}

// Hook for storage usage
export function useStorageUsage() {
  const { synapse, isConnected } = useSynapse()
  const [usage, setUsage] = useState<{
    used: string
    allowance: string
    daysRemaining: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsage = useCallback(async () => {
    if (!synapse || !isConnected) return

    setIsLoading(true)
    setError(null)

    try {
      // Get account info to understand current usage
      const accountInfo = await synapse.payments.accountInfo()
      
      // Calculate usage based on account info
      const usageResult = {
        used: (Number(accountInfo.lockupCurrent) / 1e18).toFixed(2), // Convert from wei
        allowance: (Number(accountInfo.lockupRate) / 1e18).toFixed(2), // Convert from wei
        daysRemaining: 25, // This would need to be calculated from lockup data
      }
      setUsage(usageResult)
    } catch (err) {
      console.error('Failed to fetch storage usage:', err)
      setError('Failed to fetch storage usage')
    } finally {
      setIsLoading(false)
    }
  }, [synapse, isConnected])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  return {
    usage,
    isLoading,
    error,
    refetch: fetchUsage,
  }
}

// Hook for file upload
export function useFileUpload() {
  const { synapse, isConnected } = useSynapse()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Convert file to ArrayBuffer for upload
      const arrayBuffer = await file.arrayBuffer()
      
      // Create a storage service for this upload
      const storageService = await synapse.createStorage()
      
      // Upload the file
      const result = await storageService.upload(arrayBuffer)
      
      // Simulate progress since onProgress may not be available
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      return result
    } catch (err) {
      console.error('File upload failed:', err)
      setError('File upload failed')
      throw err
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [synapse, isConnected])

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
  }
}

// Hook for file download
export function useFileDownload() {
  const { synapse, isConnected } = useSynapse()
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadFile = useCallback(async (pieceCID: string) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsDownloading(true)
    setError(null)

    try {
      // Download file using PieceCID
      const result = await synapse.download(pieceCID)
      return result
    } catch (err) {
      console.error('File download failed:', err)
      setError('File download failed')
      throw err
    } finally {
      setIsDownloading(false)
    }
  }, [synapse, isConnected])

  return {
    downloadFile,
    isDownloading,
    error,
  }
}
