async function main() {
    const [deployer] = await ethers.getSigners();

    const secureDocsNFTAddress = "deployed_contract_address"; // Remplacez par l'adresse de votre contrat déployé
    const SecureDocsNFT = await ethers.getContractFactory("SecureDocsNFT");
    const secureDocsNFT = await SecureDocsNFT.attach(secureDocsNFTAddress);

    const notaryAddress = "notary_address"; // Remplacez par l'adresse du notaire

    const tx = await secureDocsNFT.removeNotary(notaryAddress);
    await tx.wait();

    console.log("Notary removed:", notaryAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });