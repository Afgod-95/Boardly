import React from 'react'
import { Input } from '@/components/ui/input'
import { Search  } from 'lucide-react'
const CollageSearchBar = () => {
  return (
      <div className="relative">
          <Input
              id="collaborators"
              placeholder="Search ideas for collages"
              className="rounded-xl border-muted-foreground/20 pl-10 h-11"
              
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
      </div>
  )
}

export default CollageSearchBar