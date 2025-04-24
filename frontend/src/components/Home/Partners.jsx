import React from 'react';
import './Partners.css';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: 'MetaMask',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      description: 'Crypto wallet & gateway to blockchain apps'
    },
    {
      id: 2,
      name: 'Ethereum',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png',
      description: 'Decentralized software platform'
    },
    {
      id: 3,
      name: 'Polygon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Polygon_Icon.svg/800px-Polygon_Icon.svg.png',
      description: 'Ethereum scaling platform'
    },
    {
      id: 4,
      name: 'Chainlink',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQG7VLkgiQhDj-m-jmXN246LOJEtMaLAjEw&s',
      description: 'Decentralized oracle network'
    },
    {
      id: 5,
      name: 'IPFS',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png',
      description: 'Distributed file storage system'
    }
  ];

  return (
    <div className="partners-section">
      <div className="partners-header">
        <h2 className="partners-title">Our Technology Partners</h2>
        <p className="partners-subtitle">
          We collaborate with leading blockchain companies to provide the best experience
        </p>
      </div>
      
      <div className="partners-grid">
        {partners.map((partner) => (
          <div key={partner.id} className="partner-card">
            <div className="partner-logo-container">
              <img src={partner.logo} alt={partner.name} className="partner-logo" />
            </div>
            <h3 className="partner-name">{partner.name}</h3>
            <p className="partner-description">{partner.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
