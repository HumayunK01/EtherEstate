import React from 'react';
import './Benefits.css';

const Benefits = () => {
  const benefits = [
    {
      id: 1,
      title: 'Transparency',
      description: 'All transactions are recorded on the blockchain, providing complete transparency and trust.',
      icon: '🔍'
    },
    {
      id: 2,
      title: 'Security',
      description: 'Smart contracts ensure secure transactions without the need for intermediaries.',
      icon: '🔒'
    },
    {
      id: 3,
      title: 'Lower Costs',
      description: 'Eliminate middlemen and reduce fees associated with traditional real estate transactions.',
      icon: '💰'
    },
    {
      id: 4,
      title: 'Global Access',
      description: 'Invest in properties worldwide without geographical limitations or currency exchange issues.',
      icon: '🌎'
    },
    {
      id: 5,
      title: 'Fractional Ownership',
      description: 'Own a percentage of high-value properties through tokenization.',
      icon: '📊'
    },
    {
      id: 6,
      title: 'Instant Transactions',
      description: 'Complete property transactions in minutes instead of weeks or months.',
      icon: '⚡'
    }
  ];

  return (
    <div className="benefits-section">
      <div className="benefits-header">
        <h2 className="benefits-title">Why Blockchain Real Estate?</h2>
        <p className="benefits-subtitle">
          Discover the advantages of buying and selling properties on the blockchain
        </p>
      </div>
      
      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
