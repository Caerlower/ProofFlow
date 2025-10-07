"use client"

import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useSynapse } from '@/hooks/useSynapse'
import { PDPServer } from '@filoz/synapse-sdk'
import { WarmStorageService } from '@filoz/synapse-sdk/warm-storage'

export type DatasetPiece = {
  pieceId: string
  pieceCid: string
}

export type DatasetItem = {
  pdpVerifierDataSetId: number
  isLive: boolean
  withCDN: boolean
  nextPieceId?: string
  serviceURL?: string
  pieces?: DatasetPiece[]
}

export function useDatasetsPF() {
  const { address } = useAccount()
  const { synapse } = useSynapse()

  return useQuery({
    enabled: !!address && !!synapse,
    queryKey: ['datasets', address],
    queryFn: async () => {
      if (!synapse || !address) throw new Error('Missing deps')

      const warmStorage = await WarmStorageService.create(synapse.getProvider(), synapse.getWarmStorageAddress())
      const datasets = await warmStorage.getClientDataSetsWithDetails(address).catch(() => [])

      // Resolve PDP URL per dataset's providerId directly (do not depend on approved providers list)
      const providerInfos = await Promise.all(datasets.map(async (ds: any) => {
        try { return await synapse.getProviderInfo(ds.providerId) } catch { return null }
      }))
      const idToUrl: Record<number, string> = {}
      providerInfos.forEach((p: any) => { if (p) idToUrl[p.id] = p.products.PDP?.data.serviceURL || '' })

      const details = await Promise.all(datasets.map(async (ds: any) => {
        const serviceURL = idToUrl[ds.providerId]
        try {
          const pdp = new PDPServer(null, serviceURL || '')
          const data = await pdp.getDataSet(ds.pdpVerifierDataSetId)
          return {
            pdpVerifierDataSetId: ds.pdpVerifierDataSetId,
            isLive: ds.isLive,
            withCDN: ds.withCDN,
            nextPieceId: ds.nextPieceId,
            serviceURL,
            pieces: data?.pieces?.map((p: any) => ({ pieceId: String(p.pieceId), pieceCid: p.pieceCid.toString() }))
          } as DatasetItem
        } catch {
          return {
            pdpVerifierDataSetId: ds.pdpVerifierDataSetId,
            isLive: ds.isLive,
            withCDN: ds.withCDN,
            nextPieceId: ds.nextPieceId,
            serviceURL,
          } as DatasetItem
        }
      }))

      // Merge with basic storage datasets to include historical sets
      try {
        const basicSets = await synapse.storage.findDataSets(address)
        const basicMapped: DatasetItem[] = (basicSets || []).map((s: any, idx: number) => ({
          pdpVerifierDataSetId: Number(s.pdpVerifierDataSetId || idx),
          isLive: Boolean(s.isLive ?? true),
          withCDN: Boolean(s.withCDN ?? true),
          serviceURL: '',
        }))
        // Merge by dataset id
        const mergedMap = new Map<number, DatasetItem>()
        for (const d of [...details, ...basicMapped]) {
          mergedMap.set(d.pdpVerifierDataSetId, { ...(mergedMap.get(d.pdpVerifierDataSetId) || {} as any), ...d })
        }
        const merged = Array.from(mergedMap.values())
        // Sort by id desc (approximate recency)
        merged.sort((a, b) => b.pdpVerifierDataSetId - a.pdpVerifierDataSetId)
        return merged
      } catch {
        // If findDataSets fails, return details we already have
        return details
      }
    }
  })
}


