export default function CampaignStatus({ campaign }: { campaign: any }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Campaign Status</h2>
      <p>Name: {campaign.name}</p>
      <p>Status: {campaign.status}</p>
      <p>Credits Used: {campaign.creditsUsed}</p>
    </div>
  )
}