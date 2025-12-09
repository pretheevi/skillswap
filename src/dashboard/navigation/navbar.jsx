import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";

function Navbar(props) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      // Auto close menu when switching to desktop
      if (newWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.nav-menu');
      const hamburger = document.querySelector('.hamburger-icon');
      
      if (windowWidth < 768 && 
          isMenuOpen && menu && !menu.contains(event.target) && hamburger && 
          !hamburger.contains(event.target)) {
        closeMenu();
      }
    };

    if (windowWidth < 768 && isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, windowWidth]);

  const handleMenuItemClick = (action) => {
    closeMenu();
    if (action === 'profile') {
      navigate('/profile');
    }
    if (action === 'home') {
      navigate('/home');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="nav-bar">
        <h1 className="nav-logo">SkillSwap</h1>
        
        {/* Mobile hamburger icon */}
        <button 
          className={`hamburger-icon ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FontAwesomeIcon icon={faTimes} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="lg" />
          )}
        </button>
        
        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li 
            className="nav-item" 
            onClick={() => handleMenuItemClick('home')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuItemClick('home')}
          >
            <span className="nav-icon" aria-hidden="true">🏠</span>
            <span className="nav-text">Home</span>
          </li>
          <li 
            className="nav-item" 
            onClick={() => handleMenuItemClick('profile')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleMenuItemClick('profile')}
          >
            <span className="nav-icon" aria-hidden="true">👤</span>
            <span className="nav-text">Profile</span>
          </li>
          
          <li className="nav-item filter-section">
            <div className="filter-sort-section">
              <select 
                className="filter-select" 
                value={props.category || ""} 
                onChange={(e) => {
                  props.setCategory(e.target.value);
                  if (windowWidth < 768) closeMenu();
                }}
                aria-label="Filter by category"
              >
                <option value="">Filter by category</option>
                <option value="web">Web Development</option>
                <option value="design">Design</option>
                <option value="data">Data Science</option>
                <option value="mobile">Mobile Development</option>
                <option value="marketing">Digital Marketing</option>
                <option value="language">Language</option>
              </select>
              
              <select 
                className="filter-select"
                value={props.sortBy || ""}
                onChange={(e) => {
                  props.setSortBy && props.setSortBy(e.target.value);
                  if (windowWidth < 768) closeMenu();
                }}
                aria-label="Sort by"
              >
                <option value="">Sort by</option>
                <option value="rating-high">Highest rated</option>
                <option value="rating-low">Lowest rated</option>
                <option value="date-new">Newest first</option>
                <option value="date-old">Oldest first</option>
              </select>
            </div>
          </li>
          
          {/* Additional menu items for mobile */}
          {windowWidth < 768 && (
            <>
              <li className="nav-item nav-divider" aria-hidden="true"></li>
              <li className="nav-item">
                <button 
                  className="nav-button"
                  onClick={() => {
                    navigate('/createpost');
                    closeMenu();
                  }}
                >
                  <span aria-hidden="true">📝</span> Create Post
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-button"
                  onClick={() => {
                    localStorage.clear();
                    navigate('/');
                    closeMenu();
                  }}
                >
                  <span aria-hidden="true">🚪</span> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && windowWidth < 768 && (
        <div className="menu-overlay" onClick={closeMenu} aria-hidden="true"></div>
      )}
    </>
  );
}

export default Navbar;