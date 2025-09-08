"use client"
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth/login')
    }
  }, [user, router])

  return <div>Loading...</div>
}