"use client"

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useSynapse, useFileDownload } from '@/hooks/useSynapse'
import { usePFFileUpload } from '@/hooks/usePFFileUpload'
import { useUSDFCPayments, useStorageCosts } from '@/hooks/useUSDFCPayments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, Trash2, Eye, MoreHorizontal, FileText, Image, Video, Music, Archive } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDatasetsPF } from '@/hooks/useDatasetsPF'
import { DatasetsViewerPF } from '@/components/proofflow/DatasetsViewerPF'
import { useBalancesPF } from '@/hooks/useBalancesPF'

export default function StoragePage() {
  const { isConnected } = useAccount()
  const { synapse, isLoading: synapseLoading, error: synapseError, chain } = useSynapse()
  const { uploadFileMutation, progress, uploadedInfo, handleReset, status } = usePFFileUpload()
  const { isPending: isUploading, mutateAsync: uploadFile } = uploadFileMutation
  const { downloadFile, isDownloading, error: downloadError } = useFileDownload()
  const { depositUSDFC, approveService, payForStorage, isProcessing: paymentProcessing } = useUSDFCPayments()
  const { costs, isLoading: costsLoading } = useStorageCosts()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data: datasets, isLoading: datasetsLoading, refetch: refetchDatasets } = useDatasetsPF()
  const { data: balances } = useBalancesPF()

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />
      case 'archive':
        return <Archive className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case 'verifying':
        return <Badge className="bg-yellow-100 text-yellow-800">Verifying</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadFile(selectedFile)
      console.log('File uploaded successfully')
      // Reset file selection
      setSelectedFile(null)
      // You could add the uploaded file to the files list here
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleDownload = async (pieceCID: string) => {
    try {
      const result = await downloadFile(pieceCID)
      console.log('File downloaded successfully:', result)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handlePayForStorage = async () => {
    try {
      const result = await payForStorage('10') // Pay for 10GB storage
      console.log('Storage payment successful:', result)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <Upload className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Connect your wallet to manage your files and storage.
        </p>
        <Button className="bg-[#0090FF] hover:bg-[#0078CC] text-white">
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Storage Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Upload, manage, and monitor your decentralized storage files.
        </p>
        {/* Tabs */}
        <div className="mt-4 grid grid-cols-3 text-center text-white/90">
          <div className="py-3">Manage Storage</div>
          <div className="py-3">Upload File</div>
          <div className="py-3 border-b border-white">View Datasets</div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              FIL Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{balances ? `${balances.filFormatted} FIL` : '...'}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Wallet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              USDFC Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{balances ? `${balances.usdfcWalletFormatted} USDFC` : '...'}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">In wallet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              USDFC (Synapse)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{balances ? `${balances.usdfcWarmFormatted} USDFC` : '...'}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Deposited for storage</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload files to decentralized storage with pay-as-you-go pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Files are stored on Filecoin with PDP verification via Synapse SDK
            </p>
            
            {/* File Selection */}
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="*/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Choose File
              </label>
              {selectedFile && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Upload Button */}
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || !synapse}
              className="bg-[#0090FF] hover:bg-[#0078CC] text-white"
            >
              {isUploading ? 'Uploading...' : 'Upload to Filecoin'}
            </Button>

            {/* Upload Status + Progress */}
            {status && (
              <div className="mt-4">
                <p className={`text-sm ${status.includes('❌') ? 'text-red-600 dark:text-red-400' : status.includes('🎉') || status.includes('✅') ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>{status}</p>
                {isUploading && (
                  <div className="mt-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progress}%</p>
                  </div>
                )}
              </div>
            )}

            {/* Error Messages */}
            {synapseError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Synapse Error: {synapseError}
              </p>
            )}
            {/* Uploaded file info */}
            {uploadedInfo && !isUploading && (
              <div className="mt-6 bg-black text-white border border-gray-700 rounded-xl p-4 text-left">
                <h4 className="font-semibold mb-2">File Upload Details</h4>
                <div className="text-sm">
                  <div>
                    <span className="font-medium">File name:</span> {uploadedInfo.fileName}
                  </div>
                  <div>
                    <span className="font-medium">File size:</span> {uploadedInfo.fileSize?.toLocaleString()} bytes
                  </div>
                  <div className="break-all">
                    <span className="font-medium">Piece CID:</span> {uploadedInfo.pieceCid}
                  </div>
                  <div className="break-all">
                    <span className="font-medium">Tx Hash:</span> {uploadedInfo.txHash}
                  </div>
                </div>
              </div>
            )}

            {/* Storage Payment */}
            {costs && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Storage Costs
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Storage: {costs.storageCostPerGB} USDFC per GB
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Retrieval: {costs.retrievalCostPerGB} USDFC per GB
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    onClick={async () => { try { await depositUSDFC('5') } catch(e){} }}
                    disabled={paymentProcessing}
                    variant="outline"
                  >
                    {paymentProcessing ? 'Processing...' : 'Deposit 5 USDFC'}
                  </Button>
                  <Button 
                    onClick={async () => { try { await approveService('10') } catch(e){} }}
                    disabled={paymentProcessing}
                    variant="outline"
                  >
                    {paymentProcessing ? 'Processing...' : 'Approve for 10GB'}
                  </Button>
                  <Button 
                    onClick={handlePayForStorage}
                    disabled={paymentProcessing}
                    variant="outline"
                  >
                    {paymentProcessing ? 'Processing...' : 'Pay for 10GB Storage'}
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const accountInfo = await synapse?.payments.accountInfo()
                        console.log('[ProofFlow] payments.accountInfo', accountInfo)
                        // quick allowance check for current file size scenario: 1 GiB sample
                        const warmService = await synapse?.createStorage()
                        console.log('[ProofFlow] warm storage address', synapse?.getWarmStorageAddress())
                      } catch (e) {
                        console.error('Allowance check failed', e)
                      }
                    }}
                    variant="outline"
                  >
                    Check allowances
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files List - live datasets */}
      <DatasetsViewerPF />
    </div>
  )
}
