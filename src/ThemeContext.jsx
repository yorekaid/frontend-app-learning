import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Always force dark mode to true for CLIP
    localStorage.setItem('clip-theme-dark', 'true');
    document.body.classList.add('learning-dark-mode');

    const handleStorageChange = (e) => {
      if (e.key === 'clip-theme-dark') {
        // Enforce true
        localStorage.setItem('clip-theme-dark', 'true');
        document.body.classList.add('learning-dark-mode');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
