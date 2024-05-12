// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error Unauthorized();
error AlreadyInitialized();

enum Visibility {
  Public,
  Private
}

struct Metadata {
  uint8 visibility;
  uint256 timestamp;
  bytes32 documentHash;
  bytes32[] keywords;
  string documentType;
  string uri;
  // QRCode qrcode; need to know how to implement this
}

contract SecureVaultLogic is ERC721, Ownable {
  uint8 initialized;
  uint256 ptrTokenId;

  mapping(uint256 => Metadata) public metadata;

  constructor() ERC721("SecureVault", "SV") Ownable(msg.sender) {}

  /// @dev Initialize the contract with the provided parameters
  function initialize(address initialOwner) external {
    address initializer = _initializer();
    if (initializer != address(0) && initializer != msg.sender) revert Unauthorized();
    if (initialized == 1) revert AlreadyInitialized();
    ptrTokenId = 1;
    _transferOwnership(initialOwner);
    initialized = 1;
  }

  /// @dev Mint a new token with the provided metadata
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

  /// @dev Get the metadata of a token
  function getMetadata(uint256 tokenId) external view returns (Metadata memory) {
    return metadata[tokenId];
  }

  function name() public pure override returns (string memory) {
    return "SecureVault";
  }

  function symbol() public pure override returns (string memory) {
    return "SV";
  }

  /// @dev Get the token URI
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    // if tokenID does not exist, return empty string
    return metadata[tokenId].uri;
  }

  /// @dev Get the initializer address
  function _initializer() internal pure returns (address) {
    return address(0);
  }

  /// @dev Override _update to prevent sending tokens to other addresses
  function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    if (to != address(0) && auth != address(0)) {
      revert Unauthorized();
    }
    return super._update(to, tokenId, auth);
  }
}