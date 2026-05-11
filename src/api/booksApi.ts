import { Book } from '../types/book';

export const fetchBooksFromApi = async (
  query: string,
  startIndex: number,
  maxResults: number
): Promise<{ items: Book[]; totalItems: number }> => {
  const apiKey = 'AIzaSyAqa6VPMIowDUECU8gUGN0UJ9iMYCCF73M';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch books from API');
  }

  const data = await response.json();

  const totalItems = data.totalItems || 0;
  
  const items: Book[] = (data.items || []).map((item: any) => {
    const volumeInfo = item.volumeInfo || {};
    return {
      id: item.id,
      title: volumeInfo.title || 'Unknown Title',
      authors: volumeInfo.authors || [],
      thumbnail: volumeInfo.imageLinks?.thumbnail ?? null,
      publishedDate: volumeInfo.publishedDate ?? null,
      description: volumeInfo.description ?? null,
      pageCount: volumeInfo.pageCount ?? null,
      publisher: volumeInfo.publisher ?? null,
    };
  });

  return { items, totalItems };
};
