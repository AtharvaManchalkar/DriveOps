import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { Link } from 'react-router-dom';
import LocationPicker from './LocationPicker';
import MaintenanceHistory from './MaintenanceHistory';
import '../styles/CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompare, setSelectedCompare] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch car data
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/cars/${id}`);
        setCar(data);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarData();
    }
  }, [id]);

  // Add or remove car from comparison list
  const toggleCompare = () => {
    if (selectedCompare.includes(id)) {
      const updatedList = selectedCompare.filter(carId => carId !== id);
      setSelectedCompare(updatedList);
      localStorage.setItem('compareList', JSON.stringify(updatedList));
    } else {
      if (selectedCompare.length >= 3) {
        alert('You can compare up to 3 cars at once.');
        return;
      }
      
      const updatedList = [...selectedCompare, id];
      setSelectedCompare(updatedList);
      localStorage.setItem('compareList', JSON.stringify(updatedList));
    }
  };

  // Load comparison list from localStorage
  useEffect(() => {
    const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
    setSelectedCompare(savedCompare);
  }, []);

  // Go to comparison page
  const goToComparison = () => {
    if (selectedCompare.length > 0) {
      navigate(`/compare?ids=${selectedCompare.join(',')}`);
    }
  };

  // Delete car handler
  const handleDeleteCar = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        setLoading(true);
        await API.delete(`/cars/${id}`);
        navigate('/home');
      } catch (err) {
        console.error('Error deleting car:', err);
        setError('Failed to delete car.');
        setLoading(false);
      }
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

  // Handle image navigation
  const goToNextImage = () => {
    if (car?.images?.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === car.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const goToPrevImage = () => {
    if (car?.images?.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
      );
    }
  };

  const selectImage = (index) => {
    setActiveImageIndex(index);
  };

  if (loading) {
    return <div className="car-detail-loading">Loading car details...</div>;
  }

  if (error || !car) {
    return (
      <div className="car-detail-error">
        <p>{error || 'Car not found.'}</p>
        <button 
          onClick={() => navigate('/home')}
          className="back-to-home-btn"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="enhanced-car-detail">
      {/* Top Actions Bar */}
      <div className="detail-actions">
        <button 
          className="back-button"
          onClick={() => navigate('/home')}
        >
          ← Back to Listings
        </button>
        
        <div className="detail-action-buttons">
          <button 
            className={`compare-button ${selectedCompare.includes(id) ? 'active' : ''}`}
            onClick={toggleCompare}
          >
            {selectedCompare.includes(id) ? 'Remove from Compare' : 'Add to Compare'}
          </button>
          
          {selectedCompare.length > 1 && (
            <button 
              className="view-comparison-button"
              onClick={goToComparison}
            >
              Compare ({selectedCompare.length})
            </button>
          )}
          
          <button 
            className="delete-button"
            onClick={handleDeleteCar}
          >
            Delete Car
          </button>
        </div>
      </div>
      
      {/* Car Header */}
      <div className="car-header">
        <h1 className="car-title">{car.title}</h1>
        {car.price && (
          <div className="car-price">{formatCurrency(car.price)}</div>
        )}
      </div>
      
      {/* Car Images Gallery - Fixed alt text issue and improved gallery */}
      <div className="car-gallery">
        {car.images && car.images.length > 0 ? (
          <>
            <div className="main-image-container">
              <button 
                className="gallery-nav-button prev-button" 
                onClick={goToPrevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
              
              <img
                src={`http://localhost:5000/${car.images[activeImageIndex]}`}
                alt={`${car.title}`}
                className="main-car-image"
                onError={(e) => { e.target.src = "/default-car.jpg"; }}
              />
              
              <button 
                className="gallery-nav-button next-button" 
                onClick={goToNextImage}
                aria-label="Next image"
              >
                ›
              </button>
              
              <div className="image-counter">
                {activeImageIndex + 1} / {car.images.length}
              </div>
            </div>
            
            {car.images.length > 1 && (
              <div className="thumbnail-container">
                {car.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                    onClick={() => selectImage(index)}
                  >
                    <img
                      src={`http://localhost:5000/${image}`}
                      alt={`${car.title} thumbnail`}
                      onError={(e) => { e.target.src = "/default-car.jpg"; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-images">
            <img
              src="/default-car.jpg"
              alt={car.title}
              className="default-car-image"
            />
          </div>
        )}
      </div>
      
      {/* Content Tabs */}
      <div className="car-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Specifications
        </button>
        <button 
          className={`tab-button ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          Maintenance History
        </button>
      </div>
      
      {/* Tab Content */}
<div className="tab-content">
  {activeTab === 'overview' && (
    <div className="overview-tab">
      <div className="car-details-grid">
        <div className="detail-item">
          <span className="detail-label">Make</span>
          <span className="detail-value">{car.make || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Model</span>
          <span className="detail-value">{car.model || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Year</span>
          <span className="detail-value">{car.year ? car.year : 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Price</span>
          <span className="detail-value">
            {car.price ? formatCurrency(car.price) : 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Body Type</span>
          <span className="detail-value">{car.bodyType || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Mileage</span>
          <span className="detail-value">
            {car.mileage !== undefined && car.mileage !== null ? `${Number(car.mileage).toLocaleString()} mi` : 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Color</span>
          <span className="detail-value">{car.color || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Transmission</span>
          <span className="detail-value">{car.transmission || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Fuel Type</span>
          <span className="detail-value">{car.fuelType || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Engine Type</span>
          <span className="detail-value">{car.engineType || 'N/A'}</span>
        </div>
      </div>
      
      <div className="car-description">
        <h3>Description</h3>
        <p>{car.description || 'No description available.'}</p>
      </div>
      
      {car.features && car.features.length > 0 ? (
        <div className="car-features">
          <h3>Features</h3>
          <div className="features-list">
            {car.features.map((feature, index) => (
              <div key={index} className="feature-badge">
                {feature}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      
      {car.tags && car.tags.length > 0 ? (
        <div className="car-tags">
          <h3>Tags</h3>
          <div className="tags-list">
            {car.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )}       
        {activeTab === 'specs' && (
          <div className="specs-tab">
            <h3>Technical Specifications</h3>
            
            <div className="specs-section">
              <h4>Engine & Performance</h4>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Engine</span>
                  <span className="spec-value">{car.specifications?.engine || car.engineType || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Horsepower</span>
                  <span className="spec-value">
                    {car.specifications?.horsepower ? `${car.specifications.horsepower} hp` : 'N/A'}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Torque</span>
                  <span className="spec-value">
                    {car.specifications?.torque ? `${car.specifications.torque} lb-ft` : 'N/A'}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">0-60 mph</span>
                  <span className="spec-value">
                    {car.specifications?.acceleration ? `${car.specifications.acceleration} sec` : 'N/A'}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Top Speed</span>
                  <span className="spec-value">
                    {car.specifications?.topSpeed ? `${car.specifications.topSpeed} mph` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="specs-section">
              <h4>Efficiency & Economy</h4>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Fuel Type</span>
                  <span className="spec-value">{car.fuelType || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Fuel Economy</span>
                  <span className="spec-value">
                    {car.specifications?.fuelEconomy ? `${car.specifications.fuelEconomy} mpg` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="specs-section">
              <h4>Dimensions & Weight</h4>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Body Type</span>
                  <span className="spec-value">{car.bodyType || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {car.location && car.location.coordinates && (
        <div className="car-location-section">
          <h3>Vehicle Location</h3>
            <LocationPicker
              initialLocation={car.location}
              disabled={true}
            />
            <Link to={`/map/${car._id}`} className="view-on-map-btn">
            View on Full Map
            </Link>
        </div>
        )
        }
        
        {activeTab === 'maintenance' && (
        <div className="maintenance-tab">
        <MaintenanceHistory carId={car._id} />
        </div>
        )}
      </div>
    </div>
  );
};

export default CarDetail;