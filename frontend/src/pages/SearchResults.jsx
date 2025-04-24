import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { useProperties } from '../hooks/useProperties';
import PropertyList from '../components/Property/PropertyList';
import './SearchResults.css';

const SearchResults = ({ searchQuery }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = searchQuery || queryParams.get('q') || '';
  
  const { signer } = useWallet();
  const { tokenContract, marketContract } = useContract(signer);
  const { properties, loading, error } = useProperties(tokenContract, marketContract);
  
  const [searchResults, setSearchResults] = useState([]);
  
  useEffect(() => {
    if (properties.length > 0 && query) {
      const lowerCaseQuery = query.toLowerCase();
      
      const filtered = properties.filter(property => {
        return (
          property.title.toLowerCase().includes(lowerCaseQuery) ||
          property.location.toLowerCase().includes(lowerCaseQuery) ||
          (property.description && property.description.toLowerCase().includes(lowerCaseQuery))
        );
      });
      
      setSearchResults(filtered);
    }
  }, [properties, query]);
  
  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <p>Showing results for: <span className="search-query">"{query}"</span></p>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Searching properties...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error searching properties: {error}</p>
        </div>
      ) : (
        <>
          {searchResults.length === 0 ? (
            <div className="no-results-message">
              <p>No properties match your search query. Try different keywords.</p>
              <div className="search-suggestions">
                <h3>Suggestions:</h3>
                <ul>
                  <li>Check the spelling of your search terms</li>
                  <li>Try more general keywords</li>
                  <li>Try searching by location (city, neighborhood)</li>
                  <li>Try searching by property features (bedrooms, bathrooms)</li>
                </ul>
              </div>
            </div>
          ) : (
            <PropertyList properties={searchResults} />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
