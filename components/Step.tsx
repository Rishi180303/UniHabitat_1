interface StepProps {
  number: number
  title: string
  children: React.ReactNode
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="relative pl-20">
      {/* Number Circle */}
      <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-2xl font-bold">
        {number}
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#2C3E50]">{title}</h3>
        {children}
      </div>
    </div>
  )
} 