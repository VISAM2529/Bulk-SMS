"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function SendCampaignMessagePage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [messageStatus, setMessageStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/campaigns", {
          headers: { Authorization: user.token ? `Bearer ${user.token}` : "" },
        });
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (err: any) {
        setMessageStatus(err.message || "Error fetching campaigns");
      }
    };
    fetchCampaigns();
  }, [user]);

  useEffect(() => {
    if (campaigns.length && searchParams?.get("campaignId")) {
      const camp = campaigns.find(c => c._id === searchParams.get("campaignId") || c.id === searchParams.get("campaignId"));
      if (camp) {
        setSelectedCampaign(camp);
        setSelectedContacts(camp.contacts || []);
      }
    }
  }, [campaigns, searchParams]);

  const getMediaType = (url: string): "image" | "video" | "text" => {
    if (!url) return "text";
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return "image";
    if (['mp4', 'mov', 'avi'].includes(extension || '')) return "video";
    return "text";
  };

  const isValidMediaUrl = (url: string): boolean => {
    if (!url) return true; // No media URL is valid for text-only messages
    return /^https?:\/\//.test(url);
  };

  const handleSend = async () => {
    if (!selectedCampaign || selectedContacts.length !== 1) return;
    if (selectedCampaign.mediaUrl && !isValidMediaUrl(selectedCampaign.mediaUrl)) {
      setMessageStatus("Invalid media URL: Must be a valid HTTP/HTTPS URL (e.g., from Cloudinary)");
      return;
    }
    setLoading(true);
    setMessageStatus("");
    try {
      const mediaType = getMediaType(selectedCampaign.mediaUrl);
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: JSON.stringify({
          to: selectedContacts[0],
          message: selectedCampaign.message,
          mediaUrl: selectedCampaign.mediaUrl || "",
          mediaType,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send message");
      }
      setMessageStatus("Message sent successfully!");
    } catch (err: any) {
      setMessageStatus(err.message || "Error sending message");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSend = async () => {
    if (!selectedCampaign || selectedContacts.length === 0) return;
    if (selectedCampaign.mediaUrl && !isValidMediaUrl(selectedCampaign.mediaUrl)) {
      setMessageStatus("Invalid media URL: Must be a valid HTTP/HTTPS URL (e.g., from Cloudinary)");
      return;
    }
    setLoading(true);
    setMessageStatus("");
    try {
      const mediaType = getMediaType(selectedCampaign.mediaUrl);
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: JSON.stringify({
          to: selectedContacts,
          message: selectedCampaign.message,
          mediaUrl: selectedCampaign.mediaUrl || "",
          mediaType,
          bulk: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send messages");
      }
      const data = await res.json();
      setMessageStatus(`Bulk messages processed: ${data.sent} sent, ${data.failed} failed`);
    } catch (err: any) {
      setMessageStatus(err.message || "Error sending messages");
    } finally {
      setLoading(false);
    }
  };
  console.log(selectedCampaign)
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-xl mx-auto mt-10 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Send WhatsApp Message</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Campaign</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          value={selectedCampaign?._id || selectedCampaign?.id || ""}
          onChange={e => {
            const camp = campaigns.find(c => c._id === e.target.value || c.id === e.target.value);
            setSelectedCampaign(camp || null);
            setSelectedContacts(camp?.contacts || []);
          }}
        >
          <option value="">-- Select --</option>
          {campaigns.map(c => (
            <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {selectedCampaign && (
        <>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Message Preview</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800">{selectedCampaign.message}</p>
              {selectedCampaign.mediaUrl && (
                <div className="mt-2">
                  {getMediaType(selectedCampaign.mediaUrl) === "image" && (
                    <img src={selectedCampaign.mediaUrl} alt="Media" className="max-w-full h-auto rounded" />
                  )}
                  {getMediaType(selectedCampaign.mediaUrl) === "video" && (
                    <video src={selectedCampaign.mediaUrl} controls className="max-w-full h-auto rounded" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Select Contacts ({selectedContacts.length} selected)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {selectedCampaign.contacts?.map((contact: string) => (
                <label
                  key={contact}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedContacts.includes(contact) ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact)}
                    onChange={e => {
                      if (e.target.checked) setSelectedContacts([...selectedContacts, contact]);
                      else setSelectedContacts(selectedContacts.filter(c => c !== contact));
                    }}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-900">{contact}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="flex gap-4">
        <button
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow hover:from-green-700 hover:to-green-800 transition-all w-full font-semibold text-lg disabled:opacity-50"
          disabled={!selectedCampaign || selectedContacts.length !== 1 || loading}
          onClick={handleSend}
        >
          {loading ? "Sending..." : "Send Single Message"}
        </button>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition-all w-full font-semibold text-lg disabled:opacity-50"
          disabled={!selectedCampaign || selectedContacts.length === 0 || loading}
          onClick={handleBulkSend}
        >
          {loading ? "Sending..." : "Send Bulk Messages"}
        </button>
      </div>
      {messageStatus && <div className="mt-6 text-blue-600 text-center font-medium">{messageStatus}</div>}
    </div>
  );
}











// FAST2SMS SETUP


// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function SendCampaignMessagePage() {
//   const { user } = useAuth();
//   const [campaigns, setCampaigns] = useState<any[]>([]);
//   const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
//   const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
//   const [messageStatus, setMessageStatus] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [templateName, setTemplateName] = useState<string>(""); // Approved template name
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (!user) return;
//       try {
//         const res = await fetch("/api/campaigns", {
//           headers: { Authorization: user.token ? `Bearer ${user.token}` : "" },
//         });
//         if (!res.ok) throw new Error("Failed to fetch campaigns");
//         const data = await res.json();
//         setCampaigns(data.campaigns || []);
//       } catch (err: any) {
//         setMessageStatus(err.message || "Error fetching campaigns");
//       }
//     };
//     fetchCampaigns();
//   }, [user]);

//   useEffect(() => {
//     if (campaigns.length && searchParams?.get("campaignId")) {
//       const camp = campaigns.find(
//         (c) => c._id === searchParams.get("campaignId") || c.id === searchParams.get("campaignId")
//       );
//       if (camp) {
//         setSelectedCampaign(camp);
//         setSelectedContacts(camp.contacts || []);
//         setTemplateName(camp.templateName || ""); // Pre-fill template if stored
//       }
//     }
//   }, [campaigns, searchParams]);

//   const getMediaType = (url: string): "image" | "video" | "text" => {
//     if (!url) return "text";
//     const extension = url.split(".").pop()?.toLowerCase();
//     if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return "image";
//     if (["mp4", "mov", "avi"].includes(extension || "")) return "video";
//     return "text";
//   };

//   const isValidMediaUrl = (url: string): boolean => {
//     if (!url) return true;
//     return /^https?:\/\//.test(url);
//   };

//   const handleSend = async () => {
//     if (!selectedCampaign || selectedContacts.length !== 1 || !templateName) return;
//     if (selectedCampaign.mediaUrl && !isValidMediaUrl(selectedCampaign.mediaUrl)) {
//       setMessageStatus("Invalid media URL: Must be a valid HTTP/HTTPS URL");
//       return;
//     }
//     setLoading(true);
//     setMessageStatus("");
//     try {
//       const parameters = [selectedContacts[0], selectedCampaign.message]; // Example: [name, message]
//       const res = await fetch("/api/whatsapp/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: user?.token ? `Bearer ${user.token}` : "",
//         },
//         body: JSON.stringify({
//           to: selectedContacts[0],
//           templateName,
//           parameters,
//           mediaUrl: selectedCampaign.mediaUrl || "",
//         }),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to send message");
//       }
//       setMessageStatus("WhatsApp message sent successfully!");
//     } catch (err: any) {
//       setMessageStatus(err.message || "Error sending message");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkSend = async () => {
//     if (!selectedCampaign || selectedContacts.length === 0 || !templateName) return;
//     if (selectedCampaign.mediaUrl && !isValidMediaUrl(selectedCampaign.mediaUrl)) {
//       setMessageStatus("Invalid media URL: Must be a valid HTTP/HTTPS URL");
//       return;
//     }
//     setLoading(true);
//     setMessageStatus("");
//     try {
//       const parameters = selectedContacts.map((contact) => [contact, selectedCampaign.message]); // Per contact
//       const res = await fetch("/api/messaging/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: user?.token ? `Bearer ${user.token}` : "",
//         },
//         body: JSON.stringify({
//           to: selectedContacts,
//           templateName,
//           parameters, // Array of arrays for bulk
//           mediaUrl: selectedCampaign.mediaUrl || "",
//           bulk: true,
//         }),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to send messages");
//       }
//       const data = await res.json();
//       setMessageStatus(`Bulk WhatsApp messages processed: ${data.sent} sent, ${data.failed} failed`);
//     } catch (err: any) {
//       setMessageStatus(err.message || "Error sending messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-xl mx-auto mt-10 p-8">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Send WhatsApp Message (Fast2SMS)</h1>
//       <div className="mb-6">
//         <label className="block mb-2 font-medium text-gray-700">Select Campaign</label>
//         <select
//           className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           value={selectedCampaign?._id || selectedCampaign?.id || ""}
//           onChange={(e) => {
//             const camp = campaigns.find((c) => c._id === e.target.value || c.id === e.target.value);
//             setSelectedCampaign(camp || null);
//             setSelectedContacts(camp?.contacts || []);
//             setTemplateName(camp?.templateName || "");
//           }}
//         >
//           <option value="">-- Select --</option>
//           {campaigns.map((c) => (
//             <option key={c._id || c.id} value={c._id || c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       {selectedCampaign && (
//         <>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-gray-700">WhatsApp Template</label>
//             <input
//               type="text"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//               placeholder="Enter approved template name (e.g., hello_world)"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-gray-700">Message Preview</label>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-gray-800">{selectedCampaign.message}</p>
//               {selectedCampaign.mediaUrl && (
//                 <div className="mt-2">
//                   {getMediaType(selectedCampaign.mediaUrl) === "image" && (
//                     <img src={selectedCampaign.mediaUrl} alt="Media" className="max-w-full h-auto rounded" />
//                   )}
//                   {getMediaType(selectedCampaign.mediaUrl) === "video" && (
//                     <video src={selectedCampaign.mediaUrl} controls className="max-w-full h-auto rounded" />
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-gray-700">
//               Select Contacts ({selectedContacts.length} selected)
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
//               {selectedCampaign.contacts?.map((contact: string) => (
//                 <label
//                   key={contact}
//                   className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                     selectedContacts.includes(contact)
//                       ? "bg-green-50 border-green-500"
//                       : "bg-white border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedContacts.includes(contact)}
//                     onChange={(e) => {
//                       if (e.target.checked) setSelectedContacts([...selectedContacts, contact]);
//                       else setSelectedContacts(selectedContacts.filter((c) => c !== contact));
//                     }}
//                     className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                   />
//                   <span className="ml-3 text-sm text-gray-900">{contact}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//       <div className="flex gap-4">
//         <button
//           className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow hover:from-green-700 hover:to-green-800 transition-all w-full font-semibold text-lg disabled:opacity-50"
//           disabled={!selectedCampaign || selectedContacts.length !== 1 || loading || !templateName}
//           onClick={handleSend}
//         >
//           {loading ? "Sending..." : "Send Single Message"}
//         </button>
//         <button
//           className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition-all w-full font-semibold text-lg disabled:opacity-50"
//           disabled={!selectedCampaign || selectedContacts.length === 0 || loading || !templateName}
//           onClick={handleBulkSend}
//         >
//           {loading ? "Sending..." : "Send Bulk Messages"}
//         </button>
//       </div>
//       {messageStatus && <div className="mt-6 text-blue-600 text-center font-medium">{messageStatus}</div>}
//     </div>
//   );
// }







// WHATSAPP BUSINESS API SETUP




// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function SendCampaignMessagePage() {
//   const { user } = useAuth();
//   const [campaigns, setCampaigns] = useState<any[]>([]);
//   const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
//   const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
//   const [messageStatus, setMessageStatus] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [templateName, setTemplateName] = useState<string>("");
//   const [isReply, setIsReply] = useState<boolean>(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const optInLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID}?text=OPTIN`;

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (!user) return;
//       try {
//         const res = await fetch("/api/campaigns", {
//           headers: { Authorization: user.token ? `Bearer ${user.token}` : "" },
//         });
//         if (!res.ok) throw new Error("Failed to fetch campaigns");
//         const data = await res.json();
//         setCampaigns(data.campaigns || []);
//       } catch (err: any) {
//         setMessageStatus(err.message || "Error fetching campaigns");
//       }
//     };
//     fetchCampaigns();
//   }, [user]);

//   useEffect(() => {
//     if (campaigns.length && searchParams?.get("campaignId")) {
//       const camp = campaigns.find(
//         (c) => c._id === searchParams.get("campaignId") || c.id === searchParams.get("campaignId")
//       );
//       if (camp) {
//         setSelectedCampaign(camp);
//         setSelectedContacts(camp.contacts || []);
//         setTemplateName(camp.templateName || "");
//       }
//     }
//   }, [campaigns, searchParams]);

//   const getMediaType = (url: string): "image" | "video" | "text" => {
//     if (!url) return "text";
//     const extension = url.split(".").pop()?.toLowerCase();
//     if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return "image";
//     if (["mp4", "mov", "avi"].includes(extension || "")) return "video";
//     return "text";
//   };

//   const isValidMediaUrl = (url: string): boolean => {
//     if (!url) return true;
//     return /^https?:\/\//.test(url);
//   };

//   const handleSend = async () => {
//     if (!selectedCampaign || selectedContacts.length !== 1 || (!templateName && !isReply)) {
//       setMessageStatus("Please select a campaign, one contact, and a template (or reply mode)");
//       return;
//     }
//     if (selectedCampaign.mediaUrl && !isValidMediaUrl(selectedCampaign.mediaUrl)) {
//       setMessageStatus("Invalid media URL: Must be a valid HTTP/HTTPS URL");
//       return;
//     }
//     setLoading(true);
//     setMessageStatus("");
//     try {
//       const parameters = selectedCampaign.message ? [selectedContacts[0], selectedCampaign.message] : undefined;
//       const res = await fetch("/api/whatsapp/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: user.token ? `Bearer ${user.token}` : "",
//         },
//         body: JSON.stringify({
//           to: selectedContacts[0],
//           templateName: isReply ? undefined : templateName,
//           parameters,
//           mediaUrl: selectedCampaign.mediaUrl || "",
//           isReply,
//           message: isReply ? selectedCampaign.message : undefined,
//         }),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to send message");
//       }
//       setMessageStatus("WhatsApp message sent successfully!");
//     } catch (err: any) {
//       setMessageStatus(
//         err.message.includes("131030")
//           ? `Recipient not opted in. Share this link with them: ${optInLink}`
//           : err.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkSend = async () => {
//     if (!selectedCampaign || selectedContacts.length === 0 || (!templateName && !isReply)) {
//       setMessageStatus("Please select a campaign, contacts, and a template (or reply mode)");
//       return;
//     }
//     if (selectedCampaign.mediaUrl && !isValidMediaUrl(selectedCampaign.mediaUrl)) {
//       setMessageStatus("Invalid media URL: Must be a valid HTTP/HTTPS URL");
//       return;
//     }
//     setLoading(true);
//     setMessageStatus("");
//     try {
//       const parameters = selectedContacts.map((contact) => [contact, selectedCampaign.message]);
//       const res = await fetch("/api/whatsapp/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: user.token ? `Bearer ${user.token}` : "",
//         },
//         body: JSON.stringify({
//           to: selectedContacts,
//           templateName: isReply ? undefined : templateName,
//           parameters,
//           mediaUrl: selectedCampaign.mediaUrl || "",
//           isReply,
//           message: isReply ? selectedCampaign.message : undefined,
//           bulk: true,
//         }),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Failed to send messages");
//       }
//       const data = await res.json();
//       setMessageStatus(`Bulk WhatsApp messages processed: ${data.sent} sent, ${data.failed} failed`);
//     } catch (err: any) {
//       setMessageStatus(
//         err.message.includes("131030")
//           ? `Some recipients not opted in. Share this link with them: ${optInLink}`
//           : err.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-xl mx-auto mt-10 p-8">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Send WhatsApp Message</h1>
//       <div className="mb-6">
//         <label className="block mb-2 font-medium text-gray-700">Message Type</label>
//         <select
//           value={isReply ? "reply" : "template"}
//           onChange={(e) => setIsReply(e.target.value === "reply")}
//           className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value="template">Template (Marketing/Notifications)</option>
//           <option value="reply">Reply (Within 24hr of User Message)</option>
//         </select>
//         <p className="text-sm text-gray-500 mt-1">
//           Recipients must opt-in by messaging your WhatsApp number: <a href={optInLink} className="text-blue-600" target="_blank">Click here to opt-in</a>
//         </p>
//       </div>
//       {!isReply && (
//         <div className="mb-6">
//           <label className="block mb-2 font-medium text-gray-700">WhatsApp Template</label>
//           <input
//             type="text"
//             value={templateName}
//             onChange={(e) => setTemplateName(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             placeholder="Enter approved template name (e.g., hello_world)"
//             required
//           />
//         </div>
//       )}
//       <div className="mb-6">
//         <label className="block mb-2 font-medium text-gray-700">Select Campaign</label>
//         <select
//           className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           value={selectedCampaign?._id || selectedCampaign?.id || ""}
//           onChange={(e) => {
//             const camp = campaigns.find((c) => c._id === e.target.value || c.id === e.target.value);
//             setSelectedCampaign(camp || null);
//             setSelectedContacts(camp?.contacts || []);
//             setTemplateName(camp?.templateName || "");
//           }}
//         >
//           <option value="">-- Select --</option>
//           {campaigns.map((c) => (
//             <option key={c._id || c.id} value={c._id || c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       {selectedCampaign && (
//         <>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-gray-700">Message Preview</label>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-gray-800">{selectedCampaign.message}</p>
//               {selectedCampaign.mediaUrl && (
//                 <div className="mt-2">
//                   {getMediaType(selectedCampaign.mediaUrl) === "image" && (
//                     <img src={selectedCampaign.mediaUrl} alt="Media" className="max-w-full h-auto rounded" />
//                   )}
//                   {getMediaType(selectedCampaign.mediaUrl) === "video" && (
//                     <video src={selectedCampaign.mediaUrl} controls className="max-w-full h-auto rounded" />
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-gray-700">
//               Select Contacts ({selectedContacts.length} selected)
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
//               {selectedCampaign.contacts?.map((contact: string) => (
//                 <label
//                   key={contact}
//                   className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                     selectedContacts.includes(contact)
//                       ? "bg-green-50 border-green-500"
//                       : "bg-white border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedContacts.includes(contact)}
//                     onChange={(e) => {
//                       if (e.target.checked) setSelectedContacts([...selectedContacts, contact]);
//                       else setSelectedContacts(selectedContacts.filter((c) => c !== contact));
//                     }}
//                     className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                   />
//                   <span className="ml-3 text-sm text-gray-900">{contact}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//       <div className="flex gap-4">
//         <button
//           className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow hover:from-green-700 hover:to-green-800 transition-all w-full font-semibold text-lg disabled:opacity-50"
//           disabled={!selectedCampaign || selectedContacts.length !== 1 || loading || (!templateName && !isReply)}
//           onClick={handleSend}
//         >
//           {loading ? "Sending..." : "Send Single Message"}
//         </button>
//         <button
//           className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition-all w-full font-semibold text-lg disabled:opacity-50"
//           disabled={!selectedCampaign || selectedContacts.length === 0 || loading || (!templateName && !isReply)}
//           onClick={handleBulkSend}
//         >
//           {loading ? "Sending..." : "Send Bulk Messages"}
//         </button>
//       </div>
//       {messageStatus && <div className="mt-6 text-blue-600 text-center font-medium">{messageStatus}</div>}
//     </div>
//   );
// }