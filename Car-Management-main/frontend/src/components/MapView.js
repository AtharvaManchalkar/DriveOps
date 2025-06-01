import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import '../styles/MapView.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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

// Custom car icon
const createCarIcon = (color = '#4299e1') => {
  return L.divIcon({
    className: 'custom-car-marker',
    html: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" fill="white" stroke="${color}" stroke-width="2"/>
      <path d="M27 19.5c0 .69-.28 1.32-.73 1.77s-1.08.73-1.77.73H12c-.69 0-1.32-.28-1.77-.73S9.5 20.19 9.5 19.5v-6c0-2.96 1.46-5 5-5h7c3.54 0 5 2.04 5 5v6Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 16h14M13.5 19h.01M22.5 19h.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const MapView = ({ selectedCarId = null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const carId = selectedCarId || id;
  
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Default to a central location
  const [mapZoom, setMapZoom] = useState(13);
  const [showDirections, setShowDirections] = useState(false);
  const [destination, setDestination] = useState('');
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  
  // Fetch car data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (carId) {
          // Fetch a specific car
          const { data } = await API.get(`/cars/${carId}`);
          if (data.location && data.location.coordinates) {
            setCars([data]);
            setSelectedCar(data);
            setMapCenter(data.location.coordinates);
            setMapZoom(15);
          } else {
            const { data: allCars } = await API.get('/cars');
            // Filter cars with location data
            const carsWithLocation = allCars.filter(car => car.location && car.location.coordinates);
            setCars(carsWithLocation);
            
            // If the selected car doesn't have location but exists, still select it
            if (data) {
              setSelectedCar(data);
            }
          }
        } else {
          // Fetch all cars
          const { data } = await API.get('/cars');
          // Filter cars with location data
          const carsWithLocation = data.filter(car => car.location && car.location.coordinates);
          setCars(carsWithLocation);
          
          // Center map based on all cars
          if (carsWithLocation.length > 0) {
            // Calculate the center of all coordinates
            const allCoords = carsWithLocation.map(car => car.location.coordinates);
            const avgLat = allCoords.reduce((sum, coord) => sum + coord[0], 0) / allCoords.length;
            const avgLng = allCoords.reduce((sum, coord) => sum + coord[1], 0) / allCoords.length;
            setMapCenter([avgLat, avgLng]);
          }
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        setError('Failed to load car data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [carId]);
  
  // Handler for when map is created
  const MapController = () => {
    const map = useMap();
    mapRef.current = map;
    
    useEffect(() => {
      if (map) {
        map.invalidateSize();
      }
    }, [map]);
    
    return null;
  };
  
  // Create a route
  const createRoute = (start, end) => {
    if (!mapRef.current) return;
    
    // Remove existing routing control if it exists
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    
    // Convert coordinates to L.latLng objects
    const startPoint = L.latLng(start[0], start[1]);
    const endPoint = L.latLng(end[0], end[1]);
    
    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: [startPoint, endPoint],
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#4299e1', weight: 4, opacity: 0.7 }]
      },
      createMarker: function() { return null; }, // Don't add default markers
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(mapRef.current);
    
    routingControlRef.current = routingControl;
    
    // Add route information to route details panel
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      
      // Update the route details in the UI
      const routeDetails = document.getElementById('route-details');
      if (routeDetails) {
        routeDetails.innerHTML = `
          <div class="route-summary">
            <div class="summary-item">
              <span class="summary-label">Distance:</span>
              <span class="summary-value">${(summary.totalDistance / 1609.34).toFixed(1)} miles</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Duration:</span>
              <span class="summary-value">${formatDuration(summary.totalTime)}</span>
            </div>
          </div>
        `;
      }
    });
  };
  
  // Format duration in seconds to readable time
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Handle destination search
  const handleRouteSearch = () => {
    if (!selectedCar || !selectedCar.location || !destination.trim()) return;
    
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`;
    
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0];
          createRoute(
            selectedCar.location.coordinates,
            [parseFloat(result.lat), parseFloat(result.lon)]
          );
        } else {
          setError('Location not found');
        }
      })
      .catch(err => {
        console.error('Error geocoding destination:', err);
        setError('Failed to find location');
      });
  };
  
  // Clear route
  const clearRoute = () => {
    if (routingControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
      
      const routeDetails = document.getElementById('route-details');
      if (routeDetails) {
        routeDetails.innerHTML = '';
      }
    }
  };

  if (loading) {
    return <div className="map-loading">Loading map data...</div>;
  }

  return (
    <div className="map-view-container">
      {error && <div className="map-error">{error}</div>}
      
      <div className="map-sidebar">
        <h2>{selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : 'Vehicle Map'}</h2>
        
        {selectedCar && (
          <div className="selected-car-info">
            {selectedCar.images && selectedCar.images.length > 0 && (
              <img 
                src={`http://localhost:5000/${selectedCar.images[0]}`} 
                alt={selectedCar.title}
                className="car-thumbnail"
                onError={(e) => { e.target.src = "/default-car.jpg"; }}
              />
            )}
            
            <h3>{selectedCar.title}</h3>
            
            {selectedCar.location && (
              <div className="car-location">
                <p><strong>Current Location:</strong></p>
                {selectedCar.location.address && (
                  <p className="address">{selectedCar.location.address}</p>
                )}
                <p className="coordinates">
                  Lat: {selectedCar.location.coordinates[0].toFixed(6)}, 
                  Lng: {selectedCar.location.coordinates[1].toFixed(6)}
                </p>
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                className="view-details-btn"
                onClick={() => navigate(`/cars/${selectedCar._id}`)}
              >
                Car Details
              </button>
              <button 
                className="toggle-directions-btn"
                onClick={() => setShowDirections(!showDirections)}
              >
                {showDirections ? 'Hide Directions' : 'Get Directions'}
              </button>
            </div>
            
            {showDirections && (
              <div className="directions-panel">
                <div className="destination-search">
                  <input 
                    type="text"
                    placeholder="Enter destination address"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRouteSearch()}
                  />
                  <button onClick={handleRouteSearch}>Go</button>
                </div>
                
                <div id="route-details" className="route-details"></div>
                
                {routingControlRef.current && (
                  <button onClick={clearRoute} className="clear-route-btn">
                    Clear Route
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {!selectedCar && (
          <div className="car-list">
            <h3>Available Vehicles</h3>
            {cars.length === 0 ? (
              <p className="no-cars">No vehicles with location data available.</p>
            ) : (
              <ul>
                {cars.map(car => (
                  <li key={car._id} 
                      className="car-item"
                      onClick={() => navigate(`/map/${car._id}`)}
                  >
                    <div className="car-item-details">
                      <h4>{car.year} {car.make} {car.model}</h4>
                      <p>{car.location && car.location.address ? car.location.address : 'Location set'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
        >
          <MapController />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {cars.map(car => (
            <Marker 
              key={car._id}
              position={car.location.coordinates}
              icon={createCarIcon(car._id === selectedCar?._id ? '#48bb78' : '#4299e1')}
            >
              <Popup>
                <div className="car-popup">
                  <h3>{car.year} {car.make} {car.model}</h3>
                  <p>{car.title}</p>
                  {car.location && car.location.address && (
                    <p><strong>Address:</strong> {car.location.address}</p>
                  )}
                  <div className="popup-actions">
                    <button onClick={() => navigate(`/cars/${car._id}`)}>
                      View Details
                    </button>
                    <button onClick={() => navigate(`/map/${car._id}`)}>
                      View on Map
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;