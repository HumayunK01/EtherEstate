import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: 'What is blockchain real estate?',
      answer: 'Blockchain real estate refers to the use of blockchain technology to record and transfer property ownership. It enables secure, transparent, and efficient property transactions without traditional intermediaries.'
    },
    {
      id: 2,
      question: 'How do I buy property with cryptocurrency?',
      answer: 'To buy property with cryptocurrency on our platform, you need to connect your wallet (like MetaMask), browse available properties, and make an offer. Once accepted, the transaction is processed on the blockchain, transferring ownership to you.'
    },
    {
      id: 3,
      question: 'Is blockchain real estate legal?',
      answer: 'Yes, blockchain real estate transactions are legal in many jurisdictions. However, regulations vary by country and region. Our platform ensures compliance with relevant laws while leveraging blockchain technology for improved efficiency and transparency.'
    },
    {
      id: 4,
      question: 'What cryptocurrencies can I use?',
      answer: 'Currently, our platform supports Ethereum (ETH) for property transactions. We plan to add support for more cryptocurrencies in the future to provide more options for our users.'
    },
    {
      id: 5,
      question: 'How are property values determined?',
      answer: 'Property values are determined by the sellers based on market conditions, property features, location, and other relevant factors. Our platform provides transparency in pricing and transaction history to help buyers make informed decisions.'
    },
    {
      id: 6,
      question: 'What happens if I lose my wallet keys?',
      answer: 'If you lose access to your wallet, you may lose access to your property tokens. We strongly recommend using secure wallet solutions with proper backup procedures. Consider using hardware wallets and keeping your recovery phrases in secure locations.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">
          Get answers to common questions about blockchain real estate
        </p>
      </div>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div 
            key={faq.id} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="faq-cta">
        <p>Still have questions?</p>
        <button className="contact-button">Contact Us</button>
      </div>
    </div>
  );
};

export default FAQ;
