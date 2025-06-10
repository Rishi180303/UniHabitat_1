'use client'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0">
      {/* Background image with blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          filter: "blur(8px)",
          transform: "scale(1.1)", // Prevent blur edges from showing
        }}
      />
      
      {/* Light beige gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF6ED] via-[#FDF6ED]/95 to-[#FDF6ED]/90" />
    </div>
  )
} 