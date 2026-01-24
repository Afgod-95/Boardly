"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const MOCK_RECENT = ["Summer Outfits", "UI Design Trends", "Modern Architecture"]
const MOCK_IDEAS = ["Kitchen Remodel", "Travel Photography", "Healthy Recipes", "Next.js 15 Tutorials"]

const Searchbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle navigation
  const handleSearchRedirect = (searchTerm: string) => {
    setIsOpen(false)
    // Encodes the string to handle spaces/special characters
    router.push(`/dashboard/search?q=${encodeURIComponent(searchTerm)}`)
  }

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative flex-1 max-w-3xl z-50">
      
      {/* 1. THE TRIGGER (Looks like a search bar, acts like a button) */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.99 }} 
        className={cn(
          "flex items-center gap-3 h-12 w-full px-4 rounded-full transition-all border-none outline-none text-left",
          isOpen 
            ? "bg-white shadow-lg ring-4 ring-violet-100" 
            : "bg-muted/45 hover:bg-muted/70"
        )}
      >
        <Search 
          className={cn("transition-colors", isOpen ? "text-violet-600" : "text-muted-foreground")} 
          size={20} 
        />
        <span className="text-sm font-medium text-muted-foreground select-none">
          Search for inspiration...
        </span>
      </motion.button>

      {/* 2. THE DROP_DOWN PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-full left-0 w-full mt-2 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
              
              {/* Recent Searches */}
              <div className="mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
                  Recent searches
                </p>
                <div className="flex flex-col gap-1">
                  {MOCK_RECENT.map((item) => (
                    <SearchItem 
                      key={item} 
                      label={item} 
                      icon={<Clock size={18} />} 
                      onClick={() => handleSearchRedirect(item)}
                    />
                  ))}
                </div>
              </div>

              {/* Ideas / Trending */}
              <div className="mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
                  Ideas for you
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_IDEAS.map((item) => (
                    <SearchItem 
                      key={item} 
                      label={item} 
                      icon={<TrendingUp size={18} />} 
                      isGrid 
                      onClick={() => handleSearchRedirect(item)}
                    />
                  ))}
                </div>
              </div>

            </div>
            
            <div className="bg-gray-50/80 p-4 text-center border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium">
                  Showing top trends in your area
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Internal Helper Component
const SearchItem = ({ 
  label, 
  icon, 
  isGrid = false, 
  onClick 
}: { 
  label: string, 
  icon: React.ReactNode, 
  isGrid?: boolean,
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-2xl transition-all text-left group",
      isGrid && "bg-gray-50/40 hover:bg-gray-100/80 border border-transparent hover:border-gray-200"
    )}
  >
    <div className="text-gray-400 group-hover:text-violet-600 group-hover:scale-110 transition-all">
      {icon}
    </div>
    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
      {label}
    </span>
  </button>
)

export default Searchbar