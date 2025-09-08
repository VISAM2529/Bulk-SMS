import CampaignForm from '../../../components/campaigns/CampaignForm'
import { mockCampaigns } from '../../../lib/mockData'

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  return <CampaignForm campaign={campaign} />
}