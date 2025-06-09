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
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
    </div>
  )
} 