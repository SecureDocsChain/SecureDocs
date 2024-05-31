# Securedocs: Technical Documentation

## Introduction

Securedocs is a decentralized, cross-chain application designed to ensure the security and authenticity of documents using blockchain technology. This project, developed for the Chainlink hackathon, focuses on secure document management. The application leverages the Cross-Chain Interoperability Protocol (CCIP) to enable seamless and secure document transfer between different blockchain networks, such as Polygon and Avalanche.

The protocol consists of two decentralized applications (dApps) and four smart contracts:

- **User dApp**: Allows users to upload and manage their documents. An EVM wallet is created using Web3Auth for each user.
- **Notary dApp**: Enables notaries to verify and authenticate documents. An EVM wallet is created using Web3Auth for each notary.

The three smart contracts involved are:

1. **SecureVault.sol**: An ERC721 contract that stores metadata of documents and manages document visibility.
2. **SecureVaultFactory.sol**: A factory contract for deploying SecureVault contracts and minting tokens.
3. **SecureVaultReceiver.sol**: A contract that facilitates the reception of cross-chain messages containing document metadata.
4. **SecureVaultSender.sol**: A contract that allows users to send verified documents from their SecureVault across chains.

### User Workflow

1. **User Uploads a Document**:

   - The user uploads a document via the frontend.
   - The document is sent to the backend where it is stored in the database.
   - A hash of the document is generated and stored for integrity verification.

2. **Notary Verifies the Document**:

   - A notary can select the document from the database.
   - The notary verifies the document and updates its status.

3. **Token Generation**:
   - Once verified, a token representing the document is generated.
   - This token is then sent to the user's SecureVault.
   - Cross-Chain Interoperability Protocol (CCIP) is used to transfer document data securely between different blockchains, such as from Polygon to Avalanche.

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

### Backend

1. **Models**

   - **User**: Defines user information, including their wallet, email, name, KYC status, associated documents, and appointments.
   - **Notaire**: Defines notary information, including their wallet, email, name, address, phone number, KBIS number, and professional information.
   - **Document**: Stores documents uploaded by users, including file data, hash for integrity verification, and validation status.

1. **User**

   - **Schema Definition**:
     ```javascript
     const UserSchema = new mongoose.Schema({
       wallet: { type: String, required: true, unique: true, index: true },
       email: { type: String, unique: true, index: true },
       name: { type: String },
       kycStatus: {
         type: String,
         enum: ["pending", "approved", "rejected"],
         default: "pending",
       },
       documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
       appointments: [
         { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
       ],
       createdAt: { type: Date, default: Date.now },
     });
     ```
   - **Functionality**:
     - Manages user information including wallet address, email, name, and KYC status.
     - Associates user with documents and appointments.

1. **Notaire**

   - **Schema Definition**:
     ```javascript
     const NotaireSchema = new mongoose.Schema({
       wallet: { type: String, required: true, unique: true },
       email: { type: String, required: true, unique: true },
       name: { type: String, required: true },
       address: { type: String, required: true },
       phoneNumber: { type: String, required: true },
       kbisNumber: { type: String, required: true },
       professionalInfo: { type: String, required: true },
       kycStatus: {
         type: String,
         enum: ["pending", "approved", "rejected"],
         default: "pending",
       },
       documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
       appointments: [
         { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
       ],
       createdAt: { type: Date, default: Date.now },
     });
     ```
   - **Functionality**:
     - Manages notary information including professional details and KYC status.
     - Associates notary with documents and appointments.

1. **Document**
   - **Schema Definition**:
     ```javascript
     const DocumentSchema = new mongoose.Schema({
       userId: { type: String, required: true },
       email: { type: String, required: true },
       fileName: { type: String, required: true },
       fileData: { type: Buffer, required: true },
       hash: { type: String, required: true },
       status: {
         type: String,
         enum: ["pending", "approved", "rejected"],
         default: "pending",
       },
       verifiedBy: { type: String },
       tokenId: { type: Number },
       createdAt: { type: Date, default: Date.now },
     });
     ```
   - **Functionality**:
     - Stores documents uploaded by users including file data and hash for integrity verification.
     - Tracks the status of document validation.

### API Endpoints

#### User API

- **Get User by Email**
  - **Endpoint**: `/api/users/:email`
  - **Method**: GET
  - **Functionality**: Retrieves user details by email.
  ```javascript
  router.get("/:email", async (req, res) => {
    await connectToDatabase();
    const { email } = req.params;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  });
  ```

#### Document API

- **Upload Document**

  - **Endpoint**: `/api/upload`
  - **Method**: POST
  - **Functionality**: Uploads a document and stores it in the database.

- **Get User Documents**
  - **Endpoint**: `/api/documents/user/:userId`
  - **Method**: GET
  - **Functionality**: Retrieves all documents associated with a user.

## Frontend

### Home Page (`index.js`)

The home page serves as the entry point of the application, offering users options to create an account or log in.

**Functions:**

- **connect**: Initiates the connection process to Web3Auth for authentication.
- **disconnect**: Logs the user out of the Web3Auth session.

### Account Page (`account.js`)

The account page allows users to view and update their account information and manage their documents.

**Functions:**

- **fetchUserData**: Fetches user information and documents from the backend.
- **handleUserUpdate**: Updates user information in the backend.
- **handleDocumentSubmit**: Redirects to the document upload page.
- **sendToAvalanche**: Simulates sending a document to Avalanche.
- **base64ToBlob**: Converts a base64 string to a blob.
- **handleDownload**: Handles document download.
- **shortenName**: Shortens long file names for display.

### Upload Page (upload.js)

The upload page allows users to upload their documents securely. This page handles the file upload, calculates the file hash for integrity, and sends the file to the backend.

**Functions:**

**handleFileChange:** Handles the file input change event.
**handleSubmit:** Handles the form submission to upload the document.
