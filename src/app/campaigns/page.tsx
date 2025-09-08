"use client"
import { useAuth } from '../contexts/AuthContext'
import CampaignList from '../components/campaigns/CampaignList'
import { mockCampaigns } from '../lib/mockData'
import Link from 'next/link'

export default function CampaignsPage() {
  const { user } = useAuth()
  const campaigns = mockCampaigns.filter(c => c.userId === user?.id)

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your messaging campaigns</p>
        </div>
        <Link 
          href="/campaigns/create" 
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Create Campaign
        </Link>
      </div>
      <CampaignList campaigns={campaigns} />
    </div>
  )
}