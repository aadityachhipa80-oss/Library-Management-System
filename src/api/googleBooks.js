const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export const searchGoogleBooks = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=10`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (!data.items) return [];

    return data.items.map((item) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title || 'Unknown Title',
        author: info.authors ? info.authors.join(', ') : 'Unknown Author',
        description: info.description || 'No description available.',
        coverUrl: info.imageLinks?.thumbnail || null,
        pageCount: info.pageCount || 0,
        categories: info.categories || [],
      };
    });
  } catch (error) {
    console.error('Error fetching from Google Books:', error);
    return [];
  }
};
