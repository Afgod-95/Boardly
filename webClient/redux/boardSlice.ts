import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BoardItem } from "@/types/board"

interface InitialBoardsState {
  boards: BoardItem[]
}

const initialState: InitialBoardsState = {
  boards: [],
}

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<BoardItem[]>) => {
      state.boards = action.payload
    },

    createBoard: (state, action: PayloadAction<BoardItem>) => {
      state.boards.push(action.payload)
    },

    deleteBoard: (state, action: PayloadAction<number | string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload)
    },

    updateBoard: (state, action: PayloadAction<BoardItem>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id)
      if (index !== -1) {
        state.boards[index] = action.payload
      }
    },

    addPinToBoard: (
      state,
      action: PayloadAction<{ boardId: string | number; pinId: string | number }>
    ) => {
      const board = state.boards.find(b => b.id === action.payload.boardId)
      if (board && !board.pinIds.includes(action.payload.pinId as string)) {
        board.pinIds.push(action.payload.pinId as string)
      }
    },

    removePinFromBoard: (
      state,
      action: PayloadAction<{ boardId: string; pinId: string }>
    ) => {
      const board = state.boards.find(b => b.id === action.payload.boardId)
      if (board) {
        board.pinIds = board.pinIds.filter(id => id !== action.payload.pinId)
      }
    },

    /**
     * organizePins: moves multiple unorganized pins into a single board.
     * Used by the UnorganizedPins dialog.
     * 
     * NOTE: This only updates boardSlice.pinIds.
     * You must also dispatch updatePin for each pin in pinSlice
     * to set pin.boardId — see UnorganizedPins.tsx handleBoardSelect.
     */
    organizePins: (
      state,
      action: PayloadAction<{ pinIds: (string | number)[]; boardId: string | number }>
    ) => {
      const { pinIds, boardId } = action.payload
      const board = state.boards.find(b => b.id === boardId)
      if (!board) return

      for (const pinId of pinIds) {
        // Remove pin from any other board it might currently be in
        for (const b of state.boards) {
          b.pinIds = b.pinIds.filter(id => id !== pinId)
        }
        // Add to target board (avoid duplicates)
        if (!board.pinIds.includes(pinId as string)) {
          board.pinIds.push(pinId as string)
        }
      }
    },

    resetBoardState: (state) => {
      state.boards = []
    },
  },
})

export const {
  setBoards,
  createBoard,
  deleteBoard,
  updateBoard,
  addPinToBoard,
  removePinFromBoard,
  organizePins,
  resetBoardState,
} = boardsSlice.actions

export default boardsSlice.reducer