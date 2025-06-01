import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { PieChart, BarGraph, StatCard } from './charts';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    tagsCount: {},
    recentlyAdded: [],
    mostViewedCars: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch car data
        const { data: cars } = await API.get('/cars');
        
        // Process stats
        const tagsCount = {};
        cars.forEach(car => {
          car.tags.forEach(tag => {
            tagsCount[tag] = (tagsCount[tag] || 0) + 1;
          });
        });
        
        // Sort cars by date added (descending)
        const recentlyAdded = [...cars]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
          
        // In a real application, you'd fetch view counts from the backend
        const mockViewCounts = cars.map(car => ({ 
          ...car, 
          viewCount: Math.floor(Math.random() * 100) 
        }));
        
        const mostViewedCars = mockViewCounts
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 5);
        
        setStats({
          totalCars: cars.length,
          tagsCount,
          recentlyAdded,
          mostViewedCars
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-overview">
        <StatCard 
          title="Total Cars" 
          value={stats.totalCars} 
          icon="car" 
        />
        <StatCard 
          title="Total Tags" 
          value={Object.keys(stats.tagsCount).length} 
          icon="tag" 
        />
        <StatCard 
          title="Most Popular Tag" 
          value={Object.entries(stats.tagsCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
          icon="star" 
        />
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <h2>Tag Distribution</h2>
          <PieChart 
            data={Object.entries(stats.tagsCount)
              .map(([label, value]) => ({ label, value }))
              .slice(0, 5)} 
          />
        </div>
        
        <div className="chart-card">
          <h2>Most Viewed Cars</h2>
          <BarGraph 
            data={stats.mostViewedCars.map(car => ({
              label: car.title,
              value: car.viewCount
            }))}
          />
        </div>
      </div>
      
      <div className="recent-cars">
        <h2>Recently Added Cars</h2>
        <div className="recent-cars-list">
          {stats.recentlyAdded.map(car => (
            <div 
              key={car._id} 
              className="recent-car-card"
              onClick={() => navigate(`/cars/${car._id}`)}
            >
              <img 
                src={car.images && car.images.length > 0 
                  ? `http://localhost:5000/${car.images[0]}` 
                  : "/default-car.jpg"
                } 
                alt={car.title} 
                className="recent-car-image"
                onError={(e) => { e.target.src = "/default-car.jpg"; }}
              />
              <div className="recent-car-info">
                <h3>{car.title}</h3>
                <p>{new Date(car.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;