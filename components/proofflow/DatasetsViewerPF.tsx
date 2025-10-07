"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDatasetsPF } from '@/hooks/useDatasetsPF'
import { useFileDownload } from '@/hooks/useSynapse'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FileText, Image as ImageIcon, Video, Archive, MoreHorizontal } from 'lucide-react'

export function DatasetsViewerPF() {
  const { data: datasets, isLoading } = useDatasetsPF()
  const { downloadFile, isDownloading, downloadingCid } = useFileDownload()

  const getIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp')) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.avi') || lower.endsWith('.mkv')) return <Video className="h-5 w-5 text-purple-500" />
    if (lower.endsWith('.zip') || lower.endsWith('.tar') || lower.endsWith('.gz') || lower.endsWith('.rar')) return <Archive className="h-5 w-5 text-orange-500" />
    return <FileText className="h-5 w-5 text-red-500" />
  }

  const formatSize = (size?: number) => {
    if (!size || !Number.isFinite(size)) return ''
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`
    return `${(size / 1024 / 1024).toFixed(1)} MB`
  }

  const formatRelative = (ts?: number) => {
    if (!ts) return ''
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
    const days = Math.floor(hrs / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest storage operations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-gray-500">Loading datasets...</p>}
        {!isLoading && (!datasets || datasets.length === 0) && (
          <p className="text-sm text-gray-500">No datasets found for this wallet.</p>
        )}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {datasets?.flatMap((dataset) => (dataset.pieces || []).map((piece, idx) => {
            let displayName = piece.pieceCid
            let fileSize: number | undefined
            let uploadedAt: number | undefined
            try {
              const meta = localStorage.getItem(`pf-piece:${piece.pieceCid}`)
              if (meta) {
                const parsed = JSON.parse(meta)
                if (parsed?.fileName) displayName = parsed.fileName
                if (parsed?.fileSize) fileSize = parsed.fileSize
                if (parsed?.uploadedAt) uploadedAt = parsed.uploadedAt
              }
            } catch {}
            const rightBadge = dataset.isLive ? (
              <span className="rounded-full bg-green-100 text-green-800 text-xs px-2 py-1">Verified</span>
            ) : (
              <span className="rounded-full bg-yellow-100 text-yellow-800 text-xs px-2 py-1">Verifying</span>
            )
            return (
              <div key={`${dataset.pdpVerifierDataSetId}-${idx}`} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3 min-w-0">
                  {getIcon(displayName)}
                  <div className="min-w-0">
                    <p className="text-base font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatSize(fileSize)}{fileSize ? ' • ' : ''}
                      {uploadedAt ? `Uploaded ${formatRelative(uploadedAt)}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {rightBadge}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(dataset.serviceURL || '#', '_blank')}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadFile(piece.pieceCid)} disabled={downloadingCid === piece.pieceCid}>
                        {downloadingCid === piece.pieceCid ? 'Downloading...' : 'Download'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => console.warn('Delete not implemented')}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          }))}
        </div>
      </CardContent>
    </Card>
  )
}


