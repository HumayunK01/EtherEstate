import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { getPropertyMetadata, formatPrice } from '../utils/propertyUtils';
import BuyModal from '../components/Modals/BuyModal';
import RentModal from '../components/Modals/RentModal';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, signer } = useWallet();
  const { tokenContract, marketContract } = useContract(signer);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentDays, setRentDays] = useState(1);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!tokenContract || !marketContract) return;

      try {
        setLoading(true);

        // Parse the ID to a number
        const tokenId = parseInt(id);

        // Check if the token exists
        try {
          try {
            // Get owner info
            const owner = await tokenContract.ownerOf(tokenId);

            // Get listing info
            const listing = await marketContract.listings(tokenId);

            // Get rental info
            const rental = await marketContract.rentals(tokenId);

            // Get metadata from our utility function
            // This will try to get it from localStorage first, then fall back to defaults
            const metadata = getPropertyMetadata(tokenId);

            // Check if the property is rented
            const isRented = rental.active;
            const renter = rental.renter;
            const rentalEndDate = rental.expiresAt.toString();

            setProperty({
              id: tokenId,
              title: metadata.name,
              description: metadata.description,
              location: metadata.location,
              imageUrl: metadata.image,
              bedrooms: metadata.bedrooms,
              bathrooms: metadata.bathrooms,
              area: metadata.area,
              price: listing.priceWei.toString(),
              forRent: listing.forRent,
              rentPrice: listing.rentPricePerDayWei.toString(),
              seller: listing.seller,
              owner,
              isListed: listing.active,
              isRented,
              renter,
              rentalEndDate
            });

            setLoading(false);
          } catch (err) {
            console.error(`Error processing token ${tokenId}:`, err);
            throw err;
          }
        } catch (err) {
          console.error(`Error fetching token ${tokenId}:`, err);
          setError(`Property #${tokenId} does not exist or is not available.`);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Error loading property details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, tokenContract, marketContract]);

  const handleBuy = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setShowBuyModal(true);
  };

  const handleRent = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setShowRentModal(true);
  };

  // Using formatPrice from propertyUtils

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-message">
        <p>Property not found</p>
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <div className="property-detail-container">
        <div className="property-detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Back
          </button>
          <div className="property-badges">
            {property.isListed ? (
              <div className="property-badge">
                {property.forRent ? 'For Rent' : 'For Sale'}
              </div>
            ) : (
              <div className="property-badge not-listed">Not Listed</div>
            )}

            {property.isRented && (
              <div className="property-badge rented">Currently Rented</div>
            )}
          </div>
        </div>

        <div className="property-detail-content">
          <div className="property-detail-image">
            <img src={property.imageUrl} alt={property.title} />
          </div>

          <div className="property-detail-info">
            <h1 className="property-title">{property.title}</h1>
            <p className="property-location">{property.location}</p>

            <div className="property-price">
              {property.forRent ? (
                <>
                  <span className="price">{formatPrice(property.rentPrice)} ETH</span>
                  <span className="price-period">/ day</span>
                </>
              ) : (
                <span className="price">{formatPrice(property.price)} ETH</span>
              )}
            </div>

            <div className="property-features">
              <div className="feature">
                <span className="feature-icon">🛏️</span>
                <span className="feature-value">{property.bedrooms}</span>
                <span className="feature-label">Bedrooms</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚿</span>
                <span className="feature-value">{property.bathrooms}</span>
                <span className="feature-label">Bathrooms</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📏</span>
                <span className="feature-value">{property.area}</span>
                <span className="feature-label">Sq Ft</span>
              </div>
            </div>

            <div className="property-description">
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>

            <div className="property-actions">
              {property.isListed ? (
                property.forRent ? (
                  property.isRented ? (
                    <div className="rental-info">
                      <p>This property is currently rented until {new Date(Number(property.rentalEndDate) * 1000).toLocaleDateString()}.</p>
                    </div>
                  ) : (
                    <button className="rent-button" onClick={handleRent}>Rent Now</button>
                  )
                ) : (
                  <button className="buy-button" onClick={handleBuy}>Buy Now</button>
                )
              ) : (
                <div className="not-listed-info">
                  <p>This property is not currently listed for sale or rent.</p>
                  {property.owner.toLowerCase() === account?.toLowerCase() && (
                    <button className="list-button" onClick={() => navigate('/list-property')}>List This Property</button>
                  )}
                </div>
              )}

              {/* Show ownership information */}
              <div className="ownership-info">
                <p>
                  <strong>Owner:</strong> {property.owner.toLowerCase() === account?.toLowerCase() ?
                    'You own this property' :
                    `${property.owner.substring(0, 6)}...${property.owner.substring(property.owner.length - 4)}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBuyModal && (
        <BuyModal
          property={property}
          onClose={() => setShowBuyModal(false)}
          marketContract={marketContract}
        />
      )}

      {showRentModal && (
        <RentModal
          property={property}
          onClose={() => setShowRentModal(false)}
          marketContract={marketContract}
          rentDays={rentDays}
          setRentDays={setRentDays}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
