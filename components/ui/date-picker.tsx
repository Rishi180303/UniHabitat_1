'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  label?: string
  className?: string
  type?: 'move-in' | 'move-out'
  minDate?: string
}

// Helper to parse YYYY-MM-DD as local date
function parseLocalDate(str: string): Date {
  const [year, month, day] = str.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export default function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date",
  label,
  className = "",
  type = "move-out",
  minDate
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
  const [inputValue, setInputValue] = useState(value || '')
  const pickerRef = useRef<HTMLDivElement>(null)

  // Auto-select today's date for move-in picker when opened
  useEffect(() => {
    if (type === 'move-in' && !value && isOpen) {
      const today = new Date()
      setSelectedDate(today)
      setInputValue(formatDate(today))
      onChange(today.toISOString().split('T')[0])
    }
  }, [isOpen, type, value, onChange])

  useEffect(() => {
    if (value) {
      const date = parseLocalDate(value)
      setInputValue(formatDate(date))
      setSelectedDate(date)
    } else {
      setInputValue('')
      setSelectedDate(null)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setInputValue(formatDate(date))
    onChange(date.toISOString().split('T')[0])
    setIsOpen(false)
  }

  const handleInputClick = () => {
    setIsOpen(true)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(null)
    setInputValue('')
    onChange('')
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const navigateMonth = (direction: 'prev' | 'next', e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear()
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    if (type === 'move-in') {
      return date < today
    }
    if (type === 'move-out' && minDate) {
      const min = parseLocalDate(minDate)
      min.setHours(0, 0, 0, 0)
      return date <= min
    }
    return date < today
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isCurrentDay = isToday(date)
      const isSelectedDay = isSelected(date)
      const isDisabled = isDateDisabled(date)
      
      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!isDisabled) {
              handleDateSelect(date)
            }
          }}
          className={`
            h-10 w-10 rounded-full text-sm font-medium transition-all duration-200
            ${isSelectedDay
              ? 'bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white shadow-lg'
              : isDisabled
                ? 'text-[#D1C7B7] cursor-not-allowed'
                : 'text-[#34495E] hover:bg-[#F5E6D6] hover:text-[#2C3E50]'
            }
          `}
        >
          {day}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={handleInputClick}
          placeholder={placeholder}
          readOnly
          className="w-full p-4 rounded-2xl border-2 border-white/20 bg-white text-[#2C3E50] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 hover:border-white/40 cursor-pointer"
        />
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-[#F5E6D6] transition-colors mr-2"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <Calendar className="w-4 h-4 text-gray-400 mr-3" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#F5E6D6] p-4 min-w-[280px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#2C3E50]">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => navigateMonth('prev', e)}
                  className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#2C3E50]" />
                </button>
                <button
                  type="button"
                  onClick={(e) => navigateMonth('next', e)}
                  className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-[#2C3E50]" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#BFAE9B]">{day}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 