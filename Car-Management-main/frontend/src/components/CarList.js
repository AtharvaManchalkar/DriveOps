import React, { useState, useEffect } from 'react';
import API from '../api/api'; // Assuming you have an API instance
import { Link } from 'react-router-dom';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch cars from the backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get('/cars');  // No token required here
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, []);

  // Handle the search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the cars based on the search term
  const filteredCars = cars.filter((car) =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Truncate the description to 50 words
  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length <= 50) return description;
    return words.slice(0, 50).join(' ') + '...';
  };

  return (
    <div className="car-list">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search cars by name or tags..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Car Cards */}
      <div className="car-cards-container">
        {filteredCars.map((car) => (
          <div key={car._id} className="car-card">
            <img
              src={car.images[0]} // Display first image in the array
              alt={car.title}
              className="car-image"
            />
            <h3 className="car-title">{car.title}</h3>
            <p className="car-bio">{truncateDescription(car.description)}</p>
            <div className="car-tags">
              {car.tags.join(', ')}  {/* Display tags separated by commas */}
            </div>

            {/* View Details Button */}
            <Link to={`/car/${car._id}`} className="view-details-button">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
