import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// 1. Updated Suggestion Card: Bigger padding, larger text, taller presence
const SuggestionIdeasCard = () => {
  const suggestions = ["Home Decor", "DIY Projects", "Interior Design", "Minimalist", "Architecture", "Color Palettes", "Sustainable Living", "Modern Art"];
  
  return (
    // Increased padding (p-8) and added a min-height to ensure it fills space
    <Card className="mb-6 p-8 shadow-none rounded-[32px] break-inside-avoid flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-5 text-gray-800">
        <h3 className="font-bold text-xl">More to explore</h3>
      </div>
      
      {/* Increased vertical gap between tags */}
      <div className="flex flex-wrap gap-3">
        {suggestions.map((tag) => (
          <span 
            key={tag} 
            // Larger py-3 for taller buttons
            className="px-5 py-3 bg-muted rounded-full text-sm font-semibold text-gray-600  hover:bg-accent cursor-pointer transition-colors border"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer hover:text-gray-900 transition-colors">
        <TrendingUp size={16} />
        <span>See trending ideas</span>
      </div>
    </Card>
  )
}

export default SuggestionIdeasCard