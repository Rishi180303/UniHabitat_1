'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle, X } from 'lucide-react'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  listingTitle: string
  isLoading?: boolean
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  listingTitle,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#FDF6ED] rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-[#F5E6D6]">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Delete Listing</h3>
                      <p className="text-[#FDF6ED]/80 text-sm">This action cannot be undone</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-[#2C3E50]/10 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-[#2C3E50]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">
                      Are you sure you want to delete this listing?
                    </h4>
                    <p className="text-[#34495E] mb-4">
                      You're about to permanently delete <span className="font-semibold text-[#2C3E50]">"{listingTitle}"</span>. 
                      This action cannot be undone and the listing will be removed from the platform.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-[#E8D5C4] text-[#34495E] hover:bg-[#F5E6D6] rounded-2xl font-semibold py-3"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onConfirm}
                    className="flex-1 bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white rounded-2xl font-semibold py-3 hover:from-[#34495E] hover:to-[#2C3E50] shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Listing
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 