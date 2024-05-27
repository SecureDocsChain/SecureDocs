// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

interface ISecureVaultFactory {
  function deploy(address owner) external;
  
  function getSecureVault(address owner) external view returns (address);
}