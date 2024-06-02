// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

struct Metadata {
  address verifier;
  uint8 visibility;
  uint256 timestamp;
  bytes32 documentHash;
  bytes32[] keywords;
  string documentType;
  string uri;
}

struct Verifier {
  address verifier;
  string name;
}