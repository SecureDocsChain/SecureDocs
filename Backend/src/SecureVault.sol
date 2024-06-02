// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import {Metadata} from "./lib/Struct.sol";
import {Unauthorized, AlreadyInitialized, TransferOwnershipNotAllowed} from "./lib/Errors.sol";

enum Visibility {
  Public,
  Private
}

/**
 * @title SecureVault
 * @notice The SecureVault contract is an ERC721 contract that stores metadata of documents
 */
contract SecureVault is ERC721Upgradeable, OwnableUpgradeable {
  uint256 public ptrTokenId;
  address public router;

  mapping(uint256 => Metadata) public metadata;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Initialize the contract
   * @param initialOwner The owner of the contract
   */
  function initialize(
    address initialOwner
  ) external initializer {
    __ERC721_init("SecureVault", "SV");
    router = msg.sender;
    ptrTokenId = 1;
    _transferOwnership(initialOwner);
  }

  /**
   * @notice Mint a new token to the owner
   * @param verifier the verifier address
   * @param visibility The visibility of the token
   * @param documentHash The hash of the document
   * @param keywords The keywords of the document
   * @param documentType The type of the document
   * @param uri The URI of the document
   */
  function mint(
    address verifier,
    uint8 visibility,
    bytes32 documentHash,
    bytes32[] memory keywords,
    string memory documentType,
    string memory uri
  ) external {
    if (msg.sender != router) revert Unauthorized();
    metadata[ptrTokenId] = Metadata({
      verifier: verifier,
      visibility: visibility,
      timestamp: block.timestamp,
      documentHash: documentHash,
      keywords: keywords,
      documentType: documentType,
      uri: uri
    });
    _mint(owner(), ptrTokenId);
    unchecked { ptrTokenId++; }
  }

  /**
   * @notice Get the metadata of a token
   * @param tokenId The token ID
   * @return The metadata of the token
   */
  function getMetadata(uint256 tokenId) external view returns (Metadata memory) {
    return metadata[tokenId];
  }

  /// @dev Get the token URI
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    // if tokenID does not exist, return empty string
    return metadata[tokenId].uri;
  }

  /// @dev Override _update to prevent sending tokens to other addresses
  function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    if (to != address(0) && auth != address(0)) {
      revert Unauthorized();
    }
    return super._update(to, tokenId, auth);
  }

  /// @dev Override _transferOwnership to prevent ownership transfer when owner is already set
  function _transferOwnership(address newOwner) internal virtual override {
    if (owner() != address(0)) revert TransferOwnershipNotAllowed();
    super._transferOwnership(newOwner);
  }
}