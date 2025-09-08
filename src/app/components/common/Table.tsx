export default function Table({ headers, data, renderRow }: { headers: string[], data: any[], renderRow: (item: any) => React.ReactNode }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          {headers.map(header => <th key={header} className="border p-2">{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(item => renderRow(item))}
      </tbody>
    </table>
  )
}