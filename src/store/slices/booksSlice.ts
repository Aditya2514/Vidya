import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BooksState, Book } from '../../types/book';
import { fetchBooksFromApi } from '../../api/booksApi';

interface FetchBooksArgs {
  query: string;
  startIndex: number;
}

interface FetchBooksResult {
  items: Book[];
  query: string;
  startIndex: number;
  maxResults: number;
  totalItems: number;
}

export const fetchBooks = createAsyncThunk<FetchBooksResult, FetchBooksArgs>(
  'books/fetchBooks',
  async ({ query, startIndex }) => {
    const maxResults = 20;

    const { items, totalItems } = await fetchBooksFromApi(query, startIndex, maxResults);

    return {
      items,
      query,
      startIndex,
      maxResults,
      totalItems,
    };
  }
);

const initialState: BooksState = {
  items: [],
  searchQuery: '',
  startIndex: 0,
  maxResults: 20,
  totalItems: 0,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetBooksState(state) {
      state.items = [];
      state.startIndex = 0;
      state.totalItems = 0;
      state.hasMore = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        if (action.meta.arg.startIndex === 0) {
          state.isLoading = true;
          state.error = null;
        } else {
          state.isLoadingMore = true;
        }
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        if (action.payload.startIndex === 0) {
          state.items = action.payload.items;
        } else {
          state.items = [...state.items, ...action.payload.items];
        }
        
        state.searchQuery = action.payload.query;
        state.startIndex = action.payload.startIndex + action.payload.maxResults;
        state.maxResults = action.payload.maxResults;
        state.totalItems = action.payload.totalItems;
        state.hasMore = state.items.length < state.totalItems;
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.error.message || 'Failed to fetch books';
      });
  },
});

export const { setSearchQuery, resetBooksState } = booksSlice.actions;
export default booksSlice.reducer;
