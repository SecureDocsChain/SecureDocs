# SecureVault Protocol

## Overview

The SecureVault protocol is a set of smart contracts designed for securely storing and managing metadata of documents on any EVM blockchain. The protocol leverages ERC721 tokens to represent and manage these documents. The key contracts in this protocol are:

1. **SecureVault.sol**: An ERC721 contract that stores metadata of documents and manages document visibility.
2. **SecureVaultFactory.sol**: A factory contract for deploying SecureVault contracts and minting tokens.
3. **SecureVaultReceiver.sol**: A contract that facilitates the reception of cross-chain messages containing document metadata.
4. **SecureVaultSender.sol**: A contract that allows users to send verified documents from their SecureVault across chains.

## Contracts

### SecureVault.sol

The `SecureVault` contract is an ERC721 contract that stores metadata of documents. It includes functionality for minting new document tokens and retrieve metadata associated with these tokens.

- **Functions:**
  - `initialize(address initialOwner)`: Initializes the contract with the given owner.
  - `mint(address verifier, uint8 visibility, bytes32 documentHash, bytes32[] memory keywords, string memory documentType, string memory uri)`: Mints a new token with the specified metadata.
  - `getMetadata(uint256 tokenId)`: Returns the metadata of a given token ID.
  - `tokenURI(uint256 tokenId)`: Returns the URI of a given token ID.
- **Modifiers:**
  - `onlyOwner()`: Restricts access to owner-only functions.
- **Errors:**
  - `Unauthorized()`: Emitted when an unauthorized action is attempted.
  - `AlreadyInitialized()`: Emitted when an already initialized contract is attempted to be initialized again.
  - `TransferOwnershipNotAllowed()`: Emitted when an ownership transfer is not allowed.

### SecureVaultFactory.sol

The `SecureVaultFactory` contract deploys new instances of the `SecureVault` contract and handles the minting of tokens. It also manages verifiers who are authorized to mint tokens.

- **Functions:**
  - `deploy(address owner)`: Deploys a new `SecureVault` instance for the specified owner.
  - `getSecureVault(address owner)`: Returns the address of the `SecureVault` associated with the given owner.
  - `registerVerifier(address verifier, string memory name)`: Registers a new verifier with the specified address and name.
  - `mint(address user, uint8 visibility, bytes32 documentHash, bytes32[] memory keywords, string memory documentType, string memory uri)`: Mints a new token with the specified metadata for the user.
  - `getVerifier(address verifier)`: Returns the data of the specified verifier.
- **Events:**
  - `Deployed(address indexed secureVault)`: Emitted when a new SecureVault is deployed.
- **Errors:**
  - `Unauthorized()`: Emitted when an unauthorized action is attempted.
  - `VerifierAlreadyExist()`: Emitted when a verifier already exists.
  - `SecureVaultAlreadyDeployed()`: Emitted when a SecureVault is already deployed for an owner.

### SecureVaultReceiver.sol

The `SecureVaultReceiver` contract receives cross-chain messages containing document metadata and stores them.

- **Constructor:**
  - `constructor(address router, address sender)`: Sets the router and the expected sender of the cross-chain messages.
- **Functions:**
  - `_ccipReceive(Client.Any2EVMMessage memory any2EvmMessage)`: Internal function that processes received cross-chain messages.
  - `verifyDocumentHash(address user, uint256 tokenId, bytes32 documentHash)`: Verifies the document hash for a given user and token ID.
  - `getDocumentData(address user, uint256 tokenId)`: Returns the document data for a given user and token ID.
- **Events:**
  - `MessageReceived(bytes32 indexed messageId, uint64 indexed sourceChainSelector, address sender, bytes data)`: Emitted when a message is received across chains.

### SecureVaultSender.sol

The `SecureVaultSender` contract allows users to send verified documents from their `SecureVault` to any address across chains.

- **Constructor:**
  - `constructor(address factory)`: Sets the address of the `SecureVaultFactory` for deploying and managing vaults.
- **Functions:**
  - `sendVerifiedDocumentCrossChain(address owner, uint256 tokenId, uint64 destinationChainSelector, address receiver)`: Sends a verified document from the owner's vault to a receiver on another chain.
- **Events:**
  - `MessageSent(bytes32 indexed messageId, uint64 indexed destinationChainSelector, address receiver, bytes datas, address feeToken, uint256 fees)`: Emitted when a message is sent across chains.

## Deployment and Usage

1. **Deploy SecureVaultFactory**: Deploy the `SecureVaultFactory` contract first.
2. **Create a SecureVault**: Call `deploy()` on the `SecureVaultFactory` to create a new vault.
3. **Register Verifiers**: Use `registerVerifier()` to register verifiers who can mint tokens.
4. **Deploy SecureVaultReceiver and SecureVaultSender**: Deploy the `SecureVaultReceiver` and `SecureVaultSender` contracts, passing the address of the CCIP router.
5. **Mint Tokens and Store Metadata**: Use the `mint` function in `SecureVaultFactory` to mint new tokens and store document metadata.
6. **Send Verified Documents Across Chains**: Use the `sendVerifiedDocumentCrossChain` function in `SecureVaultSender` to send verified documents to `SecureVaultReceiver` on other chains.

## Example Usage

```solidity
// Deploy the SecureVaultFactory
SecureVaultFactory factory = new SecureVaultFactory();
factory.deploy(msg.sender);

// Deploy the sender and receiver contracts
SecureVaultSender sender = new SecureVaultSender(factoryAddress);
SecureVaultReceiver receiver = new SecureVaultReceiver(routerAddress, senderAddress);

// Get the address of the new vault
address vaultAddress = factory.getSecureVault(msg.sender);

// Register a verifier
factory.registerVerifier(verifierAddress, verifierName);

// Mint a new token
factory.mint(userAddress, visibility, documentHash, keywords, documentType, uri);

// Send a verified document across chains
linkContractAddress.approve(sender, fee);
sender.sendVerifiedDocumentCrossChain(userAddress, tokenId, destinationChainSelector, receiverAddress);
```

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
