async function main() {
    const [deployer] = await ethers.getSigners();

    const secureDocsNFTAddress = "0x1c44E8db37Cdc6737819b8235782F3fB5Dbf644a"; // Remplacez par l'adresse de votre contrat déployé
    const SecureDocsNFT = await ethers.getContractFactory("SecureDocsNFT");
    const secureDocsNFT = await SecureDocsNFT.attach(secureDocsNFTAddress);

    const notaryAddress = "0xEc76081eE119656e4814E4EF3B707F59412A2Fb9"; // Remplacez par l'adresse du notaire

    const tx = await secureDocsNFT.addNotary(notaryAddress);
    await tx.wait();

    console.log("Notary added:", notaryAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });