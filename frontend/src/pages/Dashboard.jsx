import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import PropertyList from '../components/Property/PropertyList';
import { formatPrice, truncateAddress, getPropertyMetadata } from '../utils/propertyUtils';
import './Dashboard.css';

const Dashboard = () => {
  const { account, signer } = useWallet();
  const { tokenContract, marketContract } = useContract(signer);

  const [ownedProperties, setOwnedProperties] = useState([]);
  const [listedProperties, setListedProperties] = useState([]);
  const [rentedProperties, setRentedProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('owned');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!tokenContract || !marketContract || !account) return;

      try {
        setLoading(true);

        // Get the next token ID to know how many tokens exist
        let nextTokenId;
        try {
          nextTokenId = await tokenContract.nextTokenId();
        } catch (err) {
          console.error('Error fetching nextTokenId:', err);
          // If we can't get the next token ID, assume there are no tokens yet
          setOwnedProperties([]);
          setListedProperties([]);
          setRentedProperties([]);
          setLoading(false);
          return;
        }

        // Create an array of token IDs from 0 to nextTokenId-1
        const tokenIds = Array.from({ length: Number(nextTokenId) }, (_, i) => i);

        const owned = [];
        const listed = [];
        const rented = [];

        // Process each token one by one instead of using Promise.all
        // This gives us more control over error handling
        for (const id of tokenIds) {
          try {
            // Check if the user owns this token
            let owner;
            let isOwner = false;

            try {
              owner = await tokenContract.ownerOf(id);
              // Convert addresses to lowercase for case-insensitive comparison
              isOwner = owner.toLowerCase() === account.toLowerCase();
            } catch (err) {
              console.error(`Error checking ownership for token ${id}:`, err);
              // Skip to the next token if we can't check ownership
              continue;
            }

            // Get listing info
            const listing = await marketContract.listings(id);
            const isLister = listing.seller.toLowerCase() === account.toLowerCase();

            // Get rental info
            const rental = await marketContract.rentals(id);

            // Check if the current user is the renter
            const isRenter = rental.renter.toLowerCase() === account.toLowerCase();

            // We'll check if the rental is active when needed

            if (isOwner || isLister || isRenter) {
              // Get metadata from our utility function
              const metadata = getPropertyMetadata(id);

              const propertyData = {
                id,
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
                active: listing.active,
                rental: {
                  renter: rental.renter,
                  endDate: rental.expiresAt.toString(),
                  active: rental.renter !== '0x0000000000000000000000000000000000000000' &&
                          Number(rental.expiresAt) > Math.floor(Date.now() / 1000)
                }
              };

              if (isOwner) {
                owned.push(propertyData);
              }

              if (isLister && listing.active) {
                listed.push(propertyData);
              }

              // Add to rented properties if user is the renter and the rental is still active
              if (isRenter && rental.renter !== '0x0000000000000000000000000000000000000000' &&
                  Number(rental.expiresAt) > Math.floor(Date.now() / 1000)) {
                rented.push(propertyData);
              }
            }
          } catch (err) {
            console.error(`Error processing property ${id}:`, err);
            // Continue to the next token
          }
        }

        // No mock data - we'll only show real properties from the blockchain

        setOwnedProperties(owned);
        setListedProperties(listed);
        setRentedProperties(rented);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user properties:', err);

        // Provide a more informative error message
        if (err.message.includes('call revert exception')) {
          setError('Unable to fetch properties. Please make sure you are connected to the correct network.');
        } else {
          setError(`Error fetching properties: ${err.message}`);
        }

        // Set empty arrays for properties
        setOwnedProperties([]);
        setListedProperties([]);
        setRentedProperties([]);
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [tokenContract, marketContract, account]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'owned':
        return (
          <>
            <div className="tab-header">
              <h2>My Properties</h2>
              <p>Properties you own</p>
            </div>
            {ownedProperties.length === 0 ? (
              <div className="empty-state">
                <p>You don't own any properties yet.</p>
                <Link to="/properties" className="action-button">Browse Properties</Link>
              </div>
            ) : (
              <PropertyList properties={ownedProperties} />
            )}
          </>
        );
      case 'listed':
        return (
          <>
            <div className="tab-header">
              <h2>My Listings</h2>
              <p>Properties you have listed for sale or rent</p>
            </div>
            {listedProperties.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any active listings.</p>
                <Link to="/list-property" className="action-button">List a Property</Link>
              </div>
            ) : (
              <PropertyList properties={listedProperties} />
            )}
          </>
        );
      case 'rented':
        return (
          <>
            <div className="tab-header">
              <h2>My Rentals</h2>
              <p>Properties you are currently renting</p>
            </div>
            {rentedProperties.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any active rentals.</p>
                <Link to="/properties" className="action-button">Find Rentals</Link>
              </div>
            ) : (
              <PropertyList properties={rentedProperties} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading your properties...</p>
      </div>
    );
  }

  // We'll show a warning message if there's an error, but still display the demo data

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Manage your real estate portfolio</p>
      </div>

      {error && (
        <div className="welcome-message">
          <p>Welcome to your dashboard! You don't have any properties yet.</p>
          <p>You can mint a new property token or browse existing properties.</p>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{ownedProperties.length}</div>
          <div className="stat-label">Properties Owned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{listedProperties.length}</div>
          <div className="stat-label">Active Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rentedProperties.length}</div>
          <div className="stat-label">Active Rentals</div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/list-property" className="list-property-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          List a New Property
        </Link>

        <Link to="/admin/mint" className="admin-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          </svg>
          Admin: Mint Token
        </Link>
      </div>

      <div className="dashboard-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'owned' ? 'active' : ''}`}
            onClick={() => handleTabChange('owned')}
          >
            My Properties
          </button>
          <button
            className={`tab-button ${activeTab === 'listed' ? 'active' : ''}`}
            onClick={() => handleTabChange('listed')}
          >
            My Listings
          </button>
          <button
            className={`tab-button ${activeTab === 'rented' ? 'active' : ''}`}
            onClick={() => handleTabChange('rented')}
          >
            My Rentals
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
