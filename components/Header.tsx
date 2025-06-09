import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-sky-600">
          UniHabitat
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-sky-600 transition-colors">
            Home
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-sky-600 transition-colors">
            How It Works
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-sky-600 transition-colors">
            Contact
          </Link>
          <Button className="bg-sky-600 hover:bg-sky-700">
            Sign In
          </Button>
        </nav>

        <Button variant="ghost" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  )
} 