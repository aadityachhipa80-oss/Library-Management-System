import React, { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Search, BookX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import BookCard from './components/BookCard';
import AddBookModal from './components/AddBookModal';

import { getBooks, saveBook, updateBook, deleteBook } from './api/db';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, title, rating
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await getBooks();
        setBooks(storedBooks);
      } catch (error) {
        toast.error('Failed to load library');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const handleAddBook = async (book) => {
    try {
      const newBook = await saveBook(book);
      setBooks([newBook, ...books]);
      toast.success('Book added to library!');
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      await updateBook(updatedBook);
      setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    } catch (error) {
      toast.error('Failed to update book');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      setBooks(books.filter(b => b.id !== id));
      toast.success('Book removed');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else {
        // recent
        return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

    return result;
  }, [books, searchQuery, sortBy]);

  return (
    <div className="app-container">
      <Toaster position="bottom-right" />
      <Header />
      
      <main className="main-content">
        <div className="controls-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search your library..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-wrapper">
            <select 
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recently Added</option>
              <option value="title">Sort by Title</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Add Book
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spin"><Plus size={32} /></div>
            <p>Loading library...</p>
          </div>
        ) : filteredAndSortedBooks.length > 0 ? (
          <motion.div layout className="books-grid">
            <AnimatePresence>
              {filteredAndSortedBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onUpdate={handleUpdateBook}
                  onDelete={handleDeleteBook}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="empty-state">
            <BookX className="empty-state-icon" />
            <h3>No books found</h3>
            <p>
              {books.length === 0 
                ? "Your library is empty. Click 'Add Book' to get started."
                : "No books match your search."}
            </p>
          </div>
        )}
      </main>

      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}

export default App;
