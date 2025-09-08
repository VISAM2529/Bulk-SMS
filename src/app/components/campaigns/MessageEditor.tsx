export default function MessageEditor({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Enter your message"
      className="border p-2 rounded w-full mt-2"
      rows={5}
    />
  )
}