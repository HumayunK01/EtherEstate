import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import './ListProperty.css';

const ListProperty = () => {
  const navigate = useNavigate();
  const { account, signer } = useWallet();
  const { tokenContract, marketContract } = useContract(signer);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    forRent: false,
    price: '',
    rentPrice: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'success', 'error'
  const [transactionError, setTransactionError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if a token is selected
    if (!selectedToken) {
      newErrors.tokenId = 'Please select a token to list';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    if (formData.bedrooms < 1) {
      newErrors.bedrooms = 'Must have at least 1 bedroom';
    }

    if (formData.bathrooms < 1) {
      newErrors.bathrooms = 'Must have at least 1 bathroom';
    }

    if (formData.area <= 0) {
      newErrors.area = 'Area must be greater than 0';
    }

    if (!formData.forRent && (!formData.price.trim() || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Please enter a valid price';
    }

    if (formData.forRent && (!formData.rentPrice.trim() || parseFloat(formData.rentPrice) <= 0)) {
      newErrors.rentPrice = 'Please enter a valid rent price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // State to track available tokens
  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  // Check if the connected account is the contract owner
  useEffect(() => {
    const checkOwner = async () => {
      if (tokenContract && account) {
        try {
          const owner = await tokenContract.owner();
          const isOwnerAccount = owner.toLowerCase() === account.toLowerCase();
          setIsOwner(isOwnerAccount);

          // If user is owner and no token is selected, default to 'mint'
          if (isOwnerAccount && (!selectedToken || selectedToken === '')) {
            setSelectedToken('mint');
          }
        } catch (err) {
          console.error('Error checking owner:', err);
        }
      }
    };

    checkOwner();
  }, [tokenContract, account, selectedToken]);

  // Fetch tokens owned by the user
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!tokenContract || !account) return;

      try {
        // Get the next token ID to know how many tokens exist
        const nextTokenId = await tokenContract.nextTokenId();
        const tokenCount = Number(nextTokenId);

        // Check each token to see if the user owns it
        const userTokens = [];

        for (let i = 0; i < tokenCount; i++) {
          try {
            const owner = await tokenContract.ownerOf(i);

            // Check if the user owns this token
            if (owner.toLowerCase() === account.toLowerCase()) {
              // Check if the token is already listed
              const listing = await marketContract.listings(i);

              // Only add tokens that are not already listed
              if (!listing.active) {
                userTokens.push(i);
              }
            }
          } catch (err) {
            // Token might not exist or other error - ignore
          }
        }

        setAvailableTokens(userTokens);

        // If there are available tokens, select the first one by default
        if (userTokens.length > 0) {
          setSelectedToken(userTokens[0].toString());
        }
      } catch (err) {
        console.error('Error fetching user tokens:', err);
      }
    };

    fetchUserTokens();
  }, [tokenContract, marketContract, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!tokenContract || !marketContract) {
      setTransactionError('Contracts not loaded');
      setTransactionStatus('error');
      return;
    }

    try {
      setIsSubmitting(true);
      setTransactionStatus('pending');

      // Convert prices to Wei
      const priceWei = ethers.parseEther(formData.forRent ? '0' : formData.price);
      const rentPriceWei = ethers.parseEther(formData.forRent ? formData.rentPrice : '0');

      let tokenId;

      // If the user is the contract owner, they can mint a new token
      if (isOwner && selectedToken === 'mint') {
        try {
          // Create metadata for the token (in a real app, this would be uploaded to IPFS)
          // For now, we'll create a mock URI that includes the property details
          const metadata = {
            name: formData.title,
            description: formData.description,
            location: formData.location,
            image: formData.imageUrl,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            area: parseInt(formData.area)
          };

          // In a real app, this would be uploaded to IPFS
          // For now, we'll use a mock URI that includes the timestamp
          const tokenURI = `https://example.com/metadata/${Date.now()}.json`;

          // Store the metadata in localStorage for demo purposes
          // This allows us to retrieve it later when displaying the property
          // Store with timestamp for general retrieval
          localStorage.setItem(`property_metadata_${Date.now()}`, JSON.stringify(metadata));

          // Also store with the specific token ID once we know it
          // We'll update this after minting

          // Mint a new token
          const mintTx = await tokenContract.mintProperty(account, tokenURI);
          await mintTx.wait();

          // Get the token ID from the transaction receipt or events
          // For simplicity, we'll get the current token count and subtract 1
          const nextTokenId = await tokenContract.nextTokenId();
          tokenId = nextTokenId - 1n;

          // Store metadata with the specific token ID now that we know it
          localStorage.setItem(`property_metadata_token_${tokenId}`, JSON.stringify(metadata));

          // Approve the marketplace to transfer the token
          const approveTx = await tokenContract.approve(marketContract.getAddress(), tokenId);
          await approveTx.wait();
        } catch (err) {
          console.error('Error minting token:', err);
          throw new Error(`Failed to mint token: ${err.message}`);
        }
      } else {
        // Use an existing token
        try {
          // Make sure we have a valid token ID
          if (!selectedToken || selectedToken === '') {
            throw new Error('No token selected. Please select a token to list.');
          }

          // Parse the token ID as a BigInt to avoid underflow issues
          tokenId = ethers.getBigInt(selectedToken);

          // Approve the marketplace to transfer the token
          const marketplaceAddress = await marketContract.getAddress();

          const approveTx = await tokenContract.approve(marketplaceAddress, tokenId);
          await approveTx.wait();
        } catch (err) {
          console.error('Error approving token transfer:', err);
          throw new Error(`Failed to approve token transfer: ${err.message}`);
        }
      }

      try {
        // List the property on the marketplace
        const listTx = await marketContract.listProperty(
          tokenId,
          priceWei,
          formData.forRent,
          rentPriceWei
        );

        // Wait for the transaction to be mined
        await listTx.wait();
      } catch (err) {
        console.error('Error listing property:', err);
        throw new Error(`Failed to list property: ${err.message}`);
      }

      setTransactionStatus('success');
      setIsSubmitting(false);

      // Redirect to the property detail page after a short delay
      setTimeout(() => {
        navigate(`/property/${tokenId}`);
      }, 2000);
    } catch (err) {
      console.error('Error listing property:', err);

      // Set the error message from the caught error
      setTransactionError(err.message);
      setTransactionStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="list-property-page">
      <div className="page-header">
        <h1>List a Property</h1>
        <p>Provide details about your property to list it on the marketplace</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">Property Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Apartment in Downtown"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL*</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? 'error' : ''}
              />
              {errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
              <span className="form-hint">Enter a URL to an image of your property</span>
            </div>
          </div>

          <div className="form-section">
            <h2>Property Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms*</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="1"
                  className={errors.bedrooms ? 'error' : ''}
                />
                {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms*</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="1"
                  step="0.5"
                  className={errors.bathrooms ? 'error' : ''}
                />
                {errors.bathrooms && <span className="error-message">{errors.bathrooms}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="area">Area (sq ft)*</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="1"
                  className={errors.area ? 'error' : ''}
                />
                {errors.area && <span className="error-message">{errors.area}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Token Selection</h2>

            <div className="form-group">
              <label htmlFor="tokenId">Select Property Token*</label>
              <select
                id="tokenId"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className={`select-input ${selectedToken ? '' : 'error'}`}
                required
              >
                <option value="" disabled>
                  {availableTokens.length === 0 && !isOwner
                    ? 'No available tokens - you need to own a token first'
                    : 'Select a token'}
                </option>

                {availableTokens.map((tokenId) => (
                  <option key={tokenId} value={tokenId.toString()}>
                    Token #{tokenId}
                  </option>
                ))}

                {isOwner && (
                  <option value="mint">Mint a new token (owner only)</option>
                )}
              </select>

              {errors.tokenId && (
                <span className="error-message">{errors.tokenId}</span>
              )}

              {availableTokens.length === 0 && !isOwner && (
                <div className="token-warning">
                  <p>You don't own any property tokens that can be listed.</p>
                  <p>Contact the contract owner to mint a token for you.</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Listing Details</h2>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="forRent"
                  checked={formData.forRent}
                  onChange={handleChange}
                />
                List for Rent (instead of Sale)
              </label>
            </div>

            {!formData.forRent && (
              <div className="form-group">
                <label htmlFor="price">Sale Price (ETH)*</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.001"
                  step="0.001"
                  placeholder="e.g. 10"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
            )}

            {formData.forRent && (
              <div className="form-group">
                <label htmlFor="rentPrice">Daily Rent Price (ETH)*</label>
                <input
                  type="number"
                  id="rentPrice"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  min="0.001"
                  step="0.001"
                  placeholder="e.g. 0.1"
                  className={errors.rentPrice ? 'error' : ''}
                />
                {errors.rentPrice && <span className="error-message">{errors.rentPrice}</span>}
              </div>
            )}
          </div>

          {transactionStatus && (
            <div className={`transaction-status status-${transactionStatus}`}>
              {transactionStatus === 'pending' && 'Transaction is being processed...'}
              {transactionStatus === 'success' && 'Property listed successfully! Redirecting...'}
              {transactionStatus === 'error' && `Transaction failed: ${transactionError}`}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner-small" />
                  Processing...
                </>
              ) : (
                'List Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListProperty;
