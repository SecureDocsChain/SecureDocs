// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {ISecureVault} from "./interface/ISecureVault.sol";
import {SecureVault} from "./SecureVault.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import {Verifier, Metadata} from "./lib/Struct.sol";
import {
  Unauthorized,
  ContractLogicAlreadySet,
  SecureVaultAlreadyDeployed,
  VerifierAlreadyExist
} from "./lib/Errors.sol";

/**
 * @title SecureVaultFactory
 * @notice The SecureVaultFactory contract
 */
contract SecureVaultFactory is Ownable {
  address private immutable _secureVaultTemplateAddress;
  uint256 private _secureVaultDeployedCount;

  mapping(address owner => address secureVault) private _ownersSecureVaults;
  mapping(address => Verifier) private _verifiers;

  event Deployed(address indexed secureVault);

  constructor() Ownable(msg.sender) { 
    _secureVaultTemplateAddress = address(new SecureVault());
  }

  /**
   * @notice Deploy a new SecureVault contract
   * @param owner The owner of the SecureVault contract
   */
  function deploy(address owner) public {
    if (_ownersSecureVaults[owner] != address(0)) revert SecureVaultAlreadyDeployed();
    address clone = Clones.clone(_secureVaultTemplateAddress);

    SecureVault(clone).initialize(owner);

    _ownersSecureVaults[owner] = clone;
    unchecked { _secureVaultDeployedCount++; }
    emit Deployed(clone);
  }

  /**
   * @notice Get the SecureVault contract address of an owner
   * @param owner The owner of the SecureVault contract
   * @return The SecureVault contract address of the owner
   */
  function getSecureVault(address owner) external view returns (address) {
    return _ownersSecureVaults[owner];
  }

  /**
   * @notice Register a new verifier
   * @param verifier The address of the verifier
   * @param name The name of the verifier
   */
  function registerVerifier(address verifier, string memory name) external onlyOwner {
    if (_verifiers[verifier].verifier != address(0)) revert VerifierAlreadyExist();
    _verifiers[verifier] = Verifier({
      verifier: verifier,
      name: name
    });
  }

  /**
   * @notice Mint a new token to a user
   * @param user The user to mint the token to
   * @param visibility The visibility of the token
   * @param documentHash The hash of the document
   * @param keywords The keywords of the document
   * @param documentType The type of the document
   * @param uri The URI of the document
   */
  function mint(
    address user,
    uint8 visibility,
    bytes32 documentHash,
    bytes32[] memory keywords,
    string memory documentType,
    string memory uri
  ) external {
    if (msg.sender != _verifiers[msg.sender].verifier) revert Unauthorized();
    address secureVault = _ownersSecureVaults[user];
    if (secureVault == address(0)) { 
      deploy(user);
      secureVault = _ownersSecureVaults[user];
    }
    ISecureVault(secureVault).mint(msg.sender, visibility, documentHash, keywords, documentType, uri);
  }

  /**
   * @notice Get the verifier data
   * @param verifier The address of the verifier
   * @return The verifier data
   */
  function getVerifier(
    address verifier
  ) external view returns (Verifier memory) {
    return _verifiers[verifier];
  }
}