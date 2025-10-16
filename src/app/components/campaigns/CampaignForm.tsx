// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import MessageEditor from './MessageEditor';
// import MediaUpload from './MediaUpload';
// import { useAuth } from '../../contexts/AuthContext';

// export default function CampaignForm({ campaign }: { campaign?: any }) {
//   const { user } = useAuth();
//   const [name, setName] = useState(campaign?.name || '');
//   const [message, setMessage] = useState(campaign?.message || '');
//   const [mediaUrl, setMediaUrl] = useState(campaign?.mediaUrl || '');
//   const [contacts, setContacts] = useState<any[]>(campaign?.contacts || []);
//   const [allContacts, setAllContacts] = useState<any[]>([]);
//   const [selectedTab, setSelectedTab] = useState('details');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (!user) return;
//       try {
//         const res = await fetch('/api/contacts', {
//           headers: { Authorization: user.token ? `Bearer ${user.token}` : '' }
//         });
//         if (!res.ok) throw new Error('Failed to fetch contacts');
//         const data = await res.json();
//         setAllContacts(data.contacts || []);
//       } catch (err: any) {
//         setError(err.message || 'Error fetching contacts');
//       }
//     };
//     fetchContacts();
//   }, [user]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch('/api/campaigns', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: user?.token ? `Bearer ${user.token}` : ''
//         },
//         body: JSON.stringify({
//           name,
//           message,
//           mediaUrl,
//           contacts,
//           ctaButtons: [],
//           schedule: null
//         })
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || 'Failed to create campaign');
//       }
//       router.push('/campaigns');
//     } catch (err: any) {
//       setError(err.message || 'Error creating campaign');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             {campaign ? 'Edit Campaign' : 'Create New Campaign'}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {campaign ? 'Update your messaging campaign' : 'Set up a new messaging campaign'}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 type="button"
//                 onClick={() => setSelectedTab('details')}
//                 className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
//                   selectedTab === 'details'
//                     ? 'border-indigo-500 text-indigo-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Campaign Details
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSelectedTab('contacts')}
//                 className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
//                   selectedTab === 'contacts'
//                     ? 'border-indigo-500 text-indigo-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Contacts ({contacts.length})
//               </button>
//             </nav>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6">
//             {selectedTab === 'details' && (
//               <div className="space-y-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Campaign Name
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     value={name}
//                     onChange={e => setName(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                     placeholder="Enter campaign name"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Message Content
//                   </label>
//                   <MessageEditor value={message} onChange={setMessage} />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Media Attachment
//                   </label>
//                   <MediaUpload onUpload={setMediaUrl} />
//                   {mediaUrl && (
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-600">Uploaded Media:</p>
//                       {mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
//                         <img src={mediaUrl} alt="Uploaded media" className="max-w-xs h-auto rounded" />
//                       ) : mediaUrl.match(/\.(mp4|mov)$/i) ? (
//                         <video src={mediaUrl} controls className="max-w-xs h-auto rounded" />
//                       ) : (
//                         <p className="text-sm text-gray-600">{mediaUrl}</p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {selectedTab === 'contacts' && (
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Select Contacts</h3>
//                 <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">
//                       {contacts.length} contact{contacts.length !== 1 ? 's' : ''} selected
//                     </span>
//                     {contacts.length > 0 && (
//                       <button
//                         type="button"
//                         onClick={() => setContacts([])}
//                         className="text-sm text-red-600 hover:text-red-800 transition-colors"
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
//                   {allContacts.map(contact => (
//                     <label
//                       key={contact._id || contact.id || contact.phoneNumber}
//                       className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                         contacts.includes(contact.phoneNumber)
//                           ? 'bg-indigo-50 border-indigo-500'
//                           : 'bg-white border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={contacts.includes(contact.phoneNumber)}
//                         onChange={e => {
//                           if (e.target.checked) setContacts([...contacts, contact.phoneNumber]);
//                           else setContacts(contacts.filter((c: string) => c !== contact.phoneNumber));
//                         }}
//                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       />
//                       <div className="ml-3">
//                         <div className="text-sm font-medium text-gray-900">{contact.name}</div>
//                         <div className="text-sm text-gray-500">{contact.phoneNumber}</div>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => router.push('/campaigns')}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                 </svg>
//                 Back to Campaigns
//               </button>

