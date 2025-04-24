import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, setFilters, sortOption, setSortOption }) => {
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'priceRange') {
      const [min, max] = value.split('-').map(val => val === 'max' ? Infinity : Number(val));
      setFilters(prev => ({
        ...prev,
        minPrice: min,
        maxPrice: max
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleReset = () => {
    setFilters({
      forSale: true,
      forRent: true,
      minPrice: 0,
      maxPrice: Infinity,
      minBedrooms: 0,
      minBathrooms: 0
    });
    setSortOption('newest');
  };
  
  return (
    <div className="filter-bar">
      <div className="filter-section">
        <h3>Property Type</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="forSale" 
              checked={filters.forSale} 
              onChange={handleFilterChange} 
            />
            For Sale
          </label>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="forRent" 
              checked={filters.forRent} 
              onChange={handleFilterChange} 
            />
            For Rent
          </label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Price Range</h3>
        <select 
          name="priceRange" 
          value={`${filters.minPrice}-${filters.maxPrice === Infinity ? 'max' : filters.maxPrice}`} 
          onChange={handleFilterChange}
          className="select-input"
        >
          <option value="0-max">Any Price</option>
          <option value="0-1">0 - 1 ETH</option>
          <option value="1-5">1 - 5 ETH</option>
          <option value="5-10">5 - 10 ETH</option>
          <option value="10-50">10 - 50 ETH</option>
          <option value="50-100">50 - 100 ETH</option>
          <option value="100-max">100+ ETH</option>
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Bedrooms</h3>
        <select 
          name="minBedrooms" 
          value={filters.minBedrooms} 
          onChange={handleFilterChange}
          className="select-input"
        >
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Bathrooms</h3>
        <select 
          name="minBathrooms" 
          value={filters.minBathrooms} 
          onChange={handleFilterChange}
          className="select-input"
        >
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Sort By</h3>
        <select 
          value={sortOption} 
          onChange={handleSortChange}
          className="select-input"
        >
          <option value="newest">Newest</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>
      
      <button className="reset-button" onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;
