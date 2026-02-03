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
      state.boards = state.boards.filter(
        board => board.id !== action.payload
      )
    },

    updateBoard: (state, action: PayloadAction<BoardItem>) => {
      const index = state.boards.findIndex(
        board => board.id === action.payload.id
      )

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

  },
})

export const {
  setBoards,
  createBoard,
  deleteBoard,
  updateBoard,
  addPinToBoard,
  removePinFromBoard
} = boardsSlice.actions

export default boardsSlice.reducer
