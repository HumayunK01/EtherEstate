import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Modal.css';

const BuyModal = ({ property, onClose, marketContract }) => {
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'success', 'error'
  const [transactionError, setTransactionError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = async () => {
    if (!marketContract || !property) return;

    try {
      setIsProcessing(true);
      setTransactionStatus('pending');

      // Call the buyProperty function on the marketplace contract
      const tx = await marketContract.buyProperty(property.id, {
        value: ethers.getBigInt(property.price)
      });

      // Wait for the transaction to be mined
      await tx.wait();

      setTransactionStatus('success');
      setIsProcessing(false);

      // Reload the page after 2 seconds to show the updated ownership
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Error buying property:', err);

      // Format the error message for better readability
      let errorMessage = err.message;
      if (errorMessage.includes('execution reverted')) {
        if (errorMessage.includes('Not enough funds')) {
          errorMessage = 'You do not have enough ETH to buy this property.';
        } else if (errorMessage.includes('Not active')) {
          errorMessage = 'This property is not currently for sale.';
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Buy Property</h2>
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

          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Property ID</span>
              <span className="detail-value">#{property.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Price</span>
              <span className="detail-value">{formatPrice(property.price)} ETH</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Seller</span>
              <span className="detail-value">{`${property.seller.substring(0, 6)}...${property.seller.substring(property.seller.length - 4)}`}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total</span>
              <span className="detail-value">{formatPrice(property.price)} ETH</span>
            </div>
          </div>

          {transactionStatus && (
            <div className={`transaction-status status-${transactionStatus}`}>
              {transactionStatus === 'pending' && 'Transaction is being processed...'}
              {transactionStatus === 'success' && 'Transaction successful! You are now the owner of this property.'}
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
              className="confirm-button"
              onClick={handleBuy}
              disabled={isProcessing}
            >
              {isProcessing && <span className="loading-spinner-small" />}
              {isProcessing ? 'Processing...' : 'Confirm Purchase'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
