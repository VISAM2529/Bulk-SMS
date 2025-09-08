"use client"
export default function Charts({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Campaign Performance</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          View detailed reports
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="h-80 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex flex-col items-center justify-center p-6 border border-gray-200">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-600 text-center mb-2">Analytics visualization will appear here</p>
        <p className="text-sm text-gray-500 text-center">Connected to your campaign performance data</p>
      </div>
      
      <div className="mt-6 flex justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Messages Sent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Successful Deliveries</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Response Rate</span>
        </div>
      </div>
    </div>
  )
}