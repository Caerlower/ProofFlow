"use client"

import React from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Upload, 
  Download, 
  Shield, 
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

export default function ActivityPage() {
  const { isConnected } = useAccount()

  const activities = [
    {
      id: 1,
      type: 'upload',
      title: 'File Uploaded',
      description: 'document.pdf (1.2 MB)',
      timestamp: '2 hours ago',
      status: 'completed',
      details: 'Stored on Filecoin with PDP verification'
    },
    {
      id: 2,
      type: 'download',
      title: 'File Downloaded',
      description: 'image.jpg (850 KB)',
      timestamp: '5 hours ago',
      status: 'completed',
      details: 'Retrieved via FilCDN in 245ms'
    },
    {
      id: 3,
      type: 'verification',
      title: 'PDP Verification',
      description: 'video.mp4 (45.2 MB)',
      timestamp: '1 day ago',
      status: 'completed',
      details: 'Data integrity verified successfully'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Processed',
      description: 'Storage cost for archive.zip',
      timestamp: '2 days ago',
      status: 'completed',
      details: '$0.85 charged via Filecoin Pay'
    },
    {
      id: 5,
      type: 'upload',
      title: 'File Upload Failed',
      description: 'large-file.mov (2.1 GB)',
      timestamp: '3 days ago',
      status: 'failed',
      details: 'Insufficient balance for storage'
    },
    {
      id: 6,
      type: 'verification',
      title: 'PDP Verification',
      description: 'document.pdf (1.2 MB)',
      timestamp: '4 days ago',
      status: 'completed',
      details: 'Data integrity verified successfully'
    },
    {
      id: 7,
      type: 'download',
      title: 'File Downloaded',
      description: 'archive.zip (12.8 MB)',
      timestamp: '5 days ago',
      status: 'completed',
      details: 'Retrieved via FilCDN in 189ms'
    },
    {
      id: 8,
      type: 'payment',
      title: 'Wallet Deposit',
      description: 'Added funds to wallet',
      timestamp: '1 week ago',
      status: 'completed',
      details: '$10.00 deposited successfully'
    }
  ]

  const getActivityIcon = (type: string, status: string) => {
    const iconClass = "h-5 w-5"
    
    if (status === 'failed') {
      return <XCircle className={`${iconClass} text-red-500`} />
    }
    
    switch (type) {
      case 'upload':
        return <Upload className={`${iconClass} text-blue-500`} />
      case 'download':
        return <Download className={`${iconClass} text-green-500`} />
      case 'verification':
        return <Shield className={`${iconClass} text-orange-500`} />
      case 'payment':
        return <CreditCard className={`${iconClass} text-purple-500`} />
      default:
        return <Activity className={`${iconClass} text-gray-500`} />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const activityStats = [
    {
      title: 'Total Operations',
      value: '1,247',
      description: 'All time',
      icon: Activity,
      trend: '+12% this month'
    },
    {
      title: 'Successful Uploads',
      value: '98.5%',
      description: 'Success rate',
      icon: Upload,
      trend: 'Last 30 days'
    },
    {
      title: 'Average Retrieval',
      value: '245ms',
      description: 'Response time',
      icon: Download,
      trend: 'Via FilCDN'
    },
    {
      title: 'Verification Rate',
      value: '100%',
      description: 'PDP checks passed',
      icon: Shield,
      trend: 'All files verified'
    }
  ]

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <Activity className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Connect your wallet to view your storage activity and operations.
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
          Activity Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor all your storage operations, verifications, and payments.
        </p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityStats.map((stat) => (
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

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Timeline of your storage operations and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.status)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {activity.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Options */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Activity</CardTitle>
          <CardDescription>
            View specific types of activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              All Activities
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Uploads
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Downloads
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Verifications
            </Button>
            <Button variant="outline" size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
