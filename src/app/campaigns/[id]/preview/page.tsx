import CampaignPreview from '../../../components/campaigns/CampaignPreview'
import { mockCampaigns } from '../../../lib/mockData'

export default function CampaignPreviewPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  return <CampaignPreview campaign={campaign || {}} />
}