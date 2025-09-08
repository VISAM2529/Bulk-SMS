"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockGroups } from '../../lib/mockData'

export default function GroupForm({ group }: { group?: any }) {
  const [name, setName] = useState(group?.name || '')
  const [description, setDescription] = useState(group?.description || '')
  const [color, setColor] = useState(group?.color || 'indigo')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGroup = { 
      id: group?.id || String(mockGroups.length + 1), 
      userId: '1', 
      name, 
      description,
      color,
      contactIds: [] 
    }
    if (!group) mockGroups.push(newGroup)
    else mockGroups[mockGroups.findIndex(g => g.id === group.id)] = newGroup
    router.push('/contacts')
  }

  const colorOptions = [
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  ]

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {group ? 'Edit Group' : 'Create New Group'}
          </h1>
          <p className="text-gray-600 mt-1">
            {group ? 'Update your contact group' : 'Organize your contacts into groups for better management'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Enter group name (e.g., Family, Work, Clients)"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Optional description for this group"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-full p-1 ${
                      color === option.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={option.value}
                      checked={color === option.value}
                      onChange={(e) => setColor(e.target.value)}
                      className="sr-only"
                    />
                    <span
                      className={`block h-8 w-8 rounded-full ${option.class} ${
                        color === option.value ? 'ring-2 ring-white' : ''
                      }`}
                    ></span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/contacts')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {group ? 'Update Group' : 'Create Group'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Group Preview
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className={`w-4 h-4 rounded-full ${colorOptions.find(o => o.value === color)?.class} mr-3`}></div>
              <div>
                <div className="text-sm font-medium text-gray-900">{name || 'Group Name'}</div>
                {description && (
                  <div className="text-sm text-gray-600 mt-1">{description}</div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              This is how your group will appear in the contacts list
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}