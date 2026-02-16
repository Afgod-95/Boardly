import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import { PinForm, PinItem } from "@/types/pin";

export interface PinDraft extends PinForm {
    id: string | number,
}
interface PinState {
  pins: PinItem[];
  selectedPin: PinItem | null;
  isLoading: boolean;
  pinForm: PinForm,
  pinDrafts: PinDraft[],
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

        updatePinSaveStatus: (state, action: PayloadAction<{ id: string | number; isSaved: boolean }>) => {
            const pin = state.pins.find(pin => pin.id === action.payload.id);
            if (pin) {
                pin.isSaved = action.payload.isSaved;
            }
            if (state.selectedPin?.id === action.payload.id) {
                state.selectedPin.isSaved = action.payload.isSaved;
            }
        },

        addPinToFavourite: (state, action: PayloadAction<string | number>) => {
            const pin = state.pins.find(pin => pin.id === action.payload);
            if (pin) {
                pin.isFavourite = true;
            }
        },

        removePinFromFavourite: (state, action: PayloadAction<string | number>) => {
            const pin = state.pins.find(pin => pin.id === action.payload);
            if (pin) {
                pin.isFavourite = false;
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


        saveDraft: (state, action: PayloadAction<PinDraft>) => {
            const index = state.pinDrafts.findIndex(d => d.id === action.payload.id);
            if (index !== -1) {
                // Update existing
                state.pinDrafts[index] = action.payload;
            } else {
                // Add new to the beginning
                state.pinDrafts.unshift(action.payload);
            }
        },

        deleteDraft: (state, action: PayloadAction<string | number>) => {
            state.pinDrafts = state.pinDrafts.filter(d => d.id !== action.payload);
        },

        drafts: (state) => {
            const draft: PinDraft = {...state.pinForm, id: nanoid()}
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
    addPinToFavourite,
    removePinFromFavourite,
    uploadPin,
    drafts,
    saveDraft,
    deleteDraft
} = pinsSlice.actions
export default pinsSlice.reducer