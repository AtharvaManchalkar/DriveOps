import React, { useState } from 'react';
import axios from 'axios';
import '../styles/VinDecoder.css';

const VinDecoder = ({ onVinDecoded }) => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decodedData, setDecodedData] = useState(null);

  const handleVinChange = (e) => {
    setVin(e.target.value.trim().toUpperCase());
    setError('');
  };

  const decodeVin = async () => {
    if (!vin || vin.length !== 17) {
      setError('Please enter a valid 17-character VIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Using NHTSA API which is free and doesn't require API key
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
      
      if (response.data && response.data.Results) {
        const results = response.data.Results;
        
        // Extract relevant information
        const vehicleData = {
          make: getValueByVariable(results, 'Make'),
          model: getValueByVariable(results, 'Model'),
          year: getValueByVariable(results, 'Model Year'),
          trim: getValueByVariable(results, 'Trim'),
          engine: getValueByVariable(results, 'Engine Configuration') + ' ' + getValueByVariable(results, 'Displacement (L)') + 'L',
          fuelType: getValueByVariable(results, 'Fuel Type - Primary'),
          transmission: getValueByVariable(results, 'Transmission Style'),
          bodyType: getValueByVariable(results, 'Body Class'),
          driveType: getValueByVariable(results, 'Drive Type'),
          manufacturer: getValueByVariable(results, 'Manufacturer Name'),
          plantCountry: getValueByVariable(results, 'Plant Country'),
        };
        
        setDecodedData(vehicleData);
        
        // If callback exists, call it with decoded data
        if (onVinDecoded && typeof onVinDecoded === 'function') {
          onVinDecoded(vehicleData);
        }
      } else {
        setError('Could not decode VIN data');
      }
    } catch (error) {
      console.error('Error decoding VIN:', error);
      setError('Failed to decode VIN. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract values from NHTSA API response
  const getValueByVariable = (results, variableName) => {
    const item = results.find(item => item.Variable === variableName);
    return item && item.Value !== null && item.Value !== '' ? item.Value : 'N/A';
  };

  const applyDecodedData = () => {
    if (onVinDecoded && typeof onVinDecoded === 'function') {
      onVinDecoded(decodedData);
    }
    setDecodedData(null);
    setVin('');
  };

  return (
    <div className="vin-decoder">
      <div className="decoder-header">
        <h2>VIN Decoder</h2>
        <p>Enter a valid Vehicle Identification Number to automatically retrieve vehicle details.</p>
      </div>
      
      <div className="vin-input-container">
        <input
          type="text"
          value={vin}
          onChange={handleVinChange}
          placeholder="Enter 17-character VIN"
          maxLength={17}
          className="vin-input"
        />
        <button 
          onClick={decodeVin} 
          disabled={loading || !vin || vin.length !== 17}
          className="decode-button"
        >
          {loading ? 'Decoding...' : 'Decode VIN'}
        </button>
      </div>
      
      {error && <div className="vin-error">{error}</div>}
      
      {decodedData && (
        <div className="decoded-data">
          <h3>Decoded Vehicle Information</h3>
          
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Make</span>
              <span className="data-value">{decodedData.make}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Model</span>
              <span className="data-value">{decodedData.model}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Year</span>
              <span className="data-value">{decodedData.year}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Trim</span>
              <span className="data-value">{decodedData.trim}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Body Type</span>
              <span className="data-value">{decodedData.bodyType}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Engine</span>
              <span className="data-value">{decodedData.engine}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Fuel Type</span>
              <span className="data-value">{decodedData.fuelType}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Transmission</span>
              <span className="data-value">{decodedData.transmission}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Drive Type</span>
              <span className="data-value">{decodedData.driveType}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Manufacturer</span>
              <span className="data-value">{decodedData.manufacturer}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Country</span>
              <span className="data-value">{decodedData.plantCountry}</span>
            </div>
          </div>
          
          <div className="decoder-actions">
            <button onClick={applyDecodedData} className="apply-data-button">
              Use This Data
            </button>
            <button onClick={() => setDecodedData(null)} className="reset-button">
              Reset
            </button>
          </div>
        </div>
      )}
      
      <div className="vin-help">
        <h4>Where to find your VIN</h4>
        <ul>
          <li>Driver's side dashboard visible through the windshield</li>
          <li>Driver's side door jamb</li>
          <li>Vehicle registration or insurance documents</li>
          <li>Vehicle's title</li>
        </ul>
      </div>
    </div>
  );
};

export default VinDecoder;