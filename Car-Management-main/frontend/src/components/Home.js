import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    bodyType: '',
    fuelType: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCompare, setSelectedCompare] = useState([]);
  
  // Load cars data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/cars');
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);
  
  // Load comparison list from localStorage
  useEffect(() => {
    const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
    setSelectedCompare(savedCompare);
  }, []);
  
  // Update localStorage when selectedCompare changes
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(selectedCompare));
  }, [selectedCompare]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filter cars based on filters
  const filteredCars = cars.filter(car => {
    // Search filter
    if (filters.search && 
      !`${car.title} ${car.make} ${car.model}`.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Make filter
    if (filters.make && car.make !== filters.make) {
      return false;
    }
    
    // Model filter
    if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice && car.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && car.price > parseFloat(filters.maxPrice)) {
      return false;
    }
    
    // Year range filter
    if (filters.minYear && car.year < parseInt(filters.minYear)) {
      return false;
    }
    if (filters.maxYear && car.year > parseInt(filters.maxYear)) {
      return false;
    }
    
    // Body type filter
    if (filters.bodyType && car.bodyType !== filters.bodyType) {
      return false;
    }
    
    // Fuel type filter
    if (filters.fuelType && car.fuelType !== filters.fuelType) {
      return false;
    }
    
    return true;
  });
  
  // Sort filtered cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'yearNew':
        return b.year - a.year;
      case 'yearOld':
        return a.year - b.year;
      default:
        return 0;
    }
  });
  
  // Extract unique makes for filter dropdown
  const uniqueMakes = [...new Set(cars.map(car => car.make))].filter(Boolean).sort();
  const uniqueBodyTypes = [...new Set(cars.map(car => car.bodyType))].filter(Boolean).sort();
  const uniqueFuelTypes = [...new Set(cars.map(car => car.fuelType))].filter(Boolean).sort();

  // Handle comparison toggle
  const toggleCompare = (id) => {
    if (selectedCompare.includes(id)) {
      setSelectedCompare(selectedCompare.filter(carId => carId !== id));
    } else {
      if (selectedCompare.length >= 3) {
        alert('You can compare up to 3 cars at once.');
        return;
      }
      setSelectedCompare([...selectedCompare, id]);
    }
  };

  // Go to comparison page
  const goToComparison = () => {
    if (selectedCompare.length > 0) {
      navigate(`/compare?ids=${selectedCompare.join(',')}`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="enhanced-home">
      <div className="home-header">
        <h1>Browse Available Cars</h1>
        <p>Find and compare the perfect car for your needs</p>
      </div>
      
      <div className="home-content">
        {/* Sidebar Filters */}
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Search & Filters</h3>
            <div className="search-box">
              <input
                type="text"
                name="search"
                placeholder="Search by make, model, or title..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Make & Model</h4>
            <select
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Makes</option>
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            
            <input
              type="text"
              name="model"
              placeholder="Model..."
              value={filters.model}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="range-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="filter-input"
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="filter-input"
                min="0"
              />
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Year</h4>
            <div className="range-inputs">
              <input
                type="number"
                name="minYear"
                placeholder="From"
                value={filters.minYear}
                onChange={handleFilterChange}
                className="filter-input"
                min="1900"
                max={new Date().getFullYear()}
              />
              <span>to</span>
              <input
                type="number"
                name="maxYear"
                placeholder="To"
                value={filters.maxYear}
                onChange={handleFilterChange}
                className="filter-input"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Body Type</h4>
            <select
              name="bodyType"
              value={filters.bodyType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Body Types</option>
              {uniqueBodyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <h4>Fuel Type</h4>
            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Fuel Types</option>
              {uniqueFuelTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <button 
              className="clear-filters-btn"
              onClick={() => setFilters({
                search: '',
                make: '',
                model: '',
                minPrice: '',
                maxPrice: '',
                minYear: '',
                maxYear: '',
                bodyType: '',
                fuelType: ''
              })}
            >
              Clear All Filters
            </button>
          </div>
          
          {selectedCompare.length > 0 && (
            <div className="comparison-bar">
              <div className="comparison-count">
                {selectedCompare.length} car{selectedCompare.length > 1 ? 's' : ''} selected
              </div>
              <button 
                className="compare-now-btn"
                onClick={goToComparison}
              >
                Compare Now
              </button>
              <button 
                className="clear-selection-btn"
                onClick={() => setSelectedCompare([])}
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="cars-content">
          <div className="cars-header">
            <div className="results-count">
              {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
            </div>
            
            <div className="sort-options">
              <label htmlFor="sortBy">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="yearNew">Year: Newest First</option>
                <option value="yearOld">Year: Oldest First</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading cars...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button 
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : sortedCars.length === 0 ? (
            <div className="no-cars-container">
              <p>No cars match your filters.</p>
              <button 
                className="clear-filters-btn"
                onClick={() => setFilters({
                  search: '',
                  make: '',
                  model: '',
                  minPrice: '',
                  maxPrice: '',
                  minYear: '',
                  maxYear: '',
                  bodyType: '',
                  fuelType: ''
                })}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="cars-grid">
              {sortedCars.map(car => (
                <div key={car._id} className="car-card">
                  <div className="car-image-container">
                    <img
                      src={car.images && car.images.length > 0 
                        ? `http://localhost:5000/${car.images[0]}` 
                        : "/default-car.jpg"
                      }
                      alt={car.title}
                      className="car-image"
                      onError={(e) => { e.target.src = "/default-car.jpg"; }}
                    />
                    <button 
                      className={`compare-toggle ${selectedCompare.includes(car._id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(car._id);
                      }}
                      title={selectedCompare.includes(car._id) 
                        ? "Remove from comparison" 
                        : "Add to comparison"
                      }
                    >
                      {selectedCompare.includes(car._id) ? '✓' : '⚖️'}
                    </button>
                  </div>
                  <div className="car-info" onClick={() => navigate(`/cars/${car._id}`)}>
                    <h3 className="car-title">{car.title}</h3>
                    <div className="car-meta">
                      <span className="car-year">{car.year}</span>
                      <span className="car-divider">•</span>
                      <span className="car-mileage">
                        {car.mileage ? `${car.mileage.toLocaleString()} mi` : 'N/A'}
                      </span>
                    </div>
                    {car.price && (
                      <div className="car-price">{formatCurrency(car.price)}</div>
                    )}
                    <div className="car-details">
                      {car.bodyType && (
                        <span className="car-detail">
                          <span className="detail-icon">🚗</span>
                          {car.bodyType}
                        </span>
                      )}
                      {car.transmission && (
                        <span className="car-detail">
                          <span className="detail-icon">⚙️</span>
                          {car.transmission}
                        </span>
                      )}
                      {car.fuelType && (
                        <span className="car-detail">
                          <span className="detail-icon">⛽</span>
                          {car.fuelType}
                        </span>
                      )}
                    </div>
                    {car.tags && car.tags.length > 0 && (
                      <div className="car-tags">
                        {car.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="car-tag">{tag}</span>
                        ))}
                        {car.tags.length > 3 && (
                          <span className="car-tag-more">+{car.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;