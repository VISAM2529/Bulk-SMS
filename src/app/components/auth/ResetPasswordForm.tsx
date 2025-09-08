import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Password reset successfully (simulated).')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-xl mb-4">Reset Password</h2>
      {message && <p className="text-green-500">{message}</p>}
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" />
      <Button type="submit" className="mt-4">Reset Password</Button>
    </form>
  )
}