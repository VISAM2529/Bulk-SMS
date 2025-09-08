"use client"
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../common/Button'
import Input from '../common/Input'

export default function ProfileSettings() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Profile updated (simulated)')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Profile Settings</h2>
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="mt-2" />
      <Button type="submit" className="mt-4">Save</Button>
    </form>
  )
}