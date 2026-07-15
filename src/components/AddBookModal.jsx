import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader, Plus } from 'lucide-react';
import { searchGoogleBooks } from '../api/googleBooks';
import './AddBookModal.css';

const AddBookModal = ({ isOpen, onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const data = await searchGoogleBooks(query);
    setResults(data);
    setLoading(false);
  };

  const handleAdd = (book) => {
    const newBook = {
      ...book,
      isRead: false,
      rating: 0
    };
    onAdd(newBook);
    onClose();
    setQuery('');
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop">
        <motion.div 
          className="modal-content glass"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="modal-header">
            <h2>Add a New Book</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader className="spin" size={20} /> : 'Search'}
              </button>
            </form>

            <div className="search-results">
              {results.length > 0 ? (
                <div className="results-list">
                  {results.map((book) => (
                    <div key={book.id} className="result-item">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="result-cover" />
                      ) : (
                        <div className="result-cover-placeholder">
                          {book.title.charAt(0)}
                        </div>
                      )}
                      <div className="result-info">
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </div>
                      <button 
                        className="btn-add-result"
                        onClick={() => handleAdd(book)}
                        title="Add to library"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                query && !loading && <p className="no-results">No books found. Try a different search.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddBookModal;
