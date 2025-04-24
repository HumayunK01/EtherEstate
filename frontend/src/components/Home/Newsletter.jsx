import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would send this to your backend
    console.log('Subscribing email:', email);
    
    // Simulate success
    setSubscribed(true);
    setError('');
    setEmail('');
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <div className="newsletter-section">
      <div className="newsletter-content">
        <h2 className="newsletter-title">Stay Updated</h2>
        <p className="newsletter-description">
          Subscribe to our newsletter for the latest blockchain real estate news, property listings, and market insights.
        </p>
        
        {subscribed ? (
          <div className="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Thank you for subscribing!</p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? 'error' : ''}
              />
              <button type="submit">Subscribe</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <p className="privacy-note">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
      
      <div className="newsletter-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Newsletter;
