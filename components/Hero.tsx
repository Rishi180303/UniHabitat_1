'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import HeroBackground from "./HeroBackground"
import AuthModal from "./AuthModal"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Plus, X, Users, Clock, Shield, MessageCircle, Sparkles } from "lucide-react"

interface Card {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  bgColor: string
  iconBgColor: string
  iconColor: string
  textColor: string
}

const cards: Card[] = [
  {
    id: "students",
    title: "Real Students, Real Homes",
    icon: <Users className="w-10 h-10" />,
    description:
      "Every listing comes from a fellow student, so you know you're connecting with people who understand your needs and campus life. This ensures a trustworthy and relatable experience for finding your next home.",
    bgColor: "bg-white",
    iconBgColor: "bg-slate-200",
    iconColor: "text-slate-600",
    textColor: "text-slate-800",
  },
  {
    id: "minutes",
    title: "List or Find in Minutes",
    icon: <Clock className="w-10 h-10" />,
    description:
      "Our streamlined process allows you to post your room or find your perfect match in just a few minutes. No complicated forms, just quick and efficient results.",
    bgColor: "bg-white",
    iconBgColor: "bg-slate-200",
    iconColor: "text-slate-600",
    textColor: "text-slate-800",
  },
  {
    id: "details",
    title: "Details That Matter",
    icon: <Shield className="w-10 h-10" />,
    description:
      "We provide comprehensive profiles and verified information, ensuring you have all the crucial details before making any decisions. Transparency is key to a good match.",
    bgColor: "bg-white",
    iconBgColor: "bg-slate-200",
    iconColor: "text-slate-600",
    textColor: "text-slate-800",
  },
  {
    id: "messaging",
    title: "In-App Messaging",
    icon: <MessageCircle className="w-10 h-10" />,
    description:
      "Communicate directly and securely with potential roommates and landlords through our integrated messaging system. Keep your personal contact information private until you're ready.",
    bgColor: "bg-slate-800",
    iconBgColor: "bg-slate-700",
    iconColor: "text-slate-300",
    textColor: "text-white",
  },
  {
    id: "matching",
    title: "Smart Matching",
    icon: <Sparkles className="w-10 h-10" />,
    description:
      "Our intelligent algorithm connects you with compatible roommates and suitable housing options based on your preferences, lifestyle, and academic needs. Find your ideal living situation effortlessly.",
    bgColor: "bg-slate-800",
    iconBgColor: "bg-slate-700",
    iconColor: "text-slate-300",
    textColor: "text-white",
  },
]

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const { user } = useAuth()

  // Scroll progress for parallax effect
  const { scrollY } = useScroll()
  const imageScale = useTransform(scrollY, [0, 500], [1.3, 1])
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const imageY = useTransform(scrollY, [0, 500], [0, 50])

  const handleOpenAuthModal = async () => {
    // Check if user is already logged in
    if (user) {
      // If logged in, redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    // For now, default to signup mode
    // In a real app, you might want to check if the email exists
    // but for simplicity, we'll let users choose signin/signup
    setAuthMode('signup')
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center hero-bg-pattern py-20">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Main Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 mt-32"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-[#2C3E50] leading-tight flex flex-col items-center">
              <span className="block">Find student housing</span>
              <span className="block relative mt-3">
                <span className="text-[#34495E]">from real students</span>
                <motion.span
                  layoutId="underline"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute left-0 -bottom-1 h-1 bg-[#34495E] rounded-full"
                  style={{ width: '100%' }}
                />
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl md:text-3xl text-gray-700 mb-16 max-w-3xl mx-auto font-medium"
          >
            The safest way to find and list off-campus housing near your university
          </motion.p>
      
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          >
            <Button 
              size="lg" 
              className="bg-[#2C3E50] text-white hover:bg-[#34495E] transition-all duration-300 text-lg px-8 py-4"
              onClick={handleOpenAuthModal}
            >
              Find Your Home
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-[#2C3E50] border-[#2C3E50]/20 hover:bg-[#FDF6ED] hover:text-[#34495E] transition-all duration-300 text-lg px-8 py-4"
              onClick={() => {
                if (user) {
                  window.location.href = '/dashboard/list'
                } else {
                  setAuthMode('signup')
                  setIsAuthModalOpen(true)
                }
              }}
            >
              List Your Unit
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <div className="w-full max-w-7xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`relative rounded-2xl p-4 shadow-md transition-all duration-500 ease-in-out ${card.bgColor} ${
                    expandedCard === card.id ? "col-span-full lg:col-span-2" : "col-span-1"
                  }`}
                >
                  {/* Plus/Close button */}
                  <button
                    onClick={() => toggleCard(card.id)}
                    className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center border border-blue-500 bg-white text-blue-500 transition-colors duration-200 ease-in-out hover:bg-blue-50`}
                    aria-expanded={expandedCard === card.id}
                    aria-controls={`card-content-${card.id}`}
                  >
                    {expandedCard === card.id ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>

                  {/* Card Content */}
                  <div
                    className={`flex ${
                      expandedCard === card.id ? "flex-col sm:flex-row items-start" : "flex-col items-center text-center"
                    } gap-3`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconBgColor} ${card.iconColor} flex-shrink-0`}
                    >
                      {card.icon}
                    </div>

                    <div className="flex flex-col">
                      {/* Title */}
                      <h3
                        className={`font-semibold ${card.textColor} ${
                          expandedCard === card.id ? "text-lg text-left" : "text-base text-center"
                        }`}
                      >
                        {card.title}
                      </h3>

                      {/* Expandable content with symmetrical sideways animation */}
                      <div
                        id={`card-content-${card.id}`}
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          expandedCard === card.id ? "max-h-96 mt-2" : "max-h-0"
                        }`}
                      >
                        <p
                          className={`leading-relaxed text-sm ${card.textColor} text-left transition-transform duration-500 ease-in-out ${
                            expandedCard === card.id ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </section>
  )
} 