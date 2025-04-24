import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export function useWallet() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        connectWallet();
    }, []);

    const connectWallet = async () => {
        try {
            const provider = await detectEthereumProvider();
            
            if (provider) {
                const ethProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(ethProvider);

                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                const signer = await ethProvider.getSigner();
                setSigner(signer);
                
                const address = await signer.getAddress();
                setAccount(address);

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    setAccount(accounts[0]);
                });
            } else {
                setError('Please install MetaMask!');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return { account, provider, signer, error, connectWallet };
}