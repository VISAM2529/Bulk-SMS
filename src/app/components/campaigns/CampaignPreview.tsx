export default function CampaignPreview({ campaign }: { campaign: any }) {
  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl mb-4">Campaign Preview</h2>
      <div className="border p-2 rounded bg-gray-100">
        <p>{campaign.message}</p>
        {campaign.mediaUrl && <img src={campaign.mediaUrl} alt="Media" className="mt-2" />}
        <p>Recipients: {campaign.contacts.join(', ')}</p>
      </div>
    </div>
  )
}