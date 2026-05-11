export type Book = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
  publishedDate: string | null;
  description: string | null;
  pageCount: number | null;
  publisher: string | null;
};

export interface BooksState {
  items: Book[];
  searchQuery: string;
  startIndex: number;
  maxResults: number;
  totalItems: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

export type SavedBook = {
  id: string;
  data: Book;
};

export interface SavedBooksState {
  favorites: SavedBook[];
  savedForLater: SavedBook[];
  hasSeenWelcome: boolean;
}
