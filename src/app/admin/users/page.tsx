import UserManagement from '../../components/admin/UserManagement'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UserManagementPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') router.push('/auth/login')
  }, [user, router])

  if (!user || user.role !== 'admin') return <div>Access Denied</div>
  return <UserManagement />
}