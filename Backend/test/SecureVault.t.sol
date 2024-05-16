// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Test, console2} from "forge-std/Test.sol";
import {SecureVault, Metadata, Visibility} from "../src/SecureVault.sol";
import {SecureVaultFactory} from "../src/SecureVaultFactory.sol";

contract TestSecureVault is Test {
  SecureVault internal logic;
  SecureVaultFactory internal factory;

  
  address private owner = makeAddr("owner");
  address private user1 = makeAddr("user1");
  address private user2 = makeAddr("user2");
  address private user3 = makeAddr("user3");

  function setUp() public {
    vm.startPrank(owner);

    factory = new SecureVaultFactory();

    vm.stopPrank();
  }

  function testDeployNewSecureVault() public returns (address secureVaultAddress) {
    vm.startPrank(user1);

    factory.deploy();

    secureVaultAddress = factory.getSecureVault(user1);

    require(secureVaultAddress != address(0), "SecureVault address should not be address zero");
    require(SecureVault(secureVaultAddress).owner() == user1, "SecureVault owner should be user1");
    require(SecureVault(secureVaultAddress).ptrTokenId() == 1, "SecureVault ptrTokenId should be 1");

    vm.stopPrank();
  }

  function testMintNewTokenToUser1() public {
    address secureVaultAddress = testDeployNewSecureVault();
    
    vm.startPrank(user1);

    SecureVault(secureVaultAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    require(SecureVault(secureVaultAddress).balanceOf(user1) == 1, "User1 should have 1 token");
    require(SecureVault(secureVaultAddress).ownerOf(1) == user1, "User1 should own token 1");
    require(SecureVault(secureVaultAddress).ptrTokenId() == 2, "SecureVault ptrTokenId should be 2");

    vm.stopPrank();
  }

  function testInitializeShouldFailIfAlreadyInitialized() public {
    address secureVaultAddress = testDeployNewSecureVault();
    vm.startPrank(user1);

    vm.expectRevert();
    SecureVault(secureVaultAddress).initialize(user1);

    vm.stopPrank();
  }

  function testMintNewTokenShouldFailIfNotOwner() public {
    address secureVaultAddress = testDeployNewSecureVault();
    
    vm.startPrank(user2);

    vm.expectRevert();
    SecureVault(secureVaultAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    vm.stopPrank();
  }

  function testTransferTokenShouldFail() public {
    address secureVaultAddress = testDeployNewSecureVault();
    
    vm.startPrank(user1);

    SecureVault(secureVaultAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    vm.expectRevert();
    SecureVault(secureVaultAddress).transferFrom(user1, user2, 1);

    vm.stopPrank();
  }

  function testDeployTwiceForTheSameUserShouldFail() public {
    vm.startPrank(user1);

    factory.deploy();


    vm.expectRevert();
    factory.deploy();

    vm.stopPrank();
  }

  function testGetMetadata() public {
    address secureVaultAddress = testDeployNewSecureVault();
    
    vm.startPrank(user1);

    vm.warp(1000);

    SecureVault(secureVaultAddress).mint(
      uint8(Visibility.Public),
      keccak256("Test"),
      new bytes32[](0),
      "Test",
      "https://example.com"
    );

    Metadata memory metadata = SecureVault(secureVaultAddress).getMetadata(1);

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
    address secureVaultAddress = testDeployNewSecureVault();

    require(keccak256(bytes(SecureVault(secureVaultAddress).name())) == keccak256("SecureVault"), "Name should be 'SecureVault'");
  }

  function testGetSymbol() public {
    address secureVaultAddress = testDeployNewSecureVault();

    require(keccak256(bytes(SecureVault(secureVaultAddress).symbol())) == keccak256("SV"), "Symbol should be 'SV'");
  }
}