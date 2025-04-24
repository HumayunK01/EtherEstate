import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { mintPropertyToken, createPropertyMetadata } from '../utils/adminUtils';
import './AdminMint.css';

const AdminMint = () => {
  const navigate = useNavigate();
  const { account, signer } = useWallet();
  const { tokenContract } = useContract(signer);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    ownerAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'success', 'error'
  const [transactionError, setTransactionError] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.ownerAddress.trim()) {
      newErrors.ownerAddress = 'Owner address is required';
    } else if (!ethers.isAddress(formData.ownerAddress)) {
      newErrors.ownerAddress = 'Please enter a valid Ethereum address';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!tokenContract) {
      setTransactionError('Token contract not loaded');
      setTransactionStatus('error');
      return;
    }

    try {
      setIsSubmitting(true);
      setTransactionStatus('pending');

      // Create metadata for the token
      const metadata = createPropertyMetadata(formData);

      // In a real application, you would upload this metadata to IPFS
      // For demo purposes, we'll use a mock URL
      const tokenURI = `https://example.com/metadata/${Date.now()}.json`;

      // Mint the token
      const result = await mintPropertyToken(tokenContract, formData.ownerAddress, tokenURI);

      if (result.success) {
        setMintedTokenId(result.tokenId);
        setTransactionStatus('success');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error minting property token:', err);
      setTransactionError(err.message);
      setTransactionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-mint-page">
      <div className="page-header">
        <h1>Admin: Mint Property Token</h1>
        <p>This page is for contract owners to mint property tokens for testing</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Property Information</h2>

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
                placeholder="Describe the property..."
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
              <span className="form-hint">Enter a URL to an image of the property</span>
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
            <h2>Owner Information</h2>

            <div className="form-group">
              <label htmlFor="ownerAddress">Owner Address*</label>
              <input
                type="text"
                id="ownerAddress"
                name="ownerAddress"
                value={formData.ownerAddress}
                onChange={handleChange}
                placeholder="0x..."
                className={errors.ownerAddress ? 'error' : ''}
              />
              {errors.ownerAddress && <span className="error-message">{errors.ownerAddress}</span>}
              <span className="form-hint">The address that will own this property token</span>
              <button
                type="button"
                className="use-current-button"
                onClick={() => setFormData(prev => ({ ...prev, ownerAddress: account || '' }))}
              >
                Use Current Address
              </button>
            </div>
          </div>

          {transactionStatus && (
            <div className={`transaction-status status-${transactionStatus}`}>
              {transactionStatus === 'pending' && 'Transaction is being processed...'}
              {transactionStatus === 'success' && (
                <>
                  <p>Property token minted successfully!</p>
                  <p>Token ID: {mintedTokenId}</p>
                </>
              )}
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
                'Mint Token'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMint;
