import GroupForm from '../../../../components/contacts/GroupForm'
import { mockGroups } from '../../../../lib/mockData'

export default function EditGroupPage({ params }: { params: { id: string } }) {
  const group = mockGroups.find(g => g.id === params.id)
  return <GroupForm group={group} />
}