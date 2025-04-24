import { ethers } from 'ethers';

/**
 * Creates a new property by minting a token and listing it on the marketplace
 * Note: In a production environment, the minting would be done by a backend service
 * since only the contract owner can mint tokens
 *
 * @param {Object} tokenContract - The token contract instance
 * @param {Object} marketContract - The marketplace contract instance
 * @param {Object} propertyData - The property data
 * @param {string} account - The user's account address
 * @returns {Promise<Object>} - The result of the operation
 */
export const createProperty = async (tokenContract, marketContract, propertyData, account) => {
  try {
    // In a real application, you would upload metadata to IPFS
    // For demo purposes, we'll use a mock URL
    const tokenURI = `https://example.com/metadata/${Date.now()}.json`;

    // Get the current token ID
    const nextTokenId = await tokenContract.nextTokenId();
    const tokenId = Number(nextTokenId);

    // Convert prices to Wei
    const priceWei = ethers.parseEther(propertyData.forRent ? '0' : propertyData.price);
    const rentPriceWei = ethers.parseEther(propertyData.forRent ? propertyData.rentPrice : '0');

    // For testing purposes, we'll assume the token is already minted
    // In a real application, this would be done by the contract owner through a backend service
    // const mintTx = await tokenContract.mintProperty(account, tokenURI);
    // await mintTx.wait();

    // List the property on the marketplace
    const listTx = await marketContract.listProperty(
      tokenId,
      priceWei,
      propertyData.forRent,
      rentPriceWei
    );

    // Wait for the transaction to be mined
    await listTx.wait();

    return {
      success: true,
      tokenId,
      message: 'Property listed successfully'
    };
  } catch (error) {
    console.error('Error creating property:', error);

    let errorMessage = error.message;

    if (error.message.includes('execution reverted')) {
      if (error.message.includes('Not owner')) {
        errorMessage = 'You must own the token to list it. In a production environment, the token would be minted for you first.';
      } else if (error.message.includes('call revert exception')) {
        errorMessage = 'Transaction failed. This could be because the token does not exist yet. In a production environment, the token would be minted for you first.';
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
 * Formats a price from wei to ETH
 * @param {string} priceInWei - The price in wei
 * @returns {string} - The formatted price in ETH
 */
export const formatPrice = (priceInWei) => {
  return ethers.formatEther(priceInWei);
};

/**
 * Truncates an address for display
 * @param {string} address - The address to truncate
 * @returns {string} - The truncated address
 */
export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Get property metadata from localStorage
 * This is a helper function for demo purposes
 * In a real app, this would fetch from IPFS or a similar service
 *
 * @param {number} tokenId - The token ID
 * @returns {Object|null} - The property metadata or null if not found
 */
export const getPropertyMetadata = (tokenId) => {
  const specificKey = `property_metadata_token_${tokenId}`;
  const metadata = localStorage.getItem(specificKey);
  
  if (metadata) {
    try {
      return JSON.parse(metadata);
    } catch (err) {
      console.error(`Error parsing metadata for token ${tokenId}:`, err);
    }
  }

  // If no metadata found, return null instead of default metadata
  return null;
};

