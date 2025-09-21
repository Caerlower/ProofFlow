"use client"

import React from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  TrendingUp, 
  Download, 
  Upload,
  DollarSign,
  Calendar,
  Receipt
} from 'lucide-react'

export default function BillingPage() {
  const { isConnected } = useAccount()

  const billingStats = [
    {
      title: 'Current Balance',
      value: '$12.50',
      description: 'Available for storage',
      icon: DollarSign,
      trend: '+$5.00 this month'
    },
    {
      title: 'Monthly Usage',
      value: '$3.18',
      description: 'Storage & retrieval costs',
      icon: TrendingUp,
      trend: '12% increase from last month'
    },
    {
      title: 'Files Stored',
      value: '15',
      description: 'Active storage files',
      icon: Upload,
      trend: '+3 new files'
    },
    {
      title: 'Retrievals',
      value: '42',
      description: 'Downloads this month',
      icon: Download,
      trend: 'Via FilCDN'
    }
  ]

  const transactions = [
    {
      id: 1,
      type: 'storage',
      description: 'Storage cost for document.pdf',
      amount: '$0.15',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'retrieval',
      description: 'Download cost for image.jpg',
      amount: '$0.02',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: 3,
      type: 'deposit',
      description: 'Wallet deposit',
      amount: '+$10.00',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: 4,
      type: 'storage',
      description: 'Storage cost for video.mp4',
      amount: '$2.10',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: 5,
      type: 'storage',
      description: 'Storage cost for archive.zip',
      amount: '$0.85',
      date: '2024-01-12',
      status: 'completed'
    }
  ]

  const usageBreakdown = [
    { category: 'Storage', amount: '$2.95', percentage: 93, color: 'bg-blue-500' },
    { category: 'Retrieval', amount: '$0.23', percentage: 7, color: 'bg-green-500' }
  ]

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Connect your wallet to view your billing information and payment history.
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
          Billing & Payments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor your storage costs and manage payments with Filecoin Pay.
        </p>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Breakdown</CardTitle>
          <CardDescription>
            How you're using your storage budget this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.amount}</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            Manage your wallet balance and payment settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-[#0090FF] hover:bg-[#0078CC] text-white">
              <CreditCard className="h-6 w-6" />
              <span>Add Funds</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Receipt className="h-6 w-6" />
              <span>Download Invoice</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent storage and payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  {transaction.type === 'storage' && <Upload className="h-4 w-4 text-blue-500" />}
                  {transaction.type === 'retrieval' && <Download className="h-4 w-4 text-green-500" />}
                  {transaction.type === 'deposit' && <CreditCard className="h-4 w-4 text-purple-500" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.amount.startsWith('+') 
                      ? 'text-green-600' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {transaction.amount}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
          <CardDescription>
            Transparent, pay-as-you-go pricing powered by Filecoin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Storage Pricing</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• $0.12 per GB per month</li>
                <li>• Billed continuously via Filecoin Pay</li>
                <li>• No minimum storage requirements</li>
                <li>• Automatic PDP verification included</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Retrieval Pricing</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• $0.0005 per GB retrieved</li>
                <li>• FilCDN acceleration included</li>
                <li>• No bandwidth limits</li>
                <li>• Instant retrieval from cache</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
