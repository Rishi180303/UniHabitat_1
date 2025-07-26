'use client'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0">
      {/* Background color base */}
      <div className="absolute inset-0 bg-[#FDF6ED]" />
      
      {/* Light beige gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF6ED] via-[#FDF6ED]/95 to-[#FDF6ED]/90" />
    </div>
  )
} 