import React from 'react'
import { Card } from '../ui/card'
import { Search } from 'lucide-react'

const SearchHeader = () => {
  return (
<>
    {/* Search bar (clickable, opens search page/modal) */}
        <Card
            className="flex-row items-center gap-2 h-10 bg-muted/45 rounded-xl border-none px-3 shadow-none max-w-3xl flex-1 cursor-text hover:bg-muted/60 transition"
            onClick={() => console.log("Open search page or modal")}
        >
            <Search className="text-muted-foreground" size={20} />
            <span className="text-muted-foreground select-none">Search</span>
        </Card>
</>
    
  )
}

export default SearchHeader