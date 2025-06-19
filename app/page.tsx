'use client'

import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'
import AuthError from '../components/AuthError'
import { motion } from "framer-motion"
import { useAuth } from '../components/auth-provider'

export default function Home() {
  const { user, loading } = useAuth()

  console.log('Home page rendering:', { user, loading })

  return (
    <main className="min-h-screen bg-[#FDF6ED]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
      </motion.div>

      <AuthError />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Features />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Footer />
      </motion.div>
    </main>
  )
} 