"use client"
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'api', label: 'API Integration', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )},
    { id: 'billing', label: 'Billing', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    )}
  ]

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and integrations</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg border border-gray-100">
          <nav className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-lg border border-gray-100 border-t-0 p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'api' && <ApiIntegration />}
          {activeTab === 'billing' && <Billing />}
        </div>
      </div>
    </div>
  )
}

function ProfileSettings() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Information</h2>
        <p className="text-gray-600">Update your personal information and contact details.</p>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 text-sm">{message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function ApiIntegration() {
  const [apiKey, setApiKey] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTesting(true)
    
    // Simulate API validation
    setTimeout(() => {
      setIsTesting(false)
      if (apiKey) {
        setMessage('API key validated successfully! Connection established with Fast2SMS.')
      } else {
        setMessage('Please enter a valid API key')
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Fast2SMS API Integration</h2>
        <p className="text-gray-600">Connect your Fast2SMS account to enable WhatsApp messaging services.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-blue-800 text-sm font-medium">API Key Required</p>
            <p className="text-blue-700 text-sm mt-1">You can find your API key in your Fast2SMS dashboard under API settings.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-mono"
            placeholder="Enter your Fast2SMS API key"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
                message.includes('success') ? 'text-green-500' : 'text-red-500'
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={message.includes('success') 
                  ? "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  : "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                } clipRule="evenodd" />
              </svg>
              <span className="text-sm">{message}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isTesting}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 flex items-center"
          >
            {isTesting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing Connection...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Test Connection
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function Billing() {
  const plans = [
    {
      name: 'Starter',
      price: '$19',
      period: '/month',
      features: ['1,000 messages', 'Basic analytics', 'Email support'],
      popular: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      features: ['5,000 messages', 'Advanced analytics', 'Priority support', 'API access'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: ['Unlimited messages', 'Full analytics', '24/7 support', 'Dedicated account manager'],
      popular: false
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Billing & Subscription</h2>
        <p className="text-gray-600">Manage your subscription plan and payment methods.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-yellow-800 text-sm font-medium">Current Plan: Professional</p>
            <p className="text-yellow-700 text-sm mt-1">Your next billing date is January 15, 2024</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl border-2 p-6 transition-all ${
                plan.popular
                  ? 'border-indigo-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{plan.name}</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.popular ? 'Current Plan' : 'Upgrade Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Methods</h3>
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Visa ending in 4242</p>
              <p className="text-xs text-gray-600">Expires 12/2024</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Edit
          </button>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Payment Method
        </button>
      </div>
    </div>
  )
}