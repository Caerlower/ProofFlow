"use client"

import React from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Download,
  Globe
} from 'lucide-react'

export default function SettingsPage() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <Settings className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Connect your wallet to access your ProofFlow settings.
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
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your ProofFlow account preferences and security settings.
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your wallet and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wallet-address">Connected Wallet</Label>
            <Input
              id="wallet-address"
              value={address || ''}
              disabled
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your wallet address for ProofFlow operations
            </p>
          </div>
          
          <div>
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              placeholder="Enter your display name"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional name to display in your dashboard
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="upload-notifications">Upload Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when file uploads complete
              </p>
            </div>
            <Switch id="upload-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="verification-notifications">Verification Alerts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive alerts for PDP verification results
              </p>
            </div>
            <Switch id="verification-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payment-notifications">Payment Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified about payment transactions
              </p>
            </div>
            <Switch id="payment-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="low-balance-alerts">Low Balance Alerts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alert when wallet balance is low
              </p>
            </div>
            <Switch id="low-balance-alerts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-verification">Auto PDP Verification</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically verify data integrity
              </p>
            </div>
            <Switch id="auto-verification" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="secure-retrieval">Secure Retrieval</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use encrypted retrieval for sensitive files
              </p>
            </div>
            <Switch id="secure-retrieval" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically disconnect after inactivity
              </p>
            </div>
            <Switch id="session-timeout" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Storage Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Storage Preferences
          </CardTitle>
          <CardDescription>
            Configure your storage and retrieval preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-retrieval">Auto Retrieval</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically cache frequently accessed files
              </p>
            </div>
            <Switch id="auto-retrieval" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compression">File Compression</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compress files to reduce storage costs
              </p>
            </div>
            <Switch id="compression" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="redundancy">Data Redundancy</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Store multiple copies for increased reliability
              </p>
            </div>
            <Switch id="redundancy" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Download className="h-6 w-6" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 text-red-600 hover:text-red-700">
              <CreditCard className="h-6 w-6" />
              <span>Delete Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button className="bg-[#0090FF] hover:bg-[#0078CC] text-white">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
