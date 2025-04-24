import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    location,
    imageUrl,
    price,
    forRent,
    rentPrice,
    bedrooms,
    bathrooms,
    area
  } = property;

  // Format price from wei to ETH
  const formatPrice = (priceInWei) => {
    return ethers.formatEther(priceInWei);
  };

  const handleViewDetails = () => {
    navigate(`/property/${id}`);
  };

  const handleAction = () => {
    navigate(`/property/${id}`);
  };

  return (
    <div className="property-card">
      <div className="property-image" onClick={handleViewDetails}>
        <img src={imageUrl} alt={title} />
        <div className="property-badge">
          {forRent ? 'For Rent' : 'For Sale'}
        </div>
      </div>
      <div className="property-content">
        <h3 className="property-title" onClick={handleViewDetails}>{title}</h3>
        <p className="property-location">{location}</p>

        <div className="property-features">
          <div className="feature">
            <span className="feature-value">{bedrooms}</span>
            <span className="feature-label">Beds</span>
          </div>
          <div className="feature">
            <span className="feature-value">{bathrooms}</span>
            <span className="feature-label">Baths</span>
          </div>
          <div className="feature">
            <span className="feature-value">{area}</span>
            <span className="feature-label">Sq Ft</span>
          </div>
        </div>

        <div className="property-price">
          {forRent ? (
            <>
              <span className="price">{formatPrice(rentPrice)} ETH</span>
              <span className="price-period">/ day</span>
            </>
          ) : (
            <span className="price">{formatPrice(price)} ETH</span>
          )}
        </div>

        <div className="property-actions">
          <button className="view-button" onClick={handleViewDetails}>View Details</button>
          <button className="action-button" onClick={handleAction}>
            {forRent ? 'Rent Now' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
