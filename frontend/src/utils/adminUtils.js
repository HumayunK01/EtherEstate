import { ethers } from 'ethers';

/**
 * Mints a new property token (only callable by contract owner)
 * This function is for testing purposes only and would typically be done by a backend service
 * 
 * @param {Object} tokenContract - The token contract instance
 * @param {string} ownerAddress - The address that will own the token
 * @param {string} metadataURI - The URI pointing to the token metadata
 * @returns {Promise<Object>} - The result of the operation
 */
export const mintPropertyToken = async (tokenContract, ownerAddress, metadataURI) => {
  try {
    const mintTx = await tokenContract.mintProperty(ownerAddress, metadataURI);
    const receipt = await mintTx.wait();
    
    // Get the token ID and ensure it's handled as BigInt
    const nextTokenId = await tokenContract.nextTokenId();
    const tokenId = nextTokenId - 1n;
    
    return {
      success: true,
      tokenId: tokenId.toString(), // Convert to string for JSON
      txHash: receipt.hash,
      message: 'Property token minted successfully'
    };
  } catch (error) {
    console.error('Error minting property token:', error);
    
    let errorMessage = error.message;
    
    if (error.message.includes('execution reverted')) {
      if (error.message.includes('onlyOwner')) {
        errorMessage = 'Only the contract owner can mint new property tokens.';
      } else {
        errorMessage = 'Transaction failed. Please check that you have the correct permissions and try again.';
      }
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Creates metadata for a property token
 * In a production environment, this would be uploaded to IPFS
 * 
 * @param {Object} propertyData - The property data
 * @returns {Object} - The metadata object
 */
export const createPropertyMetadata = (propertyData) => {
  return {
    name: propertyData.title,
    description: propertyData.description,
    location: propertyData.location,
    image: propertyData.imageUrl,
    bedrooms: parseInt(propertyData.bedrooms),
    bathrooms: parseInt(propertyData.bathrooms),
    area: parseInt(propertyData.area),
    attributes: [
      {
        trait_type: 'Bedrooms',
        value: parseInt(propertyData.bedrooms)
      },
      {
        trait_type: 'Bathrooms',
        value: parseInt(propertyData.bathrooms)
      },
      {
        trait_type: 'Area',
        value: parseInt(propertyData.area),
        unit: 'sq ft'
      },
      {
        trait_type: 'Property Type',
        value: propertyData.forRent ? 'For Rent' : 'For Sale'
      }
    ]
  };
};

