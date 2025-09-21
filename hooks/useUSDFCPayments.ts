"use client"

import { useState, useCallback } from 'react'
import { useSynapse } from './useSynapse'

// Hook for USDFC payments and deposits
export function useUSDFCPayments() {
  const { synapse, isConnected } = useSynapse()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Deposit USDFC tokens
  const depositUSDFC = useCallback(async (amount: string) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Deposit USDFC tokens using the payments service
      // Convert string amount to TokenAmount (assuming it's in wei/units)
      const amountBigInt = BigInt(amount)
      const result = await synapse.payments.deposit(amountBigInt)
      return result
    } catch (err) {
      console.error('USDFC deposit failed:', err)
      setError('Deposit failed')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [synapse, isConnected])

  // Withdraw USDFC tokens
  const withdrawUSDFC = useCallback(async (amount: string) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Withdraw USDFC tokens using the payments service
      // Convert string amount to TokenAmount (assuming it's in wei/units)
      const amountBigInt = BigInt(amount)
      const result = await synapse.payments.withdraw(amountBigInt)
      return result
    } catch (err) {
      console.error('USDFC withdrawal failed:', err)
      setError('Withdrawal failed')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [synapse, isConnected])

  // Pay for storage by approving the warm storage service
  const payForStorage = useCallback(async (amount: string = '10') => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Approve the warm storage service for the specified amount
      const amountBigInt = BigInt(amount)
      const result = await synapse.payments.approveService(
        synapse.getWarmStorageAddress(), // service address
        amountBigInt, // rate allowance
        amountBigInt, // lockup allowance
        BigInt(30 * 24 * 60 * 60), // max lockup period (30 days in seconds)
      )
      return result
    } catch (err) {
      console.error('Storage payment failed:', err)
      setError('Storage payment failed')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [synapse, isConnected])

  // Approve service for storage
  const approveService = useCallback(async (amount: string) => {
    if (!synapse || !isConnected) {
      throw new Error('Synapse not initialized or wallet not connected')
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Approve service for storage using the payments service
      // Convert string amount to TokenAmount (assuming it's in wei/units)
      const amountBigInt = BigInt(amount)
      const result = await synapse.payments.approveService(
        synapse.getWarmStorageAddress(), // service address
        amountBigInt, // rate allowance
        amountBigInt, // lockup allowance
        BigInt(30 * 24 * 60 * 60), // max lockup period (30 days in seconds)
      )
      return result
    } catch (err) {
      console.error('Service approval failed:', err)
      setError('Service approval failed')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [synapse, isConnected])

  return {
    depositUSDFC,
    withdrawUSDFC,
    payForStorage,
    approveService,
    isProcessing,
    error,
  }
}

// Hook for storage cost calculations
export function useStorageCosts() {
  const { synapse, isConnected } = useSynapse()
  const [costs, setCosts] = useState<{
    storageCostPerGB: string
    retrievalCostPerGB: string
    minimumPayment: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCosts = useCallback(async () => {
    if (!synapse || !isConnected) return

    setIsLoading(true)
    setError(null)

    try {
      // Get account info to understand current usage and costs
      const accountInfo = await synapse.payments.accountInfo()
      
      // Mock cost data since exact pricing methods may vary
      // In a real implementation, you'd get these from the service provider
      const costs = {
        storageCostPerGB: '0.1', // USDFC per GB
        retrievalCostPerGB: '0.001', // USDFC per GB
        minimumPayment: '1.0', // Minimum USDFC payment
      }
      setCosts(costs)
    } catch (err) {
      console.error('Failed to fetch storage costs:', err)
      setError('Failed to fetch storage costs')
    } finally {
      setIsLoading(false)
    }
  }, [synapse, isConnected])

  return {
    costs,
    isLoading,
    error,
    refetch: fetchCosts,
  }
}
