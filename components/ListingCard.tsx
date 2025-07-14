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
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-64 h-64 flex flex-col"
    >
      {/* Image or Emoji */}
      <div className="relative h-40 flex-shrink-0 overflow-hidden flex items-center justify-center bg-gray-100">
        {hasImage ? (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl select-none">{randomEmoji}</span>
        )}
        {/* Status badge removed */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Home size={12} />
          {listing.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-2 flex-1 flex flex-col justify-end overflow-hidden min-h-0">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-1">
          {listing.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
          <MapPin size={12} />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-base font-bold text-gray-900">
            ${listing.price}
            <span className="text-xs font-normal text-gray-600">/month</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 