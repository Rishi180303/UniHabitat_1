'use client'

import { motion } from "framer-motion"
import { Star, MapPin, Home, CheckCircle, XCircle } from "lucide-react"

interface Listing {
  id: number
  title: string
  location: string
  price: number
  image: string
  type: string
  available: boolean
  rating: number
}

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Emoji fallback logic
  const emojiList = ['🏠', '🏡', '🏢', '🏘️', '🏙️', '🛏️', '🚪', '🪟', '🛋️', '🌇', '🌆']
  const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)]
  const isValidImage = (url: string | undefined) => {
    if (!url) return false
    // Consider URLs that are not empty, not just whitespace, and not a known fallback
    if (url.trim() === '' || url.includes('landingpage.png')) return false
    return true
  }
  const hasImage = isValidImage(listing.image)

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-80 flex flex-col z-10 p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        {hasImage ? (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-4xl select-none">{randomEmoji}</span>
        )}
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
          <Home size={16} />
          {listing.type}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
        {listing.title}
      </h3>
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
        <MapPin size={16} />
        <span className="line-clamp-1">{listing.location}</span>
      </div>
      <div className="text-xl font-bold text-gray-900 mt-2">
        ${listing.price}
        <span className="text-sm font-normal text-gray-600">/month</span>
      </div>
    </motion.div>
  )
} 