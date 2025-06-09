import Link from 'next/link'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
          UniHabitat
        </Link>
        
        <Navigation />
        <MobileMenu />
      </div>
    </header>
  )
} 