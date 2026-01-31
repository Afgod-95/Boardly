import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SearchItem, SearchState } from "@/webClient/types/search"
import { nanoid } from "nanoid"

const initialState: SearchState = {
  searchValue: "",
  suggestions: [],
  recentSearches: [],
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload
    },

    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim()
      if (!term) return

      const newSearch: SearchItem = {
        id: nanoid(),
        term,
        timestamp: Date.now(),
      }

      state.recentSearches = [
        newSearch,
        ...state.recentSearches.filter(
          (item) => item.term.toLowerCase() !== term.toLowerCase()
        ),
      ].slice(0, 5)
    },

    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        (item) => item.id !== action.payload
      )
    },

    clearAllRecentSearches: (state) => {
      state.recentSearches = []
    },
  },
})

export const {
  setSearchValue,
  addRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches,
} = searchSlice.actions

export default searchSlice.reducer
