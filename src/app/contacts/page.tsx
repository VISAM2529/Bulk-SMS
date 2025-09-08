import Link from 'next/link'
import ContactList from '../components/contacts/ContactList'
import { mockContacts } from '../lib/mockData'

export default function ContactsPage() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your contact list and groups</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/contacts/upload" 
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload Contacts
          </Link>
          <Link 
            href="/contacts/groups/create" 
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Create Group
          </Link>
        </div>
      </div>
      <ContactList contacts={mockContacts} />
    </div>
  )
}