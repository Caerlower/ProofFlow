"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { Synapse } from '@filoz/synapse-sdk'
import { createSynapseInstance, DEFAULT_SYNAPSE_CONFIG } from '@/lib/synapse'
import { useSynapseContext } from '@/providers/SynapseProvider'
import { preflightCheck } from '@/lib/warmStorage'
import { ethers } from 'ethers'

// Hook for Synapse SDK instance
export function useSynapse() {
  const { address, isConnected, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [synapse, setSynapse] = useState<Synapse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { synapse: ctxSynapse } = useSynapseContext()

  useEffect(() => {
    if (ctxSynapse) {
      setSynapse(ctxSynapse)
      return
    }
    if (isConnected && address && walletClient) {
      setIsLoading(true)
      setError(null)
      
      const initializeSynapse = async () => {
        try {
          // Convert wallet client to ethers signer
          const provider = new ethers.BrowserProvider(walletClient)
          const signer = await provider.getSigner()
          
          // Determine network; default to calibration for development/testing
          const network = chain?.id === 314 ? 'mainnet' : 'calibration'
          
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
  const { synapse, isConnected, address } = useSynapse()
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
  const { synapse, isConnected, address } = useSynapse()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  const uploadFile = useCallback(async (file: File) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setStatus('')

    try {
      // Preflight diagnostics to help debug on calibration
      try {
        const warmStorageAddress = synapse.getWarmStorageAddress?.()
        // payments may be unavailable on calibration; wrap in try
        let accountInfo: any = null
        try {
          accountInfo = await synapse.payments?.accountInfo?.()
        } catch {}
        console.log('[ProofFlow] Upload preflight', {
          network: (synapse as any)?.network || 'unknown',
          warmStorageAddress,
          accountInfo,
          file: { name: file.name, size: file.size, type: file.type },
        })
      } catch {}
      // Convert file to Uint8Array for upload
      const arrayBuffer = await file.arrayBuffer()
      const uint8ArrayBytes = new Uint8Array(arrayBuffer)

      // Determine if dataset exists to include creation fee
      setStatus('🔄 Checking existing datasets...')
      const datasets = await synapse.storage.findDataSets(address || '')
      const includeDatasetCreationFee = (datasets?.length || 0) === 0

      // Preflight: ensure allowances/balances per working dapp
      setStatus('💰 Preflight: checking allowances and balances...')
      setUploadProgress(5)
      await preflightCheck(
        file,
        synapse,
        includeDatasetCreationFee,
        (s) => setStatus(s),
        (p) => setUploadProgress(p)
      )

      setStatus('🔗 Creating storage service...')
      setUploadProgress(25)
      const storageService = await synapse.createStorage({
        callbacks: {
          onDataSetResolved: () => {
            setStatus('🔗 Existing dataset found')
            setUploadProgress(30)
          },
          onDataSetCreationStarted: () => {
            setStatus('🏗️ Creating dataset...')
            setUploadProgress(35)
          },
          onDataSetCreationProgress: (st) => {
            if (st.transactionSuccess) {
              setStatus('⛓️ Dataset tx confirmed')
              setUploadProgress(45)
            }
            if (st.serverConfirmed) {
              setStatus('🎉 Dataset ready!')
              setUploadProgress(50)
            }
          },
          onProviderSelected: () => {
            setStatus('🏪 Provider selected')
          },
        }
      })

      setStatus('📁 Uploading file to provider...')
      setUploadProgress(55)
      const uploadResult = await storageService.upload(uint8ArrayBytes, {
        onUploadComplete: () => {
          setStatus('📊 File uploaded! Adding piece to dataset...')
          setUploadProgress(80)
        },
        onPieceAdded: () => {
          setStatus('🔄 Waiting for on-chain confirmation...')
        },
        onPieceConfirmed: () => {
          setStatus('🌳 Data pieces added to dataset')
          setUploadProgress(90)
        }
      })

      setUploadProgress(100)
      setStatus('🎉 File successfully stored on Filecoin!')
      return uploadResult
    } catch (err: any) {
      console.error('File upload failed:', err)
      const message = typeof err?.message === 'string' ? err.message : 'File upload failed'
      setError(message)
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
    status,
  }
}

// Hook for file download
export function useFileDownload() {
  const { synapse, isConnected } = useSynapse()
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadingCid, setDownloadingCid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const downloadFile = useCallback(async (pieceCID: string) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsDownloading(true)
    setDownloadingCid(pieceCID)
    setError(null)

    try {
      // Download bytes
      const bytes = await synapse.storage.download(pieceCID)

      // Detect mime and extension from magic numbers
      const u8 = bytes as unknown as Uint8Array
      const isPng = u8.length > 8 && u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4E && u8[3] === 0x47
      const isJpg = u8.length > 3 && u8[0] === 0xFF && u8[1] === 0xD8 && u8[2] === 0xFF
      const isGif = u8.length > 6 && u8[0] === 0x47 && u8[1] === 0x49 && u8[2] === 0x46 && u8[3] === 0x38 && (u8[4] === 0x39 || u8[4] === 0x37) && u8[5] === 0x61
      const isPdf = u8.length > 4 && u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46
      let mime = 'application/octet-stream'
      let ext = 'bin'
      if (isPng) { mime = 'image/png'; ext = 'png' }
      else if (isJpg) { mime = 'image/jpeg'; ext = 'jpg' }
      else if (isGif) { mime = 'image/gif'; ext = 'gif' }
      else if (isPdf) { mime = 'application/pdf'; ext = 'pdf' }

      const blob = new Blob([u8], { type: mime })
      const url = URL.createObjectURL(blob)
      const filename = `${pieceCID}.${ext}`
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      return filename
    } catch (err) {
      console.error('File download failed:', err)
      setError('File download failed')
      throw err
    } finally {
      setIsDownloading(false)
      setDownloadingCid(null)
    }
  }, [synapse, isConnected])

  return {
    downloadFile,
    isDownloading,
    downloadingCid,
    error,
  }
}
