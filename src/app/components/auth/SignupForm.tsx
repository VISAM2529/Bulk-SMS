"use client"
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '../common/Button'
import Input from '../common/Input'

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signup(name, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="mt-2" />
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mt-2" />
      <Button type="submit" className="mt-4">Sign Up</Button>
      <p className="mt-2">
        Have an account? <a href="/auth/login" className="text-blue-500">Login</a>
      </p>
    </form>
  )
}