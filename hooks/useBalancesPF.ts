"use client"

import { useQuery } from '@tanstack/react-query'
import { TOKENS } from '@filoz/synapse-sdk'
import { useAccount } from 'wagmi'
import { useSynapse } from '@/hooks/useSynapse'

export function useBalancesPF() {
  const { synapse } = useSynapse()
  const { address } = useAccount()

  return useQuery({
    enabled: !!synapse && !!address,
    queryKey: ['balances', address],
    queryFn: async () => {
      if (!synapse) throw new Error('Synapse not found')
      const [fil, usdfcWallet, usdfcWarm] = await Promise.all([
        synapse.payments.walletBalance(),
        synapse.payments.walletBalance(TOKENS.USDFC),
        synapse.payments.balance(TOKENS.USDFC),
      ])
      const usdfcDecimals = synapse.payments.decimals(TOKENS.USDFC)
      const format = (v: bigint, dec: number) => Number((Number(v) / 10 ** dec).toFixed(4))
      return {
        fil,
        usdfcWallet,
        usdfcWarm,
        filFormatted: format(fil, 18),
        usdfcWalletFormatted: format(usdfcWallet, usdfcDecimals),
        usdfcWarmFormatted: format(usdfcWarm, usdfcDecimals),
      }
    },
  })
}


