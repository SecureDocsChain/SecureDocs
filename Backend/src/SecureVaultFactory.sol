// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {SecureVault, Metadata} from "./SecureVault.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

error Unauthorized();
error ContractLogicAlreadySet();
error SecureVaultAlreadyDeployed();

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

  event Deployed(address indexed secureVault);

  constructor() Ownable(msg.sender) { 
    _secureVaultTemplateAddress = address(new SecureVault());
  }

  function deploy() external {
    if (_ownersSecureVaults[msg.sender] != address(0)) revert SecureVaultAlreadyDeployed();
    address clone = Clones.clone(_secureVaultTemplateAddress);
    
    SecureVault(clone).initialize(msg.sender);

    _ownersSecureVaults[msg.sender] = clone;
    unchecked { _secureVaultDeployedCount++; }
    emit Deployed(clone);
  }

  function getSecureVault(address owner) external view returns (address) {
    return _ownersSecureVaults[owner];
  }
}