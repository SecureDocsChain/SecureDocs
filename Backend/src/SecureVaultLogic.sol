// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// import {FunctionsClient} from "chainlink/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsClient} from "./lib/FunctionsClient.sol";
import {ConfirmedOwner} from "chainlink/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "chainlink/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

error Unauthorized();
error AlreadyInitialized();
error UnexpectedRequestID(bytes32 requestId);


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

contract SecureVaultLogic is ERC721, FunctionsClient, Ownable {
  using FunctionsRequest for FunctionsRequest.Request;

  uint8 initialized;
  uint256 ptrTokenId;


  address router = address(0);
  bytes32 public s_lastRequestId;
  bytes public s_lastResponse;
  bytes public s_lastError;

  mapping(uint256 => Metadata) public metadata;

  event Response(bytes32 indexed requestId, bytes response, bytes err);

  constructor() ERC721("SecureVault", "SV") FunctionsClient(router) Ownable(msg.sender) {}

  /// @dev Initialize the contract with the provided parameters
  function initialize(address initialOwner, address _router) external {
    address initializer = _initializer();
    if (initializer != address(0) && initializer != msg.sender) revert Unauthorized();
    if (initialized == 1) revert AlreadyInitialized();
    ptrTokenId = 1;
    _transferOwnership(initialOwner);
    _setRouter(_router);
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

  /** CHAINLINK FUNCTION */

  function sendRequest(
    string memory source,
    bytes memory encryptedSecretsUrls,
    uint8 donHostedSecretsSlotID,
    uint64 donHostedSecretsVersion,
    string[] memory args,
    bytes[] memory bytesArgs,
    uint64 subscriptionId,
    uint32 gasLimit,
    bytes32 donID
  ) external onlyOwner returns (bytes32 requestId) {
    FunctionsRequest.Request memory req;
    req.initializeRequestForInlineJavaScript(source);
    if (encryptedSecretsUrls.length > 0)
      req.addSecretsReference(encryptedSecretsUrls);
    else if (donHostedSecretsVersion > 0) {
      req.addDONHostedSecrets(
        donHostedSecretsSlotID,
        donHostedSecretsVersion
      );
    }
    if (args.length > 0) req.setArgs(args);
    if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
    s_lastRequestId = _sendRequest(
      req.encodeCBOR(),
      subscriptionId,
      gasLimit,
      donID
    );
    return s_lastRequestId;
  }

  function sendRequestCBOR(
    bytes memory request,
    uint64 subscriptionId,
    uint32 gasLimit,
    bytes32 donID
  ) external onlyOwner returns (bytes32 requestId) {
    s_lastRequestId = _sendRequest(
      request,
      subscriptionId,
      gasLimit,
      donID
    );
    return s_lastRequestId;
  }

  function fulfillRequest(
    bytes32 requestId,
    bytes memory response,
    bytes memory err
  ) internal override {
    if (s_lastRequestId != requestId) {
      revert UnexpectedRequestID(requestId);
    }
    s_lastResponse = response;
    s_lastError = err;
    emit Response(requestId, s_lastResponse, s_lastError);
  }
}