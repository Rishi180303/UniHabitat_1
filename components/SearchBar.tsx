import { SlidersHorizontal, Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="flex items-center bg-white rounded-full shadow-md px-6 py-3 max-w-3xl w-full">
        {/* Location */}
        <div className="flex items-center min-w-[180px]">
          <SlidersHorizontal className="h-7 w-7 text-gray-300 mr-4" />
          <div>
            <div className="text-xs font-medium text-gray-500">Location</div>
            <div className="text-base font-semibold text-[#222]">New York, NY, USA</div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-8 h-8 w-px bg-gray-100" />

        {/* Move-in */}
        <div className="flex-1 min-w-[120px]">
          <div className="text-xs font-medium text-gray-500">Move-in</div>
          <div className="text-base text-gray-400">Add move-in</div>
        </div>

        {/* Divider */}
        <div className="mx-8 h-8 w-px bg-gray-100" />

        {/* Move-out */}
        <div className="flex-1 min-w-[120px]">
          <div className="text-xs font-medium text-gray-500">Move-out</div>
          <div className="text-base text-gray-400">Add move-out</div>
        </div>

        {/* Search Button */}
        <button className="ml-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 h-12 w-12 shadow-lg hover:scale-105 transition-transform">
          <Search className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  )
} 