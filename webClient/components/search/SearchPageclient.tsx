"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import PinsGrid from '@/components/pins/grid/PinsGrid'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const SearchPageClient = () => {

    //GET ALL PINS FROM REDUX STORE USING USESELECTOR 
    const { pins } = useSelector((state: RootState) => state.pins)
    const searchParams = useSearchParams()
    const router = useRouter()

    const initialQuery = searchParams.get('q') || ""
    const [query, setQuery] = useState(initialQuery)

    // 1. DEBOUNCED SEARCH LOGIC ALTHOUGH THERE'S A LIBRARY FOR IT
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only update URL if the query is actually different from the URL param
            if (query !== initialQuery) {
                const path = query.trim()
                    ? `/dashboard/search?q=${encodeURIComponent(query)}`
                    : '/dashboard/search'
                router.push(path)
            }
        }, 400) // 400ms is the "sweet spot" for slower machines

        return () => clearTimeout(delayDebounceFn)
    }, [query, router, initialQuery])

    // 2. Clear function just clears state
    const clearSearch = () => {
        setQuery("")
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-gray-100 px-4 py-4">
                <div className="w-full mx-auto flex items-center justify-between gap-4">

                    <form onSubmit={handleFormSubmit} className="relative flex-1 group max-w-6xl ">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                            <Search size={20} />
                        </div>

                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for anything..."
                            className={cn(
                                "w-full h-12 pl-12 pr-12 rounded-full bg-gray-100/50 border-transparent",
                                "focus-visible:ring-4 focus-visible:ring-violet-100 focus-visible:bg-white transition-all",
                                "text-base font-medium shadow-none"
                            )}
                        />

                        <AnimatePresence>
                            {query && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={18} className="text-gray-500" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </form>

                    <Button
                        variant="outline"
                        className="hidden md:flex items-center gap-2 rounded-full h-12 px-6 border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <SlidersHorizontal size={18} />
                        <span className="font-bold">Filters</span>
                    </Button>
                </div>
            </div>

            <main className="max-w-screen-6xl mx-auto p-4 sm:p-8">
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        {initialQuery ? (
                            <span>Results for <span className="text-violet-600">&quot;{initialQuery}&quot;</span></span>
                        ) : (
                            "Explore more"
                        )}
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Showing the best matches for your search</p>
                </header>

                {/* MASONRY GRID PLACEHOLDER */}
                <PinsGrid items={pins} variant='feed' />
            </main>
        </div>
    )
}

export default SearchPageClient