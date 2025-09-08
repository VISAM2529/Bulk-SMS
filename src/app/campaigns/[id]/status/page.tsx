import CampaignStatus from '../../../components/campaigns/CampaignStatus'
import { mockCampaigns } from '../../../lib/mockData'

export default function CampaignStatusPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  return <CampaignStatus campaign={campaign || {}} />
}