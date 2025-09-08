export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'sample@gmail.com', password: '123', role: 'user', fast2smsApiKey: 'mock-api-key', creditBalance: 1000 },
  { id: '2', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin', fast2smsApiKey: 'mock-api-key', creditBalance: 5000 },
]

export const mockCampaigns = [
  { id: '1', userId: '1', name: 'Promo Campaign', message: 'Get 20% off!', mediaUrl: '', ctaButtons: [{ type: 'Visit Now', value: 'https://example.com' }], contacts: ['1234567890', '0987654321'], schedule: null, status: 'sent', creditsEstimated: 2, creditsUsed: 2 },
  { id: '2', userId: '1', name: 'Reminder Campaign', message: 'Event tomorrow!', mediaUrl: '/sample.jpg', ctaButtons: [], contacts: ['1234567890'], schedule: new Date(), status: 'pending', creditsEstimated: 2, creditsUsed: 0 },
]

export const mockContacts = [
  { id: '1', userId: '1', name: 'Alice', number: '1234567890', group: 'Leads' },
  { id: '2', userId: '1', name: 'Bob', number: '0987654321', group: 'Customers' },
]

export const mockGroups = [
  { id: '1', userId: '1', name: 'Leads', contactIds: ['1'] },
  { id: '2', userId: '1', name: 'Customers', contactIds: ['2'] },
]

export const mockReports = [
  { id: '1', campaignId: '1', delivered: 2, failed: 0, pending: 0, date: new Date() },
]

export const mockTickets = [
  { id: '1', userId: '1', issue: 'Campaign not sent', status: 'open', response: '' },
]