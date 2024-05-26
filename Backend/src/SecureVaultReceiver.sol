// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

import {Metadata} from "./SecureVault.sol";

error InvalidSender();

contract SecureVaultReceiver is CCIPReceiver {
  address public secureVaultSender;

  mapping(address => mapping (uint256 => Metadata)) public datas;

  event MessageReceived(
    bytes32 indexed messageId,
    uint64 indexed sourceChainSelector,
    address sender,
    bytes data
  );

  constructor(address router, address sender) CCIPReceiver(router) {
    secureVaultSender = sender;
  }

  function _ccipReceive(
    Client.Any2EVMMessage memory any2EvmMessage
  ) internal override {
    address expectedSecureVaultSender = abi.decode(any2EvmMessage.sender, (address));
    if (secureVaultSender != expectedSecureVaultSender) revert InvalidSender();

    (address user, uint256 tokenId, Metadata memory data)
      = abi.decode(any2EvmMessage.data, (address, uint256, Metadata));

    datas[user][tokenId] = data;

    emit MessageReceived(
      any2EvmMessage.messageId,
      any2EvmMessage.sourceChainSelector,
      expectedSecureVaultSender,
      any2EvmMessage.data
    );
  }

  function verifyDocumentHash(address user, uint256 tokenId, bytes32 documentHash) public view returns (bool) {
    return datas[user][tokenId].documentHash == documentHash;
  }

  function getDocumentData(address user, uint256 tokenId) public view returns (Metadata memory) {
    return datas[user][tokenId];
  }
}