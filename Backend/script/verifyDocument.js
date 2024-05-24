import hardhat from 'hardhat';
const { ethers } = hardhat;
// No need to import mongoose since we're not using it

async function main() {
    const [deployer] = await ethers.getSigners();

    const secureDocsNFTAddress = "0x1c44E8db37Cdc6737819b8235782F3fB5Dbf644a";
    const SecureDocsNFT = await ethers.getContractFactory("SecureDocsNFT");
    const secureDocsNFT = await SecureDocsNFT.attach(secureDocsNFTAddress);

    // **Simulate Document and User Data:**

    const documentId = "144252"; // Replace with a temporary value
    const documentHash = "48465846445";
    const userAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Use the deployer's address for testing


    // **Verify the document and issue the NFT:**

    const tx = await secureDocsNFT.verifyDocument(userAddress, documentHash);
    await tx.wait();

    console.log("Document verified and NFT issued:", tx);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });