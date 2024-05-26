const { ContractReceipt, ContractTransaction, providers } = require("ethers");

const getCcipMessageId = async (tx, receipt, provider) => {
    // Simule un appel au routeur pour récupérer l'ID du message
    const call = {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
        value: tx.value,
    };

    // Simule un appel de contrat avec les données de transaction au bloc avant la transaction
    const messageId = await provider.call(call, receipt.blockNumber - 1);

    console.log(`✅ You can now monitor the token transfer status via CCIP Explorer (https://ccip.chain.link) by searching for CCIP Message ID: ${messageId}`);
}

module.exports = {
    getCcipMessageId
};