'use client'

import Link from 'next/link'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'
import { useEffect, useState } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section')
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        setIsScrolled(heroBottom < 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-[#2C3E50] hover:text-[#34495E]' : 'text-[#2C3E50] hover:text-[#34495E]'
          }`}
        >
          UniHabitat
        </Link>
        
        <Navigation isScrolled={isScrolled} />
        <MobileMenu isScrolled={isScrolled} />
      </div>
    </header>
  )
} 