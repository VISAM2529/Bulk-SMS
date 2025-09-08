import GroupForm from '../../../../components/contacts/GroupForm'
import { mockGroups } from '../../../../lib/mockData'

interface EditGroupPageProps {
  params: Promise<{ id: string }>
}

export default async function EditGroupPage({ params }: EditGroupPageProps) {
  const { id } = await params
  const group = mockGroups.find(g => g.id === id)

  return <GroupForm group={group} />
}
