import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Connect Your Wallet',
      description: 'Connect your MetaMask wallet to get started with our platform.',
      icon: '💼'
    },
    {
      id: 2,
      title: 'Browse Properties',
      description: 'Explore our curated selection of properties available for sale or rent.',
      icon: '🔍'
    },
    {
      id: 3,
      title: 'Make a Transaction',
      description: 'Purchase or rent a property securely using cryptocurrency.',
      icon: '💰'
    },
    {
      id: 4,
      title: 'Manage Your Assets',
      description: 'View and manage your real estate assets directly from your dashboard.',
      icon: '🏠'
    }
  ];

  return (
    <div className="how-it-works">
      <div className="how-header">
        <h2 className="how-title">How It Works</h2>
        <p className="how-subtitle">
          Our blockchain-based platform makes real estate transactions simple, secure, and transparent
        </p>
      </div>
      
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-icon">{step.icon}</div>
            <div className="step-number">{step.id}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
