import CampaignPreview from '../../../components/campaigns/CampaignPreview'
import { mockCampaigns } from '../../../lib/mockData'

interface CampaignPreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignPreviewPage({ params }: CampaignPreviewPageProps) {
  const { id } = await params
  const campaign = mockCampaigns.find(c => c.id === id)

  return <CampaignPreview campaign={campaign || {}} />
}
