import React, { useEffect, useState } from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme from system or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="header glass">
      <div className="header-content">
        <div className="logo-container">
          <BookOpen className="logo-icon" size={32} />
          <h1 className="logo-text">LibManager</h1>
        </div>
        
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
