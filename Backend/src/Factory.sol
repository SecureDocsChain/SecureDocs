// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Proxy} from "./Proxy.sol";
import {SecureVaultLogic} from "./SecureVaultLogic.sol";

error Unauthorized();
error ContractLogicAlreadySet();

/**
 * @title Factory
 * @notice Factory contract that deploys Proxy contracts
 */
contract Factory {
  uint256 private proxiesDeployed;
  address private owner;
  address public contractLogic;

  mapping(address => address) private proxies;

  event Deployed(address indexed proxy);

  constructor() {
    owner = msg.sender;
  }

  function setContractLogic(address _contractLogic) external {
    if (msg.sender != owner) revert Unauthorized();
    if (contractLogic != address(0)) revert ContractLogicAlreadySet();
    contractLogic = _contractLogic;
  }

  function deploy() external {
    address proxy = address(new Proxy("", contractLogic));
    SecureVaultLogic(proxy).initialize(msg.sender);
    proxies[msg.sender] = proxy;
    unchecked { proxiesDeployed++; }
    emit Deployed(proxy);
  }

  function getProxy(address user) external view returns (address) {
    return proxies[user];
  }
}