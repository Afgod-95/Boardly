'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { pressedButtons } from '@/lib/animations/pressedButtons'

const BackButton = () => {
  const router = useRouter()

  return (
    <motion.button 
      onClick={() => router.back()}
      className={clsx(
        'flex items-center justify-center',
        'w-12 h-12 cursor-pointer bg-accent hover:bg-muted rounded-2xl transition-colors' 
      )}
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
      transition={{ ...pressedButtons.transition }}
    >
      <ArrowLeft size={24} strokeWidth={2.5} />
    </motion.button>
  )
}

export default BackButton