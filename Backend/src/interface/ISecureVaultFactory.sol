// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Verifier} from "../lib/Struct.sol";

interface ISecureVaultFactory {
  function deploy(address owner) external;

  function getSecureVault(address owner) external view returns (address);

  function registerVerifier(address verifier, string memory name) external;

  function mint(
    address user,
    address verifier,
    uint8 visibility,
    bytes32 documentHash,
    bytes32[] memory keywords,
    string memory documentType,
    string memory uri
  ) external;

  function getVerifier(address verifier) external view returns (Verifier memory);
}