import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { useProperties } from '../hooks/useProperties';
import PropertyList from '../components/Property/PropertyList';
import FilterBar from '../components/Property/FilterBar';
import './AllProperties.css';

const AllProperties = () => {
  const { signer } = useWallet();
  const { tokenContract, marketContract } = useContract(signer);
  const { properties, loading, error } = useProperties(tokenContract, marketContract);
  
  const [filters, setFilters] = useState({
    forSale: true,
    forRent: true,
    minPrice: 0,
    maxPrice: Infinity,
    minBedrooms: 0,
    minBathrooms: 0
  });
  
  const [sortOption, setSortOption] = useState('newest');
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  useEffect(() => {
    if (properties.length > 0) {
      let filtered = [...properties];
      
      // Filter by property type (sale/rent)
      filtered = filtered.filter(property => {
        if (property.forRent && filters.forRent) return true;
        if (!property.forRent && filters.forSale) return true;
        return false;
      });
      
      // Filter by price
      filtered = filtered.filter(property => {
        const price = property.forRent 
          ? ethers.formatEther(property.rentPrice) 
          : ethers.formatEther(property.price);
        return price >= filters.minPrice && price <= filters.maxPrice;
      });
      
      // Filter by bedrooms
      if (filters.minBedrooms > 0) {
        filtered = filtered.filter(property => property.bedrooms >= filters.minBedrooms);
      }
      
      // Filter by bathrooms
      if (filters.minBathrooms > 0) {
        filtered = filtered.filter(property => property.bathrooms >= filters.minBathrooms);
      }
      
      // Sort properties
      switch (sortOption) {
        case 'price-low-high':
          filtered.sort((a, b) => {
            const priceA = a.forRent ? ethers.formatEther(a.rentPrice) : ethers.formatEther(a.price);
            const priceB = b.forRent ? ethers.formatEther(b.rentPrice) : ethers.formatEther(b.price);
            return priceA - priceB;
          });
          break;
        case 'price-high-low':
          filtered.sort((a, b) => {
            const priceA = a.forRent ? ethers.formatEther(a.rentPrice) : ethers.formatEther(a.price);
            const priceB = b.forRent ? ethers.formatEther(b.rentPrice) : ethers.formatEther(b.price);
            return priceB - priceA;
          });
          break;
        case 'newest':
        default:
          // Assuming newer properties have higher IDs
          filtered.sort((a, b) => b.id - a.id);
          break;
      }
      
      setFilteredProperties(filtered);
    }
  }, [properties, filters, sortOption]);
  
  return (
    <div className="all-properties-page">
      <div className="page-header">
        <h1>All Properties</h1>
        <p>Browse our selection of properties available for sale and rent</p>
      </div>
      
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading properties...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error loading properties: {error}</p>
        </div>
      ) : (
        <>
          {filteredProperties.length === 0 ? (
            <div className="no-properties-message">
              <p>No properties match your current filters. Try adjusting your search criteria.</p>
              <button 
                className="reset-filters-button"
                onClick={() => {
                  setFilters({
                    forSale: true,
                    forRent: true,
                    minPrice: 0,
                    maxPrice: Infinity,
                    minBedrooms: 0,
                    minBathrooms: 0
                  });
                  setSortOption('newest');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <PropertyList properties={filteredProperties} />
          )}
        </>
      )}
    </div>
  );
};

export default AllProperties;
