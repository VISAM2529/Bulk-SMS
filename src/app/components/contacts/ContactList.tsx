import Link from 'next/link'

export default function ContactList({ contacts }: { contacts: any[] }) {
  const getGroupBadge = (group: string) => {
    const groupColors: { [key: string]: string } = {
      'family': 'bg-purple-100 text-purple-800',
      'friends': 'bg-blue-100 text-blue-800',
      'work': 'bg-green-100 text-green-800',
      'clients': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${groupColors[group] || groupColors['default']}`}>
        {group || 'No Group'}
      </span>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
        <p className="text-gray-600 mb-4">Get started by uploading your contact list or creating groups</p>
        <div className="flex justify-center space-x-3">
          <Link 
            href="/contacts/upload" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upload Contacts
          </Link>
          <Link 
            href="/contacts/groups/create" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Group
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            className="border-0 focus:ring-0 focus:outline-none text-sm"
          />
        </div>
        <span className="text-sm text-gray-600">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-indigo-600">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getGroupBadge(contact.group)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    href={`/contacts/groups/${contact.group}/edit`} 
                    className="text-indigo-600 hover:text-indigo-900 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Group
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Showing {contacts.length} of {contacts.length} contacts
        </span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}