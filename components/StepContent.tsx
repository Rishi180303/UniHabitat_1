import { Search, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RenterStep1() {
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">
        All UniHabitat listings are from verified students with .edu emails 🔒 and it's easy to filter by location, move-in date, and property type
      </p>

      {/* Search Interface Mockup */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter university or city"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Move-in Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Roommates</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent">
                <option>Looking for roommates</option>
                <option>Have roommates</option>
                <option>No roommates</option>
              </select>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-[#2C3E50] hover:bg-[#34495E]">
          Search Listings
        </Button>
      </div>

      {/* Browse Listings Preview */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🏠</div>
                <div className="text-sm">Browse Listings</div>
              </div>
            </div>
            {i === 1 && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ListerStep1() {
  return (
    <div className="space-y-8">
      <p className="text-gray-600 text-lg">
        UniHabitat will instantly notify students looking for housing near your campus
      </p>

      {/* Notification Preview */}
      <div className="inline-block bg-[#2C3E50] text-white px-4 py-2 rounded-full text-sm font-medium">
        Students get notified instantly
      </div>

      {/* Student Interest Preview */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {i}
            </div>
            <div>
              <div className="font-medium text-gray-900">Student Interested</div>
              <div className="text-sm text-gray-500">University Student</div>
              <div className="text-sm text-gray-600 mt-1">Looking for housing near campus</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 