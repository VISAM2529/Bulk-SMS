import Table from '../common/Table'
import { mockUsers } from '../../lib/mockData'

export default function UserManagement() {
  const headers = ['Name', 'Email', 'Status', 'Actions']
  const renderRow = (user: any) => (
    <tr key={user.id}>
      <td className="border p-2">{user.name}</td>
      <td className="border p-2">{user.email}</td>
      <td className="border p-2">{user.role}</td>
      <td className="border p-2">
        <button onClick={() => alert('User suspended (simulated)')} className="text-blue-500">Suspend</button>
      </td>
    </tr>
  )

  return <Table headers={headers} data={mockUsers} renderRow={renderRow} />
}