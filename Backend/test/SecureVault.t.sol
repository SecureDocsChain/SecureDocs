// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";

import {Proxy} from "../src/Proxy.sol";
import {SecureVaultLogic, Metadata} from "../src/SecureVaultLogic.sol";
import {Factory} from "../src/Factory.sol";

contract TestSecureVault is Test {
  Proxy internal proxy;
  SecureVaultLogic internal logic;
  Factory internal factory;

  uint256 internal ownerPrivateKey;
  address internal owner;
  uint256 internal user1PrivateKey;
  address internal user1;
  uint256 internal user2PrivateKey;
  address internal user2;
  uint256 internal user3PrivateKey;
  address internal user3;

  function setUp() public {
    ownerPrivateKey = 0xA11CE;
    owner = vm.addr(ownerPrivateKey);
    user1PrivateKey = 0xB0B;
    user1 = vm.addr(user1PrivateKey);
    user2PrivateKey = 0xFE55E;
    user2 = vm.addr(user2PrivateKey);
    user3PrivateKey = 0xD1C;
    user3 = vm.addr(user3PrivateKey);

    vm.startPrank(owner);

    factory = new Factory();
    logic = new SecureVaultLogic();
    factory.setContractLogic(address(logic));
  }

  function testDeployNewSecureVault() public {
    vm.startPrank(user1);

    factory.deploy();

    address proxyAddress = factory.getProxy(user1);

    require(proxyAddress != address(0), "Proxy address should not be address zero");

    vm.stopPrank();
  }
}