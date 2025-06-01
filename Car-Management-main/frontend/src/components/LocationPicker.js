import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/LocationPicker.css';

// Fix for default icons in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ initialLocation, onLocationChange, disabled = false }) => {
  const [position, setPosition] = useState(initialLocation?.coordinates || [12.9716, 77.5946]);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const markerRef = useRef(null);
  
  // Update state when initialLocation prop changes
  useEffect(() => {
    if (initialLocation?.coordinates) {
      setPosition(initialLocation.coordinates);
      setAddress(initialLocation.address || '');
    }
  }, [initialLocation]);
  
  // Map drag handler component
  const MapController = () => {
    const map = useMap();
    
    // When location picker is not disabled, handle map click to update marker
    useEffect(() => {
      if (disabled) return;
      
const handleMapClick = (e) => {
  const { lat, lng } = e.latlng;
  const numericLat = parseFloat(lat);
  const numericLng = parseFloat(lng);
  
  // Only proceed if coordinates are valid numbers
  if (!isNaN(numericLat) && !isNaN(numericLng)) {
    setPosition([numericLat, numericLng]);
    
    // Reverse geocode to get address
    fetchAddress([numericLat, numericLng]);
    
    // Call the callback with updated location
    if (onLocationChange) {
      onLocationChange({
        coordinates: [numericLat, numericLng],
        address: address
      });
    }
  }
};
      map.on('click', handleMapClick);
      
      return () => {
        map.off('click', handleMapClick);
      };
    }, [map]);
    
    return null;
  };
  
  // Function to fetch address from coordinates
  const fetchAddress = async (coords) => {
    try {
      const [lat, lng] = coords;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
        
        // Update the location data with the new address
        if (onLocationChange) {
          onLocationChange({
            coordinates: coords,
            address: data.display_name
          });
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };
  
  // Handle marker drag end
  const handleMarkerDragEnd = () => {
    if (!markerRef.current) return;
    
    const marker = markerRef.current;
    const { lat, lng } = marker.getLatLng();
    setPosition([lat, lng]);
    
    // Reverse geocode to get address
    fetchAddress([lat, lng]);
  };
  
  // Handle search for location
  // Update the handleSearch function to not expect an event with preventDefault

const handleSearch = (e) => {
  // Prevent form submission if an event is passed
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  if (!searchQuery || isSearching) return;
  
  setIsSearching(true);
  
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
    .then(response => response.json())
    .then(data => {
      setIsSearching(false);
      
      if (data.length > 0) {
        const result = data[0];
        const newPosition = [parseFloat(result.lat), parseFloat(result.lon)];
        setPosition(newPosition);
        
        // if (mapRef.current) {
        //   mapRef.current.flyTo(newPosition, 13);
        // }
        
        // Fetch the address for the new position
        fetchAddress(newPosition);
      } else {
        alert('No results found for your search.');
      }
    })
    .catch(error => {
      setIsSearching(false);
      console.error('Error searching location:', error);
    });
};
  
  return (
    <div className="location-picker">
    {!disabled && (
      <div className="location-search-container">
        {/* Replace the form with a div and handle submission manually */}
        <div className="search-form">
          <input
            type="text"
            placeholder="Search for address or place"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            className="location-search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button 
            type="button"  // Changed from submit to button
            className="location-search-button"
            disabled={isSearching}
            onClick={handleSearch}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    )}  
      <div className="location-map-container">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          style={{ height: disabled ? '200px' : '300px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker
            position={position}
            draggable={!disabled}
            eventHandlers={
              disabled ? {} : { dragend: handleMarkerDragEnd }
            }
            ref={markerRef}
          />
          
          <MapController />
        </MapContainer>
      </div>
      
      {address && (
        <div className="location-details">
          <h4>Selected Location</h4>
          <p className="location-address">{address}</p>
          <p className="location-coordinates">
            Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
          </p>
        </div>
      )}
      
      {!disabled && !address && (
        <div className="location-instructions">
          <p>Click on the map to set a location or search for an address above.</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;