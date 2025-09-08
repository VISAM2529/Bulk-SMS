import CampaignForm from '../../../components/campaigns/CampaignForm'
import { mockCampaigns } from '../../../lib/mockData'

interface EditCampaignPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = await params
  const campaign = mockCampaigns.find(c => c.id === id)

  return <CampaignForm campaign={campaign} />
}
