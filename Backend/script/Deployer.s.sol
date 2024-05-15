// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";

import {Factory} from "../src/Factory.sol";
import {SecureVaultLogic} from "../src/SecureVaultLogic.sol";

contract Deployer is Script {
  SecureVaultLogic internal logic;
  Factory internal factory;

  function setUp() public {}

  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    factory = new Factory();
    logic = new SecureVaultLogic();
    factory.setContractLogic(address(logic));

    vm.stopBroadcast();
  }
}
