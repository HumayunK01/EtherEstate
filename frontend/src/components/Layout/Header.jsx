import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiHome, FiGrid, FiPlusSquare } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { RiWallet3Line, RiBuilding2Line } from 'react-icons/ri';
import './Header.css';

const Header = ({ account, connectWallet, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery);
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <RiBuilding2Line className="logo-icon" />
            <h1>Ether<span>Estate</span></h1>
          </Link>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FiSearch size={20} />
            </button>
          </form>
        </div>

        <nav className="nav">
          <ul>
            <li>
              <Link to="/" className={isActive('/')}>
                <FiHome />
                <span>Home</span>
              </Link>
            </li>
                <li>
                  <Link to="/list-property" className={isActive('/list-property')}>
                    <FiPlusSquare />
                    <span>List Property</span>
                  </Link>
                </li>
            <li>
              <Link to="/properties" className={isActive('/properties')}>
                <FiGrid />
                <span>Properties</span>
              </Link>
            </li>
            {account && (
              <>
                <li>
                  <Link to="/dashboard" className={isActive('/dashboard')}>
                    <MdDashboard />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="wallet-info">
          {account ? (
            <div className="account-display">
              <span className="account-address">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
              <div className="connection-indicator" />
            </div>
          ) : (
            <button className="connect-button" onClick={connectWallet}>
              <RiWallet3Line />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
