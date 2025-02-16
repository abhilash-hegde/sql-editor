import { Textarea } from "@/components/ui/textarea"

export default function SQLInput({ value, onChange, onKeyDown }) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Enter your SQL query here..."
      className="font-mono min-h-[100px]"
    />
  )
}


