import CampaignStatus from '../../../components/campaigns/CampaignStatus'
import { mockCampaigns } from '../../../lib/mockData'

interface CampaignStatusPageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignStatusPage({ params }: CampaignStatusPageProps) {
  const { id } = await params
  const campaign = mockCampaigns.find(c => c.id === id)

  return <CampaignStatus campaign={campaign || {}} />
}
