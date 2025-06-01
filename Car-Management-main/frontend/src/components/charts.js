import React from 'react';
import '../styles/Charts.css';

// Simple Pie Chart implementation using CSS and SVG
export const PieChart = ({ data }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <div className="pie-chart-container">
      <div className="pie-chart">
        <svg viewBox="0 0 100 100">
          {data.map((item, i) => {
            const percentage = (item.value / totalValue) * 100;
            const startAngle = cumulativePercentage;
            cumulativePercentage += percentage;
            
            // Calculate SVG path for arc
            const x1 = 50 + 50 * Math.cos(2 * Math.PI * startAngle / 100);
            const y1 = 50 + 50 * Math.sin(2 * Math.PI * startAngle / 100);
            const x2 = 50 + 50 * Math.cos(2 * Math.PI * cumulativePercentage / 100);
            const y2 = 50 + 50 * Math.sin(2 * Math.PI * cumulativePercentage / 100);
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');
            
            return (
              <path 
                key={i} 
                d={pathData} 
                fill={`hsl(${i * 60}, 70%, 50%)`}
                data-label={item.label}
                data-value={item.value}
              />
            );
          })}
        </svg>
      </div>
      
      <div className="pie-chart-legend">
        {data.map((item, i) => (
          <div key={i} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: `hsl(${i * 60}, 70%, 50%)` }}
            ></div>
            <div className="legend-text">
              {item.label}: {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Bar Graph implementation
export const BarGraph = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bar-graph-container">
      <div className="bar-graph">
        {data.map((item, i) => (
          <div key={i} className="bar-container">
            <div className="bar-label">{item.label}</div>
            <div className="bar-wrapper">
              <div 
                className="bar" 
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: `hsl(${i * 60}, 70%, 50%)` 
                }}
                data-value={item.value}
              ></div>
            </div>
            <div className="bar-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stat Card Component
export const StatCard = ({ title, value, icon }) => {
  const getIconClass = (iconName) => {
    switch(iconName) {
      case 'car': return 'fas fa-car';
      case 'tag': return 'fas fa-tags';
      case 'star': return 'fas fa-star';
      default: return 'fas fa-chart-bar';
    }
  };
  
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={getIconClass(icon)}></i>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};