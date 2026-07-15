import localforage from 'localforage';

// Initialize our mock database
const db = localforage.createInstance({
  name: 'LibraryManagement',
  storeName: 'books'
});

export const getBooks = async () => {
  const books = await db.getItem('library_books');
  return books || [];
};

export const saveBook = async (book) => {
  const books = await getBooks();
  const newBook = { ...book, id: Date.now().toString(), addedAt: new Date().toISOString() };
  books.push(newBook);
  await db.setItem('library_books', books);
  return newBook;
};

export const updateBook = async (updatedBook) => {
  const books = await getBooks();
  const index = books.findIndex((b) => b.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    await db.setItem('library_books', books);
    return updatedBook;
  }
  throw new Error('Book not found');
};

export const deleteBook = async (id) => {
  const books = await getBooks();
  const filtered = books.filter((b) => b.id !== id);
  await db.setItem('library_books', filtered);
  return true;
};
