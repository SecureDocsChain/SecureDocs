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

    require(SecureVaultLogic(proxyAddress).balanceOf(user1) == 1, "User1 should have 1 token");
    require(SecureVaultLogic(proxyAddress).ownerOf(1) == user1, "User1 should own token 1");

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

  function testGetMetadata() public {
    address proxyAddress = testDeployNewSecureVault();
    
    vm.startPrank(user1);

    vm.warp(1000);

    SecureVaultLogic(proxyAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    Metadata memory metadata = SecureVaultLogic(proxyAddress).getMetadata(1);

    require(metadata.visibility == uint8(Visibility.Public), "Visibility should be Public");
    require(metadata.timestamp > 0, "Timestamp should be greater than 0");
    require(metadata.timestamp == 1000, "Timestamp should be 1000");
    require(metadata.documentHash == keccak256("Test"), "Document hash should be keccak256('Test')");
    require(metadata.keywords.length == 0, "Keywords should be empty");
    require(keccak256(bytes(metadata.documentType)) == keccak256("Test"), "Document type should be 'Test'");
    require(keccak256(bytes(metadata.uri)) == keccak256("https://example.com"), "URI should be 'https://example.com'");

    vm.stopPrank();
  }

  function testGetName() public {
    address proxyAddress = testDeployNewSecureVault();

    require(keccak256(bytes(SecureVaultLogic(proxyAddress).name())) == keccak256("SecureVault"), "Name should be 'SecureVault'");
  }

  function testGetSymbol() public {
    address proxyAddress = testDeployNewSecureVault();

    require(keccak256(bytes(SecureVaultLogic(proxyAddress).symbol())) == keccak256("SV"), "Symbol should be 'SV'");
  }
}