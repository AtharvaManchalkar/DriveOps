import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import LocationPicker from './LocationPicker';
import DragDropUploader from './DragDropUploader';
import '../styles/AddCar.css';

const AddCar = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    bodyType: 'Sedan',
    engineType: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: '',
    location: null,
    features: [],
    specifications: {
      engine: '',
      horsepower: '',
      torque: '',
      acceleration: '',
      topSpeed: '',
      fuelEconomy: ''
    }
  });

  // Body type options
  const bodyTypes = [
    'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 
    'Wagon', 'Van', 'Minivan', 'Truck', 'Crossover'
  ];

  // Transmission options
  const transmissionTypes = [
    'Automatic', 'Manual', 'Semi-Automatic', 'CVT', 'Dual-Clutch'
  ];

  // Fuel type options
  const fuelTypes = [
    'Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid', 
    'Hydrogen', 'Natural Gas', 'Biodiesel'
  ];

  // Available car features
  const availableFeatures = [
    'Air Conditioning', 'Bluetooth', 'Cruise Control', 'Navigation',
    'Leather Seats', 'Sunroof', 'Heated Seats', 'Backup Camera',
    'Parking Sensors', 'Keyless Entry', 'Remote Start', 'Apple CarPlay',
    'Android Auto', 'Premium Sound System', 'Lane Departure Warning',
    'Blind Spot Monitoring', 'Adaptive Cruise Control'
  ];

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handler for feature toggles
  const handleFeatureToggle = (feature) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  // Handler for image uploads
  const handleImagesChange = (files) => {
    setImages(files);
  };

  const handleLocationChange = (locationData) => {
    setFormData({
      ...formData,
      location: locationData
    });
  };
  // Navigation between form steps
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Form submission handler
  // In your handleSubmit function, update this section:

