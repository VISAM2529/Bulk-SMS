import Table from '../common/Table'
import { mockTickets } from '../../lib/mockData'

export default function SupportTickets() {
  const headers = ['User ID', 'Issue', 'Status', 'Actions']
  const renderRow = (ticket: any) => (
    <tr key={ticket.id}>
      <td className="border p-2">{ticket.userId}</td>
      <td className="border p-2">{ticket.issue}</td>
      <td className="border p-2">{ticket.status}</td>
      <td className="border p-2">
        <button onClick={() => alert('Response sent (simulated)')} className="text-blue-500">Respond</button>
      </td>
    </tr>
  )

  return <Table headers={headers} data={mockTickets} renderRow={renderRow} />
}