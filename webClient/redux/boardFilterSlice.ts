import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  PinsFilterView,
  BoardsFilterView,
  CollagesFilterView,
  BoardsSortBy
} from '@/types/board'

interface FilterState {
  pins: {
    activeFilter: PinsFilterView
  }
  boards: {
    activeFilter: BoardsFilterView
    sortBy: BoardsSortBy
  }
  collages: {
    activeFilter: CollagesFilterView
  }
}

const initialState: FilterState = {
  pins: { activeFilter: null },
  boards: { 
    activeFilter: null,
    sortBy: "A-Z"
  },
  collages: { activeFilter: null },
}

const boardFilterSlice = createSlice({
  name: 'boardFilter',
  initialState,
  reducers: {
    setPinsFilter: (state, action: PayloadAction<PinsFilterView>) => {
      state.pins ??= { activeFilter: null }
      state.pins.activeFilter = action.payload
    },

    setBoardsFilter: (state, action: PayloadAction<BoardsFilterView>) => {
      state.boards ??= { 
        activeFilter: null,
        sortBy: "A-Z"
      }
      state.boards.activeFilter = action.payload
    },

   
    setBoardsSortBy: (state, action: PayloadAction<BoardsSortBy>) => {
      state.boards ??= {
        activeFilter: null,
        sortBy: "A-Z",
      }
      state.boards.sortBy = action.payload
    },

    setCollagesFilter: (state, action: PayloadAction<CollagesFilterView>) => {
      state.collages ??= { activeFilter: null }
      state.collages.activeFilter = action.payload
    },

    clearAllFilters: (state) => {
      state.pins.activeFilter = null
      state.boards.activeFilter = null
      state.collages.activeFilter = null
      state.boards.sortBy = "A-Z"
    },
  },
})

export const {
  setPinsFilter,
  setBoardsFilter,
  setBoardsSortBy, 
  setCollagesFilter,
  clearAllFilters,
} = boardFilterSlice.actions

export default boardFilterSlice.reducer
