import Button from '../common/Button'

export default function ReportExport() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Export Report</h2>
      <Button onClick={() => alert('Report exported (simulated)')}>Download CSV</Button>
    </div>
  )
}