//               <div className="flex space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => router.push(`/campaigns/${campaign?.id || 'new'}/preview`)}
//                   className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                     <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                   </svg>
//                   Preview
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   {campaign ? 'Update Campaign' : 'Create Campaign'}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


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
  const [videos, setVideos] = useState<string[]>(campaign?.videos || Array(5).fill(''));
  const [images, setImages] = useState<string[]>(campaign?.images || Array(2).fill(''));
  const [pdf, setPdf] = useState<string>(campaign?.pdf || '');
  const [contacts, setContacts] = useState<any[]>(campaign?.contacts || []);
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ctaButtons, setCtaButtons] = useState(campaign?.ctaButtons || []);
  const [showCtaModal, setShowCtaModal] = useState(false);
  const [newCta, setNewCta] = useState({ type: 'call', text: '', value: '' });
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
          videos: videos.filter(v => v),
          images: images.filter(i => i),
          pdf,
          contacts,
          ctaButtons,
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

  const handleVideoUpload = (index: number, url: string) => {
    const newVideos = [...videos];
    newVideos[index] = url;
    setVideos(newVideos);
  };

  const handleImageUpload = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const addCtaButton = () => {
    if (newCta.text && newCta.value) {
      setCtaButtons([...ctaButtons, newCta]);
      setNewCta({ type: 'call', text: '', value: '' });
      setShowCtaModal(false);
    }
  };

  const removeCtaButton = (index: number) => {
    setCtaButtons(ctaButtons.filter((_: any, i: number) => i !== index));
  };

  const ctaTypes = [
    { value: 'call', label: 'Call', icon: '📞' },
    { value: 'reply', label: 'Quick Reply', icon: '💬' },
    { value: 'url', label: 'Visit URL', icon: '🔗' },
    { value: 'location', label: 'Share Location', icon: '📍' }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {campaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h1>
              <p className="text-gray-600">
                {campaign ? 'Update your messaging campaign with rich media and interactive buttons' : 'Design a powerful messaging campaign with multimedia content'}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Auto-save enabled</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              {['details', 'media', 'cta', 'contacts'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`flex-1 py-4 px-6 text-sm font-semibold border-b-3 transition-all ${
                    selectedTab === tab
                      ? 'border-indigo-600 text-indigo-700 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">
                      {tab === 'details' ? '📝' : tab === 'media' ? '🎬' : tab === 'cta' ? '🎯' : '👥'}
                    </span>
                    <span className="capitalize">{tab}</span>
                    {tab === 'contacts' && (
                      <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                        {contacts.length}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Details Tab */}
            {selectedTab === 'details' && (
              <div className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., Summer Sale 2025, Product Launch"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Message Content <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                    <MessageEditor value={message} onChange={setMessage} />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Tip: Use personalization tags like {'{name}'} to make your message more engaging
                  </p>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {selectedTab === 'media' && (
              <div className="space-y-8">
                {/* Videos Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Video Content</h3>
                    <span className="text-sm text-gray-500">
                      {videos.filter(v => v).length} / 5 uploaded
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <div className={`aspect-video rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                          video ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                        }`}>
                          {video ? (
                            <div className="relative w-full h-full">
                              <video src={video} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleVideoUpload(index, '')}
                                  className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium transition-all transform scale-90 group-hover:scale-100"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer">
                              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs text-gray-500 text-center">Video {index + 1}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Image Content</h3>
                    <span className="text-sm text-gray-500">
                      {images.filter(i => i).length} / 2 uploaded
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className={`aspect-video rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                          image ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                        }`}>
                          {image ? (
                            <div className="relative w-full h-full">
                              <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleImageUpload(index, '')}
                                  className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium transition-all transform scale-90 group-hover:scale-100"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer">
                              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Upload Image {index + 1}</span>
                              <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">PDF Document</h3>
                    <span className="text-sm text-gray-500">
                      {pdf ? '1 uploaded' : 'No document'}
                    </span>
                  </div>
                  <div className={`rounded-xl border-2 border-dashed p-8 transition-all ${
                    pdf ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}>
                    {pdf ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Document.pdf</p>
                            <p className="text-sm text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPdf('')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center cursor-pointer">
                        <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-700 mb-1">Upload PDF Document</p>
                        <p className="text-sm text-gray-500">Brochure, catalog, or any PDF file up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Tab */}
            {selectedTab === 'cta' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Call-to-Action Buttons</h3>
                    <p className="text-sm text-gray-500 mt-1">Add interactive buttons to drive user engagement</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCtaModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Add Button</span>
                  </button>
                </div>

                {ctaButtons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ctaButtons.map((cta: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                              {ctaTypes.find(t => t.value === cta.type)?.icon}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{cta.text}</p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {ctaTypes.find(t => t.value === cta.type)?.label}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 font-mono">{cta.value}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCtaButton(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p className="text-gray-600 font-medium mb-1">No CTA buttons added yet</p>
                    <p className="text-sm text-gray-500">Click Add &apos;Button&apos; to create interactive actions</p>
                  </div>
                )}

                {/* CTA Modal */}
                {showCtaModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Add CTA Button</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Button Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {ctaTypes.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => setNewCta({ ...newCta, type: type.value })}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  newCta.type === type.value
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-2xl mb-1">{type.icon}</div>
                                <div className="text-xs font-medium text-gray-700">{type.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                          <input
                            type="text"
                            value={newCta.text}
                            onChange={e => setNewCta({ ...newCta, text: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Call Now, Reply"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {newCta.type === 'call' ? 'Phone Number' : newCta.type === 'url' ? 'URL' : 'Value'}
                          </label>
                          <input
                            type="text"
                            value={newCta.value}
                            onChange={e => setNewCta({ ...newCta, value: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={
                              newCta.type === 'call' ? '+1234567890' :
                              newCta.type === 'url' ? 'https://example.com' :
                              'Enter value'
                            }
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowCtaModal(false)}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={addCtaButton}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Add Button
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contacts Tab */}
            {selectedTab === 'contacts' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Recipients</h3>
                  <p className="text-sm text-gray-500">Choose contacts who will receive this campaign</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {contacts.length}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {contacts.length} contact{contacts.length !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-sm text-gray-600">
                          {contacts.length > 0 ? 'Ready to send' : 'Select at least one contact'}
                        </p>
                      </div>
                    </div>
                    {contacts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setContacts([])}
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Import Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Bulk Import */}
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Bulk Import</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Paste phone numbers (one per line or comma-separated)</p>
                    <textarea
                      placeholder="e.g.,&#10;+1234567890&#10;+0987654321&#10;or: +1234567890, +0987654321"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                      rows={4}
                      onChange={(e) => {
                        const text = e.target.value;
                        const numbers = text
                          .split(/[\n,]+/)
                          .map(num => num.trim())
                          .filter(num => num.length > 0);
                        
                        const uniqueNumbers = [...new Set([...contacts, ...numbers])];
                        setContacts(uniqueNumbers);
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-2">💡 Supports newline or comma separation</p>
                  </div>

                  {/* Import from File */}
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-indigo-400 transition-all">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <h4 className="font-semibold text-gray-900">Import from File</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Upload CSV, TXT, or Excel file with contacts</p>
                    <label className="block">
                      <input
                        type="file"
                        accept=".csv,.txt,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const text = event.target?.result as string;
                              const numbers = text
                                .split(/[\n,;]+/)
                                .map(num => num.trim())
                                .filter(num => num.match(/^\+?\d+$/));
                              
                              const uniqueNumbers = [...new Set([...contacts, ...numbers])];
                              setContacts(uniqueNumbers);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <div className="px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center cursor-pointer hover:bg-indigo-100 transition-colors">
                        <svg className="w-8 h-8 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-indigo-700">Choose File</p>
                        <p className="text-xs text-gray-500 mt-1">CSV, TXT, XLSX</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Contact List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Select from Existing Contacts</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const allNumbers = allContacts.map(c => c.phoneNumber);
                        setContacts(allNumbers);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Select All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                    {allContacts.map(contact => (
                      <label
                        key={contact._id || contact.id || contact.phoneNumber}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          contacts.includes(contact.phoneNumber)
                            ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-500 shadow-md'
                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={contacts.includes(contact.phoneNumber)}
                          onChange={e => {
                            if (e.target.checked) setContacts([...contacts, contact.phoneNumber]);
                            else setContacts(contacts.filter((c: string) => c !== contact.phoneNumber));
                          }}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {contact.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{contact.name}</div>
                              <div className="text-xs text-gray-500">{contact.phoneNumber}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => router.push('/campaigns')}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center space-x-2 border-2 border-gray-300 rounded-lg hover:border-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Back to Campaigns</span>
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push(`/campaigns/${campaign?.id || 'new'}/preview`)}
                  className="px-6 py-2.5 border-2 border-indigo-300 rounded-lg text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-all flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>Preview</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{campaign ? 'Update Campaign' : 'Create Campaign'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Campaign Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Videos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{videos.filter(v => v).length}/5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Images</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{images.filter(i => i).length}/2</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">CTA Buttons</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{ctaButtons.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Recipients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}