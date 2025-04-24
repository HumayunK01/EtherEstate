// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RealEstateToken.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    RealEstateToken public immutable tokenContract;
    uint public marketplaceFeeBP = 200; // 2% fee in basis points

    struct Listing {
        address seller;
        uint priceWei;
        bool forRent;
        uint rentPricePerDayWei;
        bool active;
    }

    struct Rental {
        address renter;
        uint expiresAt;
    }

    // tokenId => listing
    mapping(uint => Listing) public listings;
    // tokenId => Rental
    mapping(uint => Rental) public rentals;
    // Events
    event Listed(uint indexed tokenId, address seller, uint priceWei, bool forRent, uint rentPricePerDayWei);
    event Sale(uint indexed tokenId, address buyer, uint priceWei);
    event Rented(uint indexed tokenId, address renter, uint expiresAt);
    event Delisted(uint indexed tokenId);

    constructor(address _tokenAddress) {
        tokenContract = RealEstateToken(_tokenAddress);
    }

    /// @notice List for sale or rent
    function listProperty(
        uint tokenId,
        uint salePriceWei,
        bool forRent,
        uint rentPricePerDayWei
    ) external {
        require(tokenContract.ownerOf(tokenId) == msg.sender, "Not owner");
        listings[tokenId] = Listing({
            seller: msg.sender,
            priceWei: salePriceWei,
            forRent: forRent,
            rentPricePerDayWei: rentPricePerDayWei,
            active: true
        });
        emit Listed(tokenId, msg.sender, salePriceWei, forRent, rentPricePerDayWei);
    }

    /// @notice Buy a listed property
    function buyProperty(uint tokenId) external payable nonReentrant {
        Listing storage L = listings[tokenId];
        require(L.active && !L.forRent, "Not for sale");
        require(msg.value == L.priceWei, "Incorrect payment");

        // compute fee
        uint fee = (msg.value * marketplaceFeeBP) / 10000;
        uint sellerProceeds = msg.value - fee;

        // transfer NFT
        tokenContract.safeTransferFrom(L.seller, msg.sender, tokenId);
        // pay seller and owner
        payable(L.seller).transfer(sellerProceeds);
        payable(owner()).transfer(fee);

        L.active = false;
        emit Sale(tokenId, msg.sender, msg.value);
    }

    /// @notice Rent a listed property for days
    function rentProperty(uint tokenId, uint daysCount) external payable nonReentrant {
        Listing storage L = listings[tokenId];
        require(L.active && L.forRent, "Not for rent");
        uint totalRent = L.rentPricePerDayWei * daysCount;
        require(msg.value == totalRent, "Incorrect rent payment");

        rentals[tokenId] = Rental({
            renter: msg.sender,
            expiresAt: block.timestamp + daysCount * 1 days
        });

        // send rent to seller minus fee
        uint fee = (msg.value * marketplaceFeeBP) / 10000;
        payable(L.seller).transfer(msg.value - fee);
        payable(owner()).transfer(fee);

        emit Rented(tokenId, msg.sender, rentals[tokenId].expiresAt);
    }

    /// @notice Delist (sale or rent)
    function delistProperty(uint tokenId) external {
        Listing storage L = listings[tokenId];
        require(L.seller == msg.sender || owner() == msg.sender, "No permission");
        L.active = false;
        emit Delisted(tokenId);
    }

    /// @notice Admin can update marketplace fee
    function setMarketplaceFeeBP(uint newFeeBP) external onlyOwner {
        require(newFeeBP <= 1000, "Max 10%");
        marketplaceFeeBP = newFeeBP;
    }

    // … you can extend with transactionHistory events, ratings, user verification, etc.
}
