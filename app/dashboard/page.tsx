"use client"

import React from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  HardDrive, 
  CreditCard, 
  Activity, 
  Upload,
  Download,
  Shield,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()

  const stats = [
    {
      title: 'Storage Used',
      value: '2.4 GB',
      description: 'Across 15 files',
      icon: HardDrive,
      trend: '+12% from last month'
    },
    {
      title: 'Monthly Cost',
      value: '$4.20',
      description: 'Pay-as-you-go billing',
      icon: CreditCard,
      trend: 'Based on usage'
    },
    {
      title: 'Retrieval Speed',
      value: '245 ms',
      description: 'Average response time',
      icon: Zap,
      trend: 'Via FilCDN'
    },
    {
      title: 'Data Integrity',
      value: '100%',
      description: 'PDP verification',
      icon: Shield,
      trend: 'All files verified'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'upload',
      description: 'Uploaded document.pdf',
      timestamp: '2 hours ago',
      size: '1.2 MB'
    },
    {
      id: 2,
      type: 'download',
      description: 'Downloaded image.jpg',
      timestamp: '5 hours ago',
      size: '850 KB'
    },
    {
      id: 3,
      type: 'payment',
      description: 'Payment processed',
      timestamp: '1 day ago',
      amount: '$2.10'
    },
    {
      id: 4,
      type: 'verification',
      description: 'PDP verification completed',
      timestamp: '2 days ago',
      status: 'Verified'
    }
  ]

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <HardDrive className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Connect your wallet to access your ProofFlow dashboard and manage your decentralized storage.
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
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's an overview of your ProofFlow storage.
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="text-sm">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-[#0090FF] hover:bg-[#0078CC] text-white">
              <Upload className="h-6 w-6" />
              <span>Upload Files</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Download className="h-6 w-6" />
              <span>Download Files</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Activity className="h-6 w-6" />
              <span>View Activity</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest storage operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  {activity.type === 'upload' && <Upload className="h-4 w-4 text-blue-500" />}
                  {activity.type === 'download' && <Download className="h-4 w-4 text-green-500" />}
                  {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-purple-500" />}
                  {activity.type === 'verification' && <Shield className="h-4 w-4 text-orange-500" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.size && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.size}</p>
                  )}
                  {activity.amount && (
                    <p className="text-sm font-medium text-green-600">{activity.amount}</p>
                  )}
                  {activity.status && (
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
