// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Proxy} from "./Proxy.sol";
import {SecureVaultLogic} from "./SecureVaultLogic.sol";

/**
 * @title Factory
 * @notice Factory contract that deploys Proxy contracts
 */
contract Factory {
  uint256 private proxiesDeplyed;
  mapping(address => address) private proxies;
  event Deployed(address indexed proxy);

  function deploy(bytes memory constructData, address contractLogic) external {
    address proxy = address(new Proxy(constructData, contractLogic));
    SecureVaultLogic(proxy).initialize(msg.sender);
    proxies[msg.sender] = proxy;
    unchecked { proxiesDeplyed++; }
    emit Deployed(proxy);
  }

  function getProxy(address user) external view returns (address) {
    return proxies[user];
  }
}