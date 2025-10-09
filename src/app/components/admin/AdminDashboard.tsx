import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const [usersRes, campaignsRes, ticketsRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: user.token ? `Bearer ${user.token}` : '' } }),
          fetch('/api/campaigns', { headers: { Authorization: user.token ? `Bearer ${user.token}` : '' } }),
          fetch('/api/admin/tickets', { headers: { Authorization: user.token ? `Bearer ${user.token}` : '' } })
        ]);
        if (!usersRes.ok || !campaignsRes.ok || !ticketsRes.ok) throw new Error('Failed to fetch admin data');
        const usersData = await usersRes.json();
        const campaignsData = await campaignsRes.json();
        const ticketsData = await ticketsRes.json();
        setUsers(usersData.users || []);
        setCampaigns(campaignsData.campaigns || []);
        setTickets(ticketsData.tickets || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Campaigns</h3>
          <p>{campaigns.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Open Tickets</h3>
          <p>{tickets.filter((t: any) => t.status === 'open').length}</p>
        </div>
      </div>
    </div>
  );
}