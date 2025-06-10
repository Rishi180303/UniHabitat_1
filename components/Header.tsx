import Link from 'next/link'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
          UniHabitat
        </Link>
        
        <Navigation />
        <MobileMenu />
      </div>
    </header>
  )
} 