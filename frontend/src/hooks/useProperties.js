import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getPropertyMetadata } from '../utils/propertyUtils';

export function useProperties(tokenContract, marketContract) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!tokenContract || !marketContract) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get the next token ID to know how many tokens exist
        let nextTokenId;
        try {
          nextTokenId = await tokenContract.nextTokenId();
        } catch (err) {
          console.log('Error fetching nextTokenId:', err);
          // If we can't get the next token ID, assume there are no tokens yet
          setProperties([]);
          setLoading(false);
          return;
        }

        // Create an array of token IDs from 0 to nextTokenId-1
        const tokenIds = Array.from({ length: Number(nextTokenId) }, (_, i) => i);

        // Fetch property data for each token
        const propertiesData = await Promise.all(
          tokenIds.map(async (id) => {
            try {
              // Get metadata first
              const metadata = getPropertyMetadata(id);
              if (!metadata) {
                return null;
              }

              // Get listing info
              const listing = await marketContract.listings(id);
              if (!listing.active) {
                return null;
              }

              // Get owner info
              const owner = await tokenContract.ownerOf(id);

              return {
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
                owner
              };
            } catch (err) {
              console.error(`Error fetching property ${id}:`, err);
              return null;
            }
          })
        );

        // Filter out null values (tokens that don't exist or aren't active listings)
        const validProperties = propertiesData.filter(property => property !== null);

        setProperties(validProperties);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [tokenContract, marketContract]);

  // No mock data - we'll only show real properties from the blockchain

  return { properties, loading, error };
}

