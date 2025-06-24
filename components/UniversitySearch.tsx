'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface University {
  name: string
  country: string
  domains: string[]
  web_pages: string[]
}

interface UniversitySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onDropdownOpenChange?: (open: boolean) => void
}

export default function UniversitySearch({ 
  value, 
  onChange, 
  placeholder = "Search for your university...",
  className = "",
  onDropdownOpenChange
}: UniversitySearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const portalDropdownRef = useRef<HTMLDivElement>(null)

  // Use a CORS proxy to avoid mixed content/CORS issues in browsers
  const CORS_PROXY = 'https://corsproxy.io/?';

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (search: string) => {
      if (!search.trim() || search.length < 2) {
        setUniversities([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          CORS_PROXY + encodeURIComponent(`http://universities.hipolabs.com/search?name=${encodeURIComponent(search)}`)
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch universities')
        }

        const data = await response.json()
        setUniversities(data.slice(0, 10)) // Limit to 10 results
      } catch (err) {
        setError('Failed to load universities. Please try again.')
        setUniversities([])
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setIsTyping(true)
    setSelectedIndex(-1)
    
    if (newValue.trim()) {
      debouncedSearch(newValue)
    } else {
      setUniversities([])
      setLoading(false)
    }
  }

  // Handle university selection
  const handleSelectUniversity = (university: University) => {
    onChange(university.name)
    setSearchTerm(university.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    setIsTyping(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key === 'ArrowDown') {
      e.preventDefault()
      setIsOpen(true)
      return
    }

    if (isOpen) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < universities.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && universities[selectedIndex]) {
            handleSelectUniversity(universities[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    }
  }

  // Handle input focus
  const handleFocus = () => {
    if (searchTerm.trim() && universities.length > 0) {
      setIsOpen(true)
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        (dropdownRef.current && dropdownRef.current.contains(target)) ||
        (inputRef.current && inputRef.current.contains(target)) ||
        (portalDropdownRef.current && portalDropdownRef.current.contains(target))
      ) {
        // Click is inside the dropdown or input, do not close
        return
      }
      setIsOpen(false)
      setSelectedIndex(-1)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Initialize search term with current value
  useEffect(() => {
    if (value && !isTyping) {
      setSearchTerm(value)
    }
  }, [value, isTyping])

  // Call onDropdownOpenChange when dropdown state changes
  useEffect(() => {
    if (typeof onDropdownOpenChange === 'function') {
      onDropdownOpenChange(isOpen)
    }
  }, [isOpen, onDropdownOpenChange])

  // Update dropdown position when open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    } else {
      setDropdownPosition(null)
    }
  }, [isOpen, searchTerm, universities.length])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          )}
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Portal Dropdown */}
      {typeof window !== 'undefined' && dropdownPosition && isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={portalDropdownRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="z-[1000] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-y-auto max-h-64 ring-1 ring-black/5 focus:outline-none scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                boxShadow: '0 8px 32px 0 rgba(60,60,60,0.12), 0 1.5px 6px 0 rgba(60,60,60,0.08)',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {error && (
                <div className="p-3 text-sm text-red-600 border-b border-slate-100">
                  {error}
                </div>
              )}
              {loading && (
                <div className="p-3 text-sm text-slate-600 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching universities...</span>
                </div>
              )}
              {!loading && !error && universities.length === 0 && searchTerm.length >= 2 && (
                <div className="p-3 text-sm text-slate-600">
                  No universities found. Try a different search term.
                </div>
              )}
              {universities.map((university, index) => (
                <button
                  key={`${university.name}-${university.country}`}
                  onClick={() => handleSelectUniversity(university)}
                  className={`w-full p-3 text-left transition-colors rounded-xl flex flex-col items-start ${
                    index === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'
                  } ${index < universities.length - 1 ? 'border-b border-slate-100' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="font-medium text-slate-900">{university.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{university.country}</div>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      }
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 