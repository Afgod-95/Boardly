export interface SearchItem {
  id: string;
  term: string;
  timestamp: number; // Useful for sorting recents by "newest first"
}

export interface SearchState {
  searchValue: string;
  suggestions: string[]; 
  recentSearches: SearchItem[];
}

//Search Component Props
export interface SearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearRecent: (id: string) => void;
}