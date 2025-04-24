import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, account, connectWallet, searchQuery, setSearchQuery }) => {
  return (
    <div className="layout">
      <Header
        account={account}
        connectWallet={connectWallet}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
