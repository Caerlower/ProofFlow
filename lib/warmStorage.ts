import { Synapse, TIME_CONSTANTS, WarmStorageService, TOKENS } from '@filoz/synapse-sdk'
import { proofflowConfig } from '@/lib/proofflowConfig'
import { ethers } from 'ethers'

export interface WarmStorageBalance {
  currentRateAllowance: bigint
  currentRateUsed: bigint
  rateAllowanceNeeded: bigint
  currentLockupAllowance: bigint
  currentLockupUsed: bigint
  lockupAllowanceNeeded: bigint
  depositAmountNeeded: bigint
  costs: {
    perEpoch: bigint
  }
}

export async function fetchWarmStorageCosts(synapse: Synapse) {
  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  )
  return warmStorageService.getServicePrice()
}

export async function fetchWarmStorageBalance(
  synapse: Synapse,
  storageCapacityBytes: number,
  persistencePeriodDays: number
) {
  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  )
  return warmStorageService.checkAllowanceForStorage(
    storageCapacityBytes,
    proofflowConfig.withCDN,
    synapse.payments,
    persistencePeriodDays
  )
}

export async function preflightCheck(
  file: File,
  synapse: Synapse,
  includeDataSetCreationFee: boolean,
  updateStatus: (status: string) => void,
  updateProgress: (progress: number) => void
) {
  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  )

  const warmStorageBalance: WarmStorageBalance = await warmStorageService.checkAllowanceForStorage(
    file.size,
    proofflowConfig.withCDN,
    synapse.payments,
    proofflowConfig.persistencePeriod
  )

  const {
    isSufficient,
    rateAllowanceNeeded,
    lockupAllowanceNeeded,
    depositAmountNeeded,
  } = await checkAllowances(
    warmStorageBalance,
    proofflowConfig.minDaysThreshold,
    includeDataSetCreationFee
  )

  if (!isSufficient) {
    updateStatus('💰 Insufficient USDFC allowance...')

    updateStatus('💰 Depositing USDFC to cover storage costs...')
    const depositTx = await synapse.payments.deposit(
      depositAmountNeeded,
      TOKENS.USDFC,
      {
        onDepositStarting: () => updateStatus('💰 Depositing USDFC...'),
        onAllowanceCheck: (current: bigint, required: bigint) =>
          updateStatus(`💰 Allowance check ${current > required ? 'sufficient' : 'insufficient'}`),
        onApprovalTransaction: async (tx: ethers.TransactionResponse) => {
          updateStatus(`💰 Approving USDFC... ${tx.hash}`)
          const receipt = await tx.wait()
          updateStatus(`💰 USDFC approved ${receipt?.hash}`)
        },
      }
    )
    await depositTx.wait()
    updateStatus('💰 USDFC deposited successfully')
    updateProgress(10)

    updateStatus('💰 Approving Filecoin Warm Storage service USDFC spending rates...')
    const approvalTx = await synapse.payments.approveService(
      synapse.getWarmStorageAddress(),
      rateAllowanceNeeded,
      lockupAllowanceNeeded,
      TIME_CONSTANTS.EPOCHS_PER_DAY * BigInt(proofflowConfig.persistencePeriod)
    )
    await approvalTx.wait()
    updateStatus('💰 Filecoin Warm Storage service approved to spend USDFC')
    updateProgress(20)
  }
}

export async function checkAllowances(
  warmStorageBalance: WarmStorageBalance,
  minDaysThreshold: number,
  includeDataSetCreationFee: boolean
) {
  const rateNeeded = warmStorageBalance.costs.perEpoch
  const lockupPerDay = TIME_CONSTANTS.EPOCHS_PER_DAY * rateNeeded
  const currentLockupRemaining =
    warmStorageBalance.currentLockupAllowance - warmStorageBalance.currentLockupUsed

  const DATA_SET_CREATION_FEE = 0n
  const dataSetCreationFee = includeDataSetCreationFee ? DATA_SET_CREATION_FEE : 0n

  const totalLockupNeeded = warmStorageBalance.lockupAllowanceNeeded
  const depositNeeded = warmStorageBalance.depositAmountNeeded

  const rateAllowanceNeeded =
    warmStorageBalance.currentRateAllowance > warmStorageBalance.rateAllowanceNeeded
      ? warmStorageBalance.currentRateAllowance
      : warmStorageBalance.rateAllowanceNeeded

  const lockupAllowanceNeeded = totalLockupNeeded + dataSetCreationFee
  const depositAmountNeeded = depositNeeded + dataSetCreationFee

  const isLockupBalanceSufficientForDataSetCreation = currentLockupRemaining >= lockupAllowanceNeeded
  const persistenceDaysLeft = Number(currentLockupRemaining) / Number(lockupPerDay)
  const isRateSufficient = warmStorageBalance.currentRateAllowance >= rateAllowanceNeeded
  const isLockupSufficient =
    persistenceDaysLeft >= Number(minDaysThreshold) && isLockupBalanceSufficientForDataSetCreation
  const isSufficient = isRateSufficient && isLockupSufficient

  return {
    isSufficient,
    isLockupSufficient,
    isRateSufficient,
    rateAllowanceNeeded,
    lockupAllowanceNeeded,
    depositAmountNeeded,
    currentLockupRemaining,
    lockupPerDay,
    persistenceDaysLeft,
  }
}


