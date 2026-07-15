import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle, Circle, Star } from 'lucide-react';
import './BookCard.css';

const BookCard = ({ book, onUpdate, onDelete }) => {
  const toggleReadStatus = () => {
    onUpdate({ ...book, isRead: !book.isRead });
  };

  const updateRating = (rating) => {
    onUpdate({ ...book, rating });
  };

  return (
    <motion.div 
      className="book-card glass"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="book-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div className="cover-placeholder">
            <span>{book.title.charAt(0)}</span>
          </div>
        )}
        <button 
          className={`status-btn ${book.isRead ? 'read' : 'unread'}`}
          onClick={toggleReadStatus}
          title={book.isRead ? "Mark as unread" : "Mark as read"}
        >
          {book.isRead ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        
        <div className="book-categories">
          {book.categories && book.categories.slice(0, 2).map((cat, idx) => (
            <span key={idx} className="category-tag">{cat}</span>
          ))}
        </div>

        <div className="book-footer">
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                className={`star-btn ${book.rating >= star ? 'active' : ''}`}
                onClick={() => updateRating(star)}
              >
                <Star size={16} fill={book.rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          
          <button 
            className="delete-btn" 
            onClick={() => onDelete(book.id)}
            title="Delete book"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
