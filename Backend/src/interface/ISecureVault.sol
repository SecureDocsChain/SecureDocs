// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Metadata} from "../lib/Struct.sol";

interface ISecureVault {
  function initialize(address owner) external;

  function mint(
    address verifier,
    uint8 visibility,
    bytes32 documentHash,
    bytes32[] memory keywords,
    string memory documentType,
    string memory uri
  ) external;

  function getMetadata(uint256 tokenId) external view returns (Metadata memory);
}