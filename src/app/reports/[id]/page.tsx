import ReportDetails from '../../components/reports/ReportDetails'
import { mockReports } from '../../lib/mockData'

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const report = mockReports.find(r => r.id === params.id)
  
  if (!report) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-4">The requested report could not be found.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <ReportDetails report={report} />
}