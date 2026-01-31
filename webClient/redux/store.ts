import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import pinsReducer from './pinSlice';
import boardsReducer from './boardSlice'
import searchReducer from './searchSlice'
import boardFilterReducer from './boardFilterSlice'

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage on client, noop storage on server
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Combine all reducers
const rootReducer = combineReducers({
  pins: pinsReducer,
  boards: boardsReducer,
  search: searchReducer,
  boardFilter: boardFilterReducer
});

// Configuration for persistence
const persistConfig = {
  key: "root",
  version: 2,
  storage,
  // Optional: whitelist only specific reducers to persist
  // whitelist: ['pins'],
};

// Apply persistence to the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;