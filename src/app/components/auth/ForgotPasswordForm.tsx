"use client"
import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Password reset link sent to your email (simulated).')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-4">Forgot Password</h2>
      {message && <p className="text-green-500">{message}</p>}
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <Button type="submit" className="mt-4">Send Reset Link</Button>
    </form>
  )
}