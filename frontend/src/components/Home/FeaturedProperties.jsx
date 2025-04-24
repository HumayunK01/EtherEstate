import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from '../Property/PropertyList';
import './FeaturedProperties.css';

const FeaturedProperties = ({ properties }) => {
  const navigate = useNavigate();

  // Filter for featured properties (could be based on various criteria)
  const featuredProperties = properties.slice(0, 3); // Just take first 3 for demo

  const handleViewAll = () => {
    navigate('/properties');
  };

  return (
    <div className="featured-properties">
      <div className="featured-header">
        <h2 className="featured-title">Featured Properties</h2>
        <p className="featured-subtitle">
          Discover our handpicked selection of premium properties available on the blockchain
        </p>
      </div>

      <PropertyList properties={featuredProperties} />

      <div className="featured-cta">
        <button className="view-all-button" onClick={handleViewAll}>View All Properties</button>
      </div>
    </div>
  );
};

export default FeaturedProperties;
