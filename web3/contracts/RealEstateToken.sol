// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateToken is ERC721URIStorage, Ownable {
    uint public nextTokenId;

    constructor() ERC721("RealEstateProperty", "PROP") {}

    /// @notice Mint a new property NFT with on‑chain URI pointing to JSON metadata
    function mintProperty(address to, string calldata metadataURI) external onlyOwner returns (uint) {
        uint tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        return tokenId;
    }
}
