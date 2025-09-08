"use client"
import { useAuth } from '../contexts/AuthContext'
import UserDashboard from '../components/dashboard/UserDashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/auth/login')
  }, [user, router])

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse mb-4">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
  
  return <UserDashboard />
}