"use client"
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '../common/Button'
import Input from '../common/Input'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mt-2" />
      <Button type="submit" className="mt-4">Login</Button>
      <p className="mt-2">
        No account? <a href="/auth/signup" className="text-blue-500">Sign Up</a>
      </p>
      <p><a href="/auth/forgot-password" className="text-blue-500">Forgot Password?</a></p>
    </form>
  )
}