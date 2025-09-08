export default function MediaUpload({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <div className="mt-2">
      <input
        type="file"
        onChange={() => onUpload('/sample.jpg')} // Simulated upload
        className="border p-2"
      />
    </div>
  )
}