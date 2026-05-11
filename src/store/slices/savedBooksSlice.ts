import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book, SavedBooksState } from '../../types/book';

const initialState: SavedBooksState = {
  favorites: [],
  savedForLater: [],
  hasSeenWelcome: false,
};

const savedBooksSlice = createSlice({
  name: 'savedBooks',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Book>) {
      const exists = state.favorites.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push({ id: action.payload.id, data: action.payload });
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter((item) => item.id !== action.payload);
    },
    addSavedForLater(state, action: PayloadAction<Book>) {
      const exists = state.savedForLater.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.savedForLater.push({ id: action.payload.id, data: action.payload });
      }
    },
    removeSavedForLater(state, action: PayloadAction<string>) {
      state.savedForLater = state.savedForLater.filter((item) => item.id !== action.payload);
    },
    completeOnboarding(state) {
      state.hasSeenWelcome = true;
    },
  },
});

export const { addFavorite, removeFavorite, addSavedForLater, removeSavedForLater, completeOnboarding } = savedBooksSlice.actions;
export default savedBooksSlice.reducer;