// In the AddCar.js component's handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const submitData = new FormData();
    
    // Add text fields
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('tags', formData.tags);
    submitData.append('make', formData.make);
    submitData.append('model', formData.model);
    submitData.append('year', formData.year);
    submitData.append('price', formData.price);
    submitData.append('mileage', formData.mileage);
    submitData.append('bodyType', formData.bodyType);
    submitData.append('engineType', formData.engineType);
    submitData.append('transmission', formData.transmission);
    submitData.append('fuelType', formData.fuelType);
    submitData.append('color', formData.color);
    
    // Add specifications
    const specifications = {
      engine: formData.specifications.engine,
      horsepower: formData.specifications.horsepower ? Number(formData.specifications.horsepower) : '',
      torque: formData.specifications.torque ? Number(formData.specifications.torque) : '',
      acceleration: formData.specifications.acceleration ? Number(formData.specifications.acceleration) : '',
      topSpeed: formData.specifications.topSpeed ? Number(formData.specifications.topSpeed) : '',
      fuelEconomy: formData.specifications.fuelEconomy ? Number(formData.specifications.fuelEconomy) : ''
    };
    submitData.append('specifications', JSON.stringify(specifications));
    
    // Add features
    submitData.append('features', JSON.stringify(formData.features));
    
    // Add location with validation
    if (formData.location && formData.location.coordinates) {
      // Validate coordinates
      const coords = formData.location.coordinates;
      if (coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]))) {
        // Ensure coordinates are numeric
        const locationData = {
          coordinates: [parseFloat(coords[0]), parseFloat(coords[1])],
          address: formData.location.address || ''
        };
        submitData.append('location', JSON.stringify(locationData));
      }
    }
    
    // Add images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        submitData.append('images', images[i]);
      }
    }

    // Log data being sent
    console.log('Submitting car data...');
    console.log('Location:', formData.location);
    
    const response = await API.post('/cars', submitData);
    console.log('Car created successfully:', response.data);
    
    navigate(`/cars/${response.data._id}`);
  } catch (err) {
    console.error('Error adding car:', err);
    if (err.response) {
      console.error('Server response:', err.response.data);
    }
    setError('Failed to add car. Please check console for details.');
  } finally {
    setLoading(false);
  }
};
  // Content for each step of the form
  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="form-step">
            <h2>Step 1: Basic Information</h2>
            <div className="form-group">
              <label htmlFor="title">Car Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 2022 Tesla Model 3"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about this car..."
                rows="4"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)*</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., electric, luxury, sedan"
                required
              />
            </div>
            
            <div className="form-group image-upload-section">
              <label>Car Images*</label>
              <DragDropUploader onFilesChange={handleImagesChange} />
            </div>
            
            <div className="form-navigation">
              <button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.title || !formData.description || !formData.tags || images.length === 0}
                className="next-btn"
              >
                Next Step
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="form-step">
            <h2>Step 2: Car Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="make">Make*</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model*</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Camry"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Year*</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Midnight Blue"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price*</label>
                <div className="input-with-prefix">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 25000"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="mileage">Mileage*</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g., 15000"
                    required
                  />
                  <span className="suffix">mi</span>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bodyType">Body Type*</label>
                <select
                  id="bodyType"
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  required
                >
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="transmission">Transmission*</label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                >
                  {transmissionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="engineType">Engine Type</label>
                <input
                  type="text"
                  id="engineType"
                  name="engineType"
                  value={formData.engineType}
                  onChange={handleChange}
                  placeholder="e.g., V6 3.5L"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type*</label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                >
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-section">
              <h3>Vehicle Location</h3>
              <p>Set the current location of your vehicle:</p>
              <LocationPicker
                initialLocation={formData.location}
                onLocationChange={handleLocationChange}
              />
            </div>
            
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous Step
              </button>
              <button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.make || !formData.model || !formData.year || !formData.price}
                className="next-btn"
              >
                Next Step
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="form-step">
            <h2>Step 3: Features & Specifications</h2>
            
            <div className="form-section">
              <h3>Performance Specifications</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specifications.engine">Engine Details</label>
                  <input
                    type="text"
                    id="specifications.engine"
                    name="specifications.engine"
                    value={formData.specifications.engine}
                    onChange={handleChange}
                    placeholder="e.g., 2.0L Turbo Inline-4"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="specifications.horsepower">Horsepower</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="specifications.horsepower"
                      name="specifications.horsepower"
                      min="0"
                      value={formData.specifications.horsepower}
                      onChange={handleChange}
                      placeholder="e.g., 250"
                    />
                    <span className="suffix">hp</span>
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specifications.torque">Torque</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="specifications.torque"
                      name="specifications.torque"
                      min="0"
                      value={formData.specifications.torque}
                      onChange={handleChange}
                      placeholder="e.g., 280"
                    />
                    <span className="suffix">lb-ft</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="specifications.acceleration">0-60 mph</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="specifications.acceleration"
                      name="specifications.acceleration"
                      min="0"
                      step="0.1"
                      value={formData.specifications.acceleration}
                      onChange={handleChange}
                      placeholder="e.g., 5.5"
                    />
                    <span className="suffix">sec</span>
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specifications.topSpeed">Top Speed</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="specifications.topSpeed"
                      name="specifications.topSpeed"
                      min="0"
                      value={formData.specifications.topSpeed}
                      onChange={handleChange}
                      placeholder="e.g., 155"
                    />
                    <span className="suffix">mph</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="specifications.fuelEconomy">Fuel Economy</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="specifications.fuelEconomy"
                      name="specifications.fuelEconomy"
                      min="0"
                      step="0.1"
                      value={formData.specifications.fuelEconomy}
                      onChange={handleChange}
                      placeholder="e.g., 32.5"
                    />
                    <span className="suffix">mpg</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Features</h3>
              <p className="feature-instruction">Select all features that apply:</p>
              <div className="feature-grid">
                {availableFeatures.map(feature => (
                  <div 
                    key={feature}
                    className={`feature-item ${formData.features.includes(feature) ? 'selected' : ''}`}
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    <span className="feature-checkbox">
                      {formData.features.includes(feature) ? '✓' : ''}
                    </span>
                    <span className="feature-label">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-btn">
                Previous Step
              </button>
              <button type="submit" className="submit-btn">
                {loading ? 'Adding Car...' : 'Save Car'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="enhanced-add-car-container">
      <h1 className="form-title">Add a New Car</h1>
      
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Basic Info</div>
        <div className={`progress-connector ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Car Details</div>
        <div className={`progress-connector ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Features & Specs</div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="multi-step-form">
        {renderFormStep()}
      </form>
    </div>
  );
};

export default AddCar;