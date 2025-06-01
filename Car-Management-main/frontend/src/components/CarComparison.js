import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';
import '../styles/CarComparison.css';

const CarComparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Parse car IDs from URL query parameters
  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams(location.search);
        const carIds = params.get('ids')?.split(',') || [];
        
        // Fetch all cars for dropdown
        const { data: allCarsData } = await API.get('/cars');
        setAllCars(allCarsData);
        
        // Fetch specific cars for comparison
        if (carIds.length > 0) {
          const comparisonCars = await Promise.all(
            carIds.map(id => API.get(`/cars/${id}`).then(res => res.data))
          );
          
          setCars(comparisonCars);
        }
      } catch (err) {
        console.error('Error fetching comparison data:', err);
        setError('Failed to load comparison data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComparisonData();
  }, [location.search]);

  // Add a car to comparison
  const addCarToComparison = (carId) => {
    if (!carId || cars.find(car => car._id === carId)) return;
    
    const currentIds = cars.map(car => car._id);
    const newIds = [...currentIds, carId].join(',');
    navigate(`/compare?ids=${newIds}`);
  };

  // Remove a car from comparison
  const removeCarFromComparison = (carId) => {
    const updatedIds = cars
      .filter(car => car._id !== carId)
      .map(car => car._id)
      .join(',');
    
    if (updatedIds) {
      navigate(`/compare?ids=${updatedIds}`);
    } else {
      navigate('/home');
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return <div className="comparison-loading">Loading comparison data...</div>;
  }

  return (
    <div className="car-comparison-container">
      <h1 className="comparison-title">Car Comparison</h1>
      
      {error && <div className="comparison-error">{error}</div>}
      
      <div className="add-to-comparison">
        <select 
          className="car-selector"
          onChange={(e) => addCarToComparison(e.target.value)}
          value=""
        >
          <option value="">Add a car to compare...</option>
          {allCars
            .filter(car => !cars.find(c => c._id === car._id))
            .map(car => (
              <option key={car._id} value={car._id}>
                {car.title}
              </option>
            ))}
        </select>
      </div>
      
      {cars.length === 0 ? (
        <div className="no-cars-message">
          <p>Select cars to compare from the dropdown above.</p>
          <button 
            onClick={() => navigate('/home')}
            className="browse-cars-btn"
          >
            Browse Cars
          </button>
        </div>
      ) : (
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr className="image-row">
                <th className="feature-header">Vehicle</th>
                {cars.map(car => (
                  <th key={car._id} className="car-header">
                    <div className="car-header-content">
                      <img 
                        src={car.images && car.images.length > 0 
                          ? `http://localhost:5000/${car.images[0]}` 
                          : "/default-car.jpg"
                        } 
                        alt={car.title}
                        className="comparison-car-image"
                        onError={(e) => { e.target.src = "/default-car.jpg"; }}
                      />
                      <button 
                        className="remove-from-comparison"
                        onClick={() => removeCarFromComparison(car._id)}
                        aria-label="Remove from comparison"
                      >
                        ×
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="feature-header">Model</th>
                {cars.map(car => (
                  <th key={car._id} className="car-header">
                    <h3 className="car-title">{car.title}</h3>
                    <div className="view-details-link" onClick={() => navigate(`/cars/${car._id}`)}>
                      View Details
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Basic Information */}
              <tr className="section-header">
                <td colSpan={cars.length + 1}>Basic Information</td>
              </tr>
              <tr>
                <td className="feature-name">Make</td>
                {cars.map(car => (
                  <td key={car._id}>{car.make || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Model</td>
                {cars.map(car => (
                  <td key={car._id}>{car.model || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Year</td>
                {cars.map(car => (
                  <td key={car._id}>{car.year || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Price</td>
                {cars.map(car => (
                  <td key={car._id} className="price-cell">
                    {car.price ? formatCurrency(car.price) : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Color</td>
                {cars.map(car => (
                  <td key={car._id}>{car.color || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Mileage</td>
                {cars.map(car => (
                  <td key={car._id}>{car.mileage ? `${car.mileage} mi` : '—'}</td>
                ))}
              </tr>
              
              {/* Technical Specifications */}
              <tr className="section-header">
                <td colSpan={cars.length + 1}>Technical Specifications</td>
              </tr>
              <tr>
                <td className="feature-name">Body Type</td>
                {cars.map(car => (
                  <td key={car._id}>{car.bodyType || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Engine Type</td>
                {cars.map(car => (
                  <td key={car._id}>{car.engineType || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Transmission</td>
                {cars.map(car => (
                  <td key={car._id}>{car.transmission || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Fuel Type</td>
                {cars.map(car => (
                  <td key={car._id}>{car.fuelType || '—'}</td>
                ))}
              </tr>
              
              {/* Performance Specifications */}
              <tr className="section-header">
                <td colSpan={cars.length + 1}>Performance</td>
              </tr>
              <tr>
                <td className="feature-name">Engine</td>
                {cars.map(car => (
                  <td key={car._id}>{car.specifications?.engine || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Horsepower</td>
                {cars.map(car => (
                  <td key={car._id}>
                    {car.specifications?.horsepower ? `${car.specifications.horsepower} hp` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Torque</td>
                {cars.map(car => (
                  <td key={car._id}>
                    {car.specifications?.torque ? `${car.specifications.torque} lb-ft` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">0-60 mph</td>
                {cars.map(car => (
                  <td key={car._id}>
                    {car.specifications?.acceleration ? `${car.specifications.acceleration} sec` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Top Speed</td>
                {cars.map(car => (
                  <td key={car._id}>
                    {car.specifications?.topSpeed ? `${car.specifications.topSpeed} mph` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-name">Fuel Economy</td>
                {cars.map(car => (
                  <td key={car._id}>
                    {car.specifications?.fuelEconomy ? `${car.specifications.fuelEconomy} mpg` : '—'}
                  </td>
                ))}
              </tr>
              
              {/* Features */}
              <tr className="section-header">
                <td colSpan={cars.length + 1}>Features</td>
              </tr>
              {Array.from(
                new Set(cars.flatMap(car => car.features || []))
              ).sort().map(feature => (
                <tr key={feature}>
                  <td className="feature-name">{feature}</td>
                  {cars.map(car => (
                    <td key={car._id} className="feature-availability">
                      {car.features && car.features.includes(feature) ? (
                        <span className="feature-available">✓</span>
                      ) : (
                        <span className="feature-unavailable">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Tags */}
              <tr className="section-header">
                <td colSpan={cars.length + 1}>Tags</td>
              </tr>
              <tr>
                <td className="feature-name">Tags</td>
                {cars.map(car => (
                  <td key={car._id} className="tags-cell">
                    {car.tags && car.tags.length > 0 ? (
                      <div className="comparison-tags">
                        {car.tags.map(tag => (
                          <span key={tag} className="comparison-tag">{tag}</span>
                        ))}
                      </div>
                    ) : '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      <div className="comparison-actions">
        <button 
          onClick={() => navigate('/home')}
          className="back-to-home-btn"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CarComparison;