import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Import our enhanced components
import AddCar from "./components/AddCar";
import CarDetail from "./components/CarDetail";
import CarComparison from "./components/CarComparison";
import Dashboard from "./components/Dashboard";

// Import Terms and Privacy for legal pages
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";

// Import Map components
import MapView from "./components/MapView";

function App() {
  return (
    <Router>
      <Navbar />
      <div className='App'>
        <Routes>
          {/* Authentication Routes */}
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* Legal Pages */}
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
          
          {/* Main Application Routes */}
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          
          {/* Car Management Routes */}
          <Route path='/add-car' element={<AddCar />} />
          <Route path='/cars/:id' element={<CarDetail />} />
          <Route path='/compare' element={<CarComparison />} />
          
          {/* Map Routes */}
          <Route path='/map' element={<MapView />} />
          <Route path='/map/:id' element={<MapView />} />
          
          {/* Additional routes can be added as needed */}
          <Route path='*' element={
            <div className="not-found">
              <h2>404 - Page Not Found</h2>
              <p>The page you are looking for doesn't exist.</p>
              <button onClick={() => window.location.href = '/home'}>
                Return to Home
              </button>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;