import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">BlockEstate</h2>
            <p className="footer-tagline">
              Revolutionizing real estate with blockchain technology
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="social-link" aria-label="Telegram">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="social-link" aria-label="Medium">
                <i className="fab fa-medium"></i>
              </a>
            </div>
          </div>

          <div className="footer-links-container">
            <div className="footer-links">
              <h3 className="footer-links-title">Platform</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/properties">Properties</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/list-property">List Property</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-links-title">Resources</h3>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Whitepaper</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-links-title">Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h3 className="footer-links-title">Legal</h3>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Compliance</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} BlockEstate. All rights reserved.
          </p>
          <p className="disclaimer">
            Cryptocurrency and blockchain investments involve risk. Do your own research.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
