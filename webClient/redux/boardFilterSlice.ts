import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  PinsFilterView,
  BoardsFilterView,
  CollagesFilterView,
} from '@/types/board'

interface FilterState {
  pins: {
    activeFilter: PinsFilterView
  }
  boards: {
    activeFilter: BoardsFilterView
  }
  collages: {
    activeFilter: CollagesFilterView
  }
}

const initialState: FilterState = {
  pins: { activeFilter: null },
  boards: { activeFilter: null },
  collages: { activeFilter: null },
}

const boardFilterSlice = createSlice({
  name: 'boardFilter',
  initialState,
  reducers: {
    setPinsFilter: (state, action: PayloadAction<PinsFilterView>) => {
      // defend against bad persisted state
      state.pins ??= { activeFilter: null }
      state.pins.activeFilter = action.payload
    },

    setBoardsFilter: (state, action: PayloadAction<BoardsFilterView>) => {
      // defend against bad persisted state
      state.boards ??= { activeFilter: null }
      state.boards.activeFilter = action.payload
    },

    setCollagesFilter: (state, action: PayloadAction<CollagesFilterView>) => {
      //defend against bad persisted state
      state.collages ??= { activeFilter: null }
      state.collages.activeFilter = action.payload
    },

    clearAllFilters: (state) => {
      state.pins ??= { activeFilter: null }
      state.boards ??= { activeFilter: null }
      state.collages ??= { activeFilter: null }

      state.pins.activeFilter = null
      state.boards.activeFilter = null
      state.collages.activeFilter = null
    },
  },
})

export const {
  setPinsFilter,
  setBoardsFilter,
  setCollagesFilter,
  clearAllFilters,
} = boardFilterSlice.actions

export default boardFilterSlice.reducer
