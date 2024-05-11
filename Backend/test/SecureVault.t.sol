// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";

import {Proxy} from "../src/Proxy.sol";
import {SecureVaultLogic, Metadata, Visibility} from "../src/SecureVaultLogic.sol";
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

  function testDeployNewSecureVault() public returns (address proxyAddress) {
    vm.startPrank(user1);

    factory.deploy();

    proxyAddress = factory.getProxy(user1);

    require(proxyAddress != address(0), "Proxy address should not be address zero");

    vm.stopPrank();
  }

  function testMintNewTokenToUser1() public {
    address proxyAddress = testDeployNewSecureVault();
    
    vm.startPrank(user1);

    SecureVaultLogic(proxyAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    vm.stopPrank();
  }

  function testMintNewTokenShouldFailIfNotOwner() public {
    address proxyAddress = testDeployNewSecureVault();
    
    vm.startPrank(user2);

    vm.expectRevert();
    SecureVaultLogic(proxyAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    vm.stopPrank();
  }
}