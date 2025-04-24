import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/properties');
  };

  const handleListClick = () => {
    navigate('/list-property');
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Find Your Dream Property on the <span>Blockchain</span>
        </h1>
        <p className="hero-subtitle">
          Buy, sell, and rent properties with the security and transparency of blockchain technology.
        </p>
        <div className="hero-buttons">
          <button className="primary-button" onClick={handleExploreClick}>Explore Properties</button>
          <button className="secondary-button" onClick={handleListClick}>List Your Property</button>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-value">100+</span>
          <span className="stat-label">Properties</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">50+</span>
          <span className="stat-label">Transactions</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">30+</span>
          <span className="stat-label">Users</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
