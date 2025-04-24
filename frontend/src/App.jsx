import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';
import ListProperty from './pages/ListProperty';
import AllProperties from './pages/AllProperties';
import SearchResults from './pages/SearchResults';
import AdminMint from './pages/AdminMint';

function App() {
  const { account, signer, error: walletError, connectWallet } = useWallet();
  const { tokenContract, marketContract, error: contractError } = useContract(signer);
  const [searchQuery, setSearchQuery] = useState('');

  if (walletError) return <div className="error-container">Wallet Error: {walletError}</div>;
  if (contractError) return <div className="error-container">Contract Error: {contractError}</div>;

  // Protected route component that requires wallet connection
  const ProtectedRoute = ({ children }) => {
    if (!account) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Layout
      account={account}
      connectWallet={connectWallet}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<AllProperties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/search" element={<SearchResults searchQuery={searchQuery} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-property"
          element={
            <ProtectedRoute>
              <ListProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mint"
          element={
            <ProtectedRoute>
              <AdminMint />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App

