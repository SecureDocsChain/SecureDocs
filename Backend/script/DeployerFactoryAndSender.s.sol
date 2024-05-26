// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";

import "../src/SecureVaultSender.sol";

contract Deployer is Script {
  SecureVaultFactory private factory;
  SecureVaultSender private sender;

  function setUp() public {}

  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    factory = new SecureVaultFactory();
    sender = new SecureVaultSender(address(factory));

    vm.stopBroadcast();
  }
}