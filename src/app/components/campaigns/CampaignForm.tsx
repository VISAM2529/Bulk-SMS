"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageEditor from './MessageEditor';
import MediaUpload from './MediaUpload';
import { useAuth } from '../../contexts/AuthContext';

export default function CampaignForm({ campaign }: { campaign?: any }) {
  const { user } = useAuth();
  const [name, setName] = useState(campaign?.name || '');
  const [message, setMessage] = useState(campaign?.message || '');
  const [mediaUrl, setMediaUrl] = useState(campaign?.mediaUrl || '');
  const [contacts, setContacts] = useState<any[]>(campaign?.contacts || []);
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/contacts', {
          headers: { Authorization: user.token ? `Bearer ${user.token}` : '' }
        });
        if (!res.ok) throw new Error('Failed to fetch contacts');
        const data = await res.json();
        setAllContacts(data.contacts || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching contacts');
      }
    };
    fetchContacts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.token ? `Bearer ${user.token}` : ''
        },
        body: JSON.stringify({
          name,
          message,
          mediaUrl,
          contacts,
          ctaButtons: [],
          schedule: null
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create campaign');
      }
      router.push('/campaigns');
    } catch (err: any) {
      setError(err.message || 'Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {campaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-gray-600 mt-1">
            {campaign ? 'Update your messaging campaign' : 'Set up a new messaging campaign'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                type="button"
                onClick={() => setSelectedTab('details')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'details'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Campaign Details
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('contacts')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'contacts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contacts ({contacts.length})
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {selectedTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <MessageEditor value={message} onChange={setMessage} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Attachment
                  </label>
                  <MediaUpload onUpload={setMediaUrl} />
                  {mediaUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Uploaded Media:</p>
                      {mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={mediaUrl} alt="Uploaded media" className="max-w-xs h-auto rounded" />
                      ) : mediaUrl.match(/\.(mp4|mov)$/i) ? (
                        <video src={mediaUrl} controls className="max-w-xs h-auto rounded" />
                      ) : (
                        <p className="text-sm text-gray-600">{mediaUrl}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'contacts' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Contacts</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {contacts.length} contact{contacts.length !== 1 ? 's' : ''} selected
                    </span>
                    {contacts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setContacts([])}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                  {allContacts.map(contact => (
                    <label
                      key={contact._id || contact.id || contact.phoneNumber}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        contacts.includes(contact.phoneNumber)
                          ? 'bg-indigo-50 border-indigo-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={contacts.includes(contact.phoneNumber)}
                        onChange={e => {
                          if (e.target.checked) setContacts([...contacts, contact.phoneNumber]);
                          else setContacts(contacts.filter((c: string) => c !== contact.phoneNumber));
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.phoneNumber}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/campaigns')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Campaigns
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push(`/campaigns/${campaign?.id || 'new'}/preview`)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Preview
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {campaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}