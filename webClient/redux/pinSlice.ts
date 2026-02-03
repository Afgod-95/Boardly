import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PinForm, PinItem } from "@/types/pin";

interface PinState {
  pins: PinItem[];
  selectedPin: PinItem | null;
  isLoading: boolean;
  pinForm: PinForm,
  pinDrafts: PinForm[],
}

const initialState: PinState = {
  pins: [],
  pinForm: {
    title: '',
    description: '',
    link: '',
    img: '',
    video:'',
    board: '',
    saved: false,
    saveCount: 0,
  },
  pinDrafts: [],
  selectedPin: null,
  isLoading: false,
};

const pinsSlice = createSlice({
    name: 'pins',
    initialState,
    reducers: {
        setPins: (state, action: PayloadAction<PinItem[]>) => {
            state.pins = action.payload
        },

        addPin: (state, action: PayloadAction<PinItem> ) => {
            state.pins.push(action.payload)
        },

        
        updatePin: (state, action: PayloadAction<PinItem>) => {
            const index = state.pins.findIndex(pin => pin.id === action.payload.id)
            if (index !== -1) state.pins[index] = action.payload
        },

        removePin: (state, action: PayloadAction<number | string>) => {
            state.pins = state.pins.filter(pin => pin.id !== action.payload)
        },

        updatePinSaveStatus: (state, action: PayloadAction<{ id: string | number; saved: boolean }>) => {
            const pin = state.pins.find(pin => pin.id === action.payload.id);
            if (pin) {
                pin.saved = action.payload.saved;
            }
            if (state.selectedPin?.id === action.payload.id) {
                state.selectedPin.saved = action.payload.saved;
            }
        },

        setSelectedPin: (state, action: PayloadAction<PinItem | null>) => {
            state.selectedPin = action.payload;
        },

        clearSelectedPin: (state) => {
            state.selectedPin = null;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        uploadPin: (state, action: PayloadAction<PinForm>) => {
            state.pinForm = action.payload
        },

        drafts: (state) => {
            const draft: PinForm = {...state.pinForm}
            state.pinDrafts.push(draft)
            state.pinForm = { 
                title: '',
                description: '',
                link: '',
                img: '',
                video:'',
                board: '',
                saved: false,
                saveCount: 0,
            }
        }
    }
})

export const { 
    setPins, 
    addPin, 
    updatePin, 
    removePin,
    updatePinSaveStatus,
    setLoading,
    setSelectedPin,
    clearSelectedPin,
    uploadPin,
    drafts
} = pinsSlice.actions
export default pinsSlice.reducer