import { mockUsers, mockCampaigns, mockTickets } from '../../lib/mockData'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Users</h3>
          <p>{mockUsers.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Campaigns</h3>
          <p>{mockCampaigns.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Open Tickets</h3>
          <p>{mockTickets.filter(t => t.status === 'open').length}</p>
        </div>
      </div>
    </div>
  )
}