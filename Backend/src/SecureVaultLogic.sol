// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error Unauthorized();
error AlreadyInitialized();

struct Metadata {
  uint8 visibility;
  uint256 timestamp;
  bytes32 documentHash;
  bytes32[] keywords;
  string documentType;
  string uri;
}

contract SecureVaultLogic is ERC721, Ownable {
  uint8 initialized;
  uint256 ptrTokenId = 1;

  mapping(uint256 => Metadata) public metadata;

  constructor(address factory) ERC721("SecureVault", "SV") Ownable(factory) {}

  // Initialize the contract with the provided parameters
  function initialize(address initialOwner) external onlyOwner {
    if (initialized == 1) revert AlreadyInitialized();
    transferOwnership(initialOwner);
    initialized = 1;
  }

  // Mint a new token with the provided metadata
  function mint(
    uint8 visibility,
    bytes32 documentHash,
    bytes32[] memory keywords,
    string memory documentType,
    string memory uri
  ) external onlyOwner {
    metadata[ptrTokenId] = Metadata({
      visibility: visibility,
      timestamp: block.timestamp,
      documentHash: documentHash,
      keywords: keywords,
      documentType: documentType,
      uri: uri
    });
    _mint(msg.sender, ptrTokenId);
    unchecked { ptrTokenId++; }
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return metadata[tokenId].uri;
  }

  // Override _update to prevent sending tokens to other addresses
  function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    if (to != address(0) && auth != address(0)) {
      revert Unauthorized();
    }
    return super._update(to, tokenId, auth);
  }
}