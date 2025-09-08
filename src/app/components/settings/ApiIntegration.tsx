"use client"
import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

export default function ApiIntegration() {
  const [apiKey, setApiKey] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(apiKey ? 'API key validated (simulated)' : 'Please enter an API key')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Fast2SMS API Key</h2>
      {message && <p className={message.includes('success') ? 'text-green-500' : 'text-red-500'}>{message}</p>}
      <Input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API Key" />
      <Button type="submit" className="mt-4">Test Connection</Button>
    </form>
  )
}