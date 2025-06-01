import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../logo.svg";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");
  
  // Check for cars in comparison
  useEffect(() => {
    const checkCompareList = () => {
      const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
      setCompareCount(compareList.length);
    };
    
    checkCompareList();
    
    // Add event listener to track changes to localStorage
    window.addEventListener('storage', checkCompareList);
    
    return () => {
      window.removeEventListener('storage', checkCompareList);
    };
  }, []);
  
  // Check localStorage on route change
  useEffect(() => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareCount(compareList.length);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToComparison = () => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    if (compareList.length > 0) {
      navigate(`/compare?ids=${compareList.join(',')}`);
    } else {
      navigate('/home');
    }
  };

  const clearComparison = () => {
    localStorage.setItem('compareList', '[]');
    setCompareCount(0);
  };

  return (
    <nav className="enhanced-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home" className="logo-link">
            <img src={logo} alt="CarsDex Logo" className="logo-image" />
            <span className="logo-text">
              Drive<span className="logo-highlight">Ops</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Navigation links */}
        <div className={`navbar-links ${mobileMenuOpen ? 'show' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/map" className="nav-link">Map</Link>
              
              <div className="dropdown-container" ref={dropdownRef}>
                <button 
                  className="nav-link dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Cars <span className="dropdown-arrow">▼</span>
                </button>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/add-car" className="dropdown-item">
                      <span className="dropdown-icon">+</span> Add New Car
                    </Link>
                    <Link to="/home" className="dropdown-item">
                      <span className="dropdown-icon">🔍</span> Browse Cars
                    </Link>
                  </div>
                )}
              </div>

              {/* Compare button with counter */}
              <button 
                className={`compare-button ${compareCount > 0 ? 'has-items' : ''}`}
                onClick={goToComparison}
                disabled={compareCount === 0}
              >
                <span className="compare-icon">⚖️</span>
                Compare
                {compareCount > 0 && (
                  <span className="compare-counter">{compareCount}</span>
                )}
              </button>

              {compareCount > 0 && (
                <button className="clear-compare-button" onClick={clearComparison}>
                  Clear
                </button>
              )}
              
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link">Login</Link>
              <Link to="/register" className="nav-link signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Announcement bar */}
      {isLoggedIn && (
        <div className="announcement-bar">
          <div className="announcement-container">
            <span className="announcement-icon">🚗</span>
            <span className="announcement-text">
              Discover our new car comparison feature! Select multiple cars to compare their specifications side-by-side.
            </span>
            <button className="learn-more-button" onClick={() => navigate('/compare')}>
              Learn More
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;