import React from 'react';
import PropertyCard from './PropertyCard';
import './PropertyList.css';

const PropertyList = ({ properties, title }) => {
  return (
    <div className="property-list">
      {title && <h2 className="property-list-title">{title}</h2>}
      
      {properties.length === 0 ? (
        <div className="no-properties">
          <p>No properties found.</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
