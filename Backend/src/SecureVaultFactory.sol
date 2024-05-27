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
 * @notice SecureVaultFactory contract that deploys Proxy contracts
 * 
 * @dev deploy() multiple proxies for an address or 1 proxy per address ???
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

  function deploy(address owner) public {
    if (_ownersSecureVaults[owner] != address(0)) revert SecureVaultAlreadyDeployed();
    address clone = Clones.clone(_secureVaultTemplateAddress);

    SecureVault(clone).initialize(owner);

    _ownersSecureVaults[owner] = clone;
    unchecked { _secureVaultDeployedCount++; }
    emit Deployed(clone);
  }

  function getSecureVault(address owner) external view returns (address) {
    return _ownersSecureVaults[owner];
  }

  function registerVerifier(address verifier, string memory name) external onlyOwner {
    if (_verifiers[verifier].verifier != address(0)) revert VerifierAlreadyExist();
    _verifiers[verifier] = Verifier({
      verifier: verifier,
      name: name
    });
  }

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
    if (secureVault == address(0)) deploy(user);
    ISecureVault(secureVault).mint(msg.sender, visibility, documentHash, keywords, documentType, uri);
  }

  function getVerifier(
    address verifier
  ) external view returns (Verifier memory) {
    return _verifiers[verifier];
  }
}