import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { REAL_ESTATE_TOKEN_ADDRESS, MARKETPLACE_ADDRESS } from '../contracts/addresses';
import RealEstateTokenABI from '../contracts/RealEstateToken.json';
import MarketplaceABI from '../contracts/Marketplace.json';

export function useContract(signer) {
    const [tokenContract, setTokenContract] = useState(null);
    const [marketContract, setMarketContract] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (signer) {
            try {
                // Validate addresses
                if (!REAL_ESTATE_TOKEN_ADDRESS || REAL_ESTATE_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
                    throw new Error('Invalid RealEstateToken address');
                }

                if (!MARKETPLACE_ADDRESS || MARKETPLACE_ADDRESS === '0x0000000000000000000000000000000000000000') {
                    throw new Error('Invalid Marketplace address');
                }

                console.log('Initializing contracts with addresses:', {
                    tokenAddress: REAL_ESTATE_TOKEN_ADDRESS,
                    marketAddress: MARKETPLACE_ADDRESS
                });

                const tokenContract = new ethers.Contract(
                    REAL_ESTATE_TOKEN_ADDRESS,
                    RealEstateTokenABI.abi,
                    signer
                );
                setTokenContract(tokenContract);

                const marketContract = new ethers.Contract(
                    MARKETPLACE_ADDRESS,
                    MarketplaceABI.abi,
                    signer
                );
                setMarketContract(marketContract);
            } catch (err) {
                console.error('Contract initialization error:', err);
                setError(err.message);
            }
        } else {
            // Reset contracts when signer is not available
            setTokenContract(null);
            setMarketContract(null);
        }
    }, [signer]);

    return { tokenContract, marketContract, error };
}