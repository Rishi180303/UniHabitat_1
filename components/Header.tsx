'use client'

import Link from 'next/link'
import Navigation from './Navigation'
import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import AuthModal from "./AuthModal"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm' : ''}`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            href="/" 
            className="text-2xl font-bold text-[#2C3E50] hover:text-[#34495E] transition-colors"
          >
            UniHabitat
          </Link>
        </motion.div>
        
        <Navigation isScrolled={isScrolled} />
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.header>
  )
} 