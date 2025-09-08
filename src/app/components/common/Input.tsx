export default function Input({ value, onChange, type = 'text', placeholder, className = '' }: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, className?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded w-full ${className}`}
    />
  )
}