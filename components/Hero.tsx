import { Button } from "@/components/ui/button"
import Link from "next/link"
import HeroBackground from "./HeroBackground"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <HeroBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-800">
            Find Your Next Home{" "}
            <span className="text-[#2C3E50]">on Campus</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            The safest way for students to find off-campus housing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#2C3E50] text-white hover:bg-[#34495E] transition-all duration-300 px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl"
            >
              Find Your Home
            </Button>
            
            <Button 
              size="lg" 
              className="bg-white text-[#2C3E50] hover:bg-gray-50 transition-all duration-300 px-8 py-6 text-lg font-medium border border-[#2C3E50]/20"
            >
              List Your Unit
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 