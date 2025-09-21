"use client"

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function StoragePage() {
  const { isConnected } = useAccount()
  const [uploading, setUploading] = useState(false)

  const files = [
    {
      id: 1,
      name: 'document.pdf',
      size: '1.2 MB',
      type: 'pdf',
      uploadedAt: '2024-01-15',
      status: 'verified',
      cost: '$0.15'
    },
    {
      id: 2,
      name: 'image.jpg',
      size: '850 KB',
      type: 'image',
      uploadedAt: '2024-01-14',
      status: 'verified',
      cost: '$0.08'
    },
    {
      id: 3,
      name: 'video.mp4',
      size: '45.2 MB',
      type: 'video',
      uploadedAt: '2024-01-13',
      status: 'verifying',
      cost: '$2.10'
    },
    {
      id: 4,
      name: 'archive.zip',
      size: '12.8 MB',
      type: 'archive',
      uploadedAt: '2024-01-12',
      status: 'verified',
      cost: '$0.85'
    }
  ]

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

  const handleUpload = () => {
    setUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setUploading(false)
    }, 3000)
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
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              2.4 GB
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Across {files.length} files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $3.18
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Pay-as-you-go billing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              100%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              All files verified
            </p>
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
              Files are stored on Filecoin with PDP verification
            </p>
            <Button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-[#0090FF] hover:bg-[#0078CC] text-white"
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            {uploading && (
              <div className="mt-4">
                <Progress value={66} className="w-full" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Uploading to Filecoin...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
          <CardDescription>
            Manage your stored files and monitor their verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  {getFileIcon(file.type)}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {file.size} • Uploaded {file.uploadedAt}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.cost}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Storage cost
                    </p>
                  </div>
                  
                  {getStatusBadge(file.status)}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
