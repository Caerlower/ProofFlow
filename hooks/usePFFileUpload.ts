"use client"

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { preflightCheck } from '@/lib/warmStorage'
import { WarmStorageService } from '@filoz/synapse-sdk/warm-storage'
import { useSynapse } from '@/hooks/useSynapse'

export type UploadedInfo = {
  fileName?: string
  fileSize?: number
  pieceCid?: string
  txHash?: string
}

export function usePFFileUpload() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [uploadedInfo, setUploadedInfo] = useState<UploadedInfo | null>(null)
  const { synapse } = useSynapse()
  const { address } = useAccount()

  const mutation = useMutation({
    mutationKey: ['file-upload', address],
    mutationFn: async (file: File) => {
      if (!synapse) throw new Error('Synapse not found')
      if (!address) throw new Error('Address not found')

      setProgress(0)
      setUploadedInfo(null)
      setStatus('🔄 Initializing file upload to Filecoin...')

      const arrayBuffer = await file.arrayBuffer()
      const uint8ArrayBytes = new Uint8Array(arrayBuffer)

      const datasets = await synapse.storage.findDataSets(address)
      const includeDatasetCreationFee = (datasets?.length || 0) === 0

      setStatus('💰 Checking USDFC balance and storage allowances...')
      setProgress(5)
      await preflightCheck(
        file,
        synapse,
        includeDatasetCreationFee,
        (s) => setStatus(s),
        (p) => setProgress(p)
      )

      setStatus('🔗 Setting up storage service and dataset...')
      setProgress(25)

      const storageService = await synapse.createStorage({
        callbacks: {
          onDataSetResolved: () => {
            setStatus('🔗 Existing dataset found and resolved')
            setProgress(30)
          },
          onDataSetCreationStarted: () => {
            setStatus('🏗️ Creating new dataset on blockchain...')
            setProgress(35)
          },
          onDataSetCreationProgress: (s) => {
            if (s.transactionSuccess) {
              setStatus('⛓️ Dataset transaction confirmed on chain')
              setProgress(45)
            }
            if (s.serverConfirmed) {
              setStatus(`🎉 Dataset ready! (${Math.round(s.elapsedMs / 1000)}s)`) 
              setProgress(50)
            }
          },
          onProviderSelected: () => {
            setStatus('🏪 Storage provider selected')
          },
        },
      })

      setStatus('📁 Uploading file to storage provider...')
      setProgress(55)
      let targetCidFromUpload: string | null = null
      const { pieceCid } = await storageService.upload(uint8ArrayBytes, {
        onUploadComplete: (piece) => {
          setStatus('📊 File uploaded! Signing msg to add pieces to the dataset')
          setUploadedInfo((prev) => ({
            ...prev,
            fileName: file.name,
            fileSize: file.size,
            pieceCid: piece.toV1().toString(),
          }))
          try {
            const key = `pf-piece:${piece.toV1().toString()}`
            localStorage.setItem(key, JSON.stringify({ fileName: file.name, fileSize: file.size }))
          } catch {}
          targetCidFromUpload = piece.toV1().toString()
          setProgress(80)
        },
        onPieceAdded: async (tx) => {
          setStatus(`🔄 Waiting for on-chain confirmation${tx ? ` (tx: ${tx.hash})` : ' (relayed)'}`)
          if (tx) {
            setUploadedInfo((prev) => ({ ...prev, txHash: tx.hash }))
          }
          // Watchdog: poll dataset pieces until the new piece appears, or timeout
          try {
            const warm = await WarmStorageService.create(synapse.getProvider(), synapse.getWarmStorageAddress())
            const deadline = Date.now() + 90_000
            const targetCid = targetCidFromUpload || (pieceCid?.toV1 ? pieceCid.toV1().toString() : null)
            // bump progress a bit so it doesn't look stuck
            setProgress(85)
            while (targetCid && Date.now() < deadline) {
              try {
                const sets = await warm.getClientDataSetsWithDetails(address!)
                const found = sets.some((ds: any) => ds.data?.pieces?.some((p: any) => p.pieceCid.toString() === targetCid))
                if (found) {
                  setStatus('🌳 Data pieces added to dataset')
                  setProgress(95)
                  break
                }
              } catch {}
              await new Promise(r => setTimeout(r, 4000))
            }
          } catch {}
        },
        onPieceConfirmed: () => {
          setStatus('🌳 Data pieces added to dataset successfully')
          setProgress(90)
        },
      })

      setProgress(100)
      setUploadedInfo((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        pieceCid: pieceCid.toV1().toString(),
      }))
    },
  })

  const handleReset = () => {
    setProgress(0)
    setUploadedInfo(null)
    setStatus('')
  }

  return {
    uploadFileMutation: mutation,
    progress,
    uploadedInfo,
    handleReset,
    status,
  }
}


