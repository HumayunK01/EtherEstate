import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Modal.css';

const RentModal = ({ property, onClose, marketContract, rentDays, setRentDays }) => {
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'success', 'error'
  const [transactionError, setTransactionError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState('0');

  useEffect(() => {
    if (property && property.rentPrice) {
      const dailyRentWei = ethers.toBigInt(property.rentPrice);
      const daysCount = ethers.toBigInt(rentDays);
      const totalWei = dailyRentWei * daysCount;
      setTotalPrice(totalWei.toString());
    }
  }, [property, rentDays]);

  const handleRent = async () => {
    if (!marketContract || !property) return;

    try {
      setIsProcessing(true);
      setTransactionStatus('pending');

      // Call the rentProperty function on the marketplace contract
      const tx = await marketContract.rentProperty(property.id, rentDays, {
        value: ethers.getBigInt(totalPrice)
      });

      // Wait for the transaction to be mined
      await tx.wait();

      setTransactionStatus('success');
      setIsProcessing(false);

      // Reload the page after 2 seconds to show the updated rental status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Error renting property:', err);

      // Format the error message for better readability
      let errorMessage = err.message;
      if (errorMessage.includes('execution reverted')) {
        if (errorMessage.includes('Not enough funds')) {
          errorMessage = 'You do not have enough ETH to rent this property.';
        } else if (errorMessage.includes('Not active')) {
          errorMessage = 'This property is not currently available for rent.';
        } else if (errorMessage.includes('Not for rent')) {
          errorMessage = 'This property is not available for rent.';
        } else if (errorMessage.includes('Already rented')) {
          errorMessage = 'This property is already rented by someone else.';
        } else {
          errorMessage = 'Transaction failed. Please check that you have enough ETH and try again.';
        }
      }

      setTransactionError(errorMessage);
      setTransactionStatus('error');
      setIsProcessing(false);
    }
  };

  const formatPrice = (priceInWei) => {
    return ethers.formatEther(priceInWei);
  };

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setRentDays(value);
    } else {
      setRentDays(1);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Rent Property</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="property-summary">
            <div className="property-image">
              <img src={property.imageUrl} alt={property.title} />
            </div>
            <div className="property-info">
              <h3>{property.title}</h3>
              <p>{property.location}</p>
            </div>
          </div>

          <div className="rent-days-input">
            <label htmlFor="rentDays">Number of days:</label>
            <input
              type="number"
              id="rentDays"
              min="1"
              value={rentDays}
              onChange={handleDaysChange}
              disabled={isProcessing}
            />
          </div>

          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Property ID</span>
              <span className="detail-value">#{property.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Daily Rate</span>
              <span className="detail-value">{formatPrice(property.rentPrice)} ETH / day</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Number of Days</span>
              <span className="detail-value">{rentDays}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Owner</span>
              <span className="detail-value">{`${property.seller.substring(0, 6)}...${property.seller.substring(property.seller.length - 4)}`}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total</span>
              <span className="detail-value">{formatPrice(totalPrice)} ETH</span>
            </div>
          </div>

          {transactionStatus && (
            <div className={`transaction-status status-${transactionStatus}`}>
              {transactionStatus === 'pending' && 'Transaction is being processed...'}
              {transactionStatus === 'success' && `Transaction successful! You have rented this property for ${rentDays} days.`}
              {transactionStatus === 'error' && `Transaction failed: ${transactionError}`}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose} disabled={isProcessing}>
            {transactionStatus === 'success' ? 'Close' : 'Cancel'}
          </button>

          {transactionStatus !== 'success' && (
            <button
              className="confirm-button rent"
              onClick={handleRent}
              disabled={isProcessing}
            >
              {isProcessing && <span className="loading-spinner-small" />}
              {isProcessing ? 'Processing...' : 'Confirm Rental'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentModal;
