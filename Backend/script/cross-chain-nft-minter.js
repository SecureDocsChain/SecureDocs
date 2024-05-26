const { task } = require("hardhat/config");
const { getPayFeesIn, getPrivateKey, getProviderRpcUrl, getRouterConfig } = require("./utils");
const { Wallet, providers } = require("ethers");
const { LINK_ADDRESSES } = require("./constants");
const { getCcipMessageId } = require("./helpers");
const Spinner = require("../utils/spinner");
const {
  DestinationMinter__factory,
  MyNFT__factory,
  SourceMinter__factory
} = require("../typechain-types");

task("deploy-destination-cross-chain-nft-minter", "Deploys MyNFT.sol and DestinationMinter.sol smart contracts")
  .addOptionalParam("router", "The address of the Router contract on the destination blockchain")
  .setAction(async (taskArguments, hre) => {
    const routerAddress = taskArguments.router ? taskArguments.router : getRouterConfig(hre.network.name).address;

    const privateKey = getPrivateKey();
    const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

    const provider = new providers.JsonRpcProvider(rpcProviderUrl);
    const wallet = new Wallet(privateKey);
    const deployer = wallet.connect(provider);

    const spinner = new Spinner();

    console.log(`ℹ️  Attempting to deploy MyNFT smart contract on the ${hre.network.name} blockchain using ${deployer.address} address`);
    spinner.start();

    const myNftFactory = await hre.ethers.getContractFactory('MyNFT');
    const myNft = await myNftFactory.deploy();
    await myNft.deployed();

    spinner.stop();
    console.log(`✅ MyNFT contract deployed at address ${myNft.address} on the ${hre.network.name} blockchain`);

    console.log(`ℹ️  Attempting to deploy DestinationMinter smart contract on the ${hre.network.name} blockchain using ${deployer.address} address, with the Router address ${routerAddress} provided as constructor argument`);
    spinner.start();

    const destinationMinterFactory = await hre.ethers.getContractFactory('DestinationMinter');
    const destinationMinter = await destinationMinterFactory.deploy(routerAddress, myNft.address);
    await destinationMinter.deployed();

    spinner.stop();
    console.log(`✅ DestinationMinter contract deployed at address ${destinationMinter.address} on the ${hre.network.name} blockchain`);

    console.log(`ℹ️  Attempting to grant the minter role to the DestinationMinter smart contract`);
    spinner.start();

    const tx = await myNft.transferOwnership(destinationMinter.address);
    await tx.wait();

    spinner.stop();
    console.log(`✅ DestinationMinter can now mint MyNFTs. Transaction hash: ${tx.hash}`);
  });

task("deploy-source-cross-chain-nft-minter", "Deploys SourceMinter.sol smart contract")
  .addOptionalParam("router", "The address of the Router contract on the source blockchain")
  .setAction(async (taskArguments, hre) => {
    const routerAddress = taskArguments.router ? taskArguments.router : getRouterConfig(hre.network.name).address;
    const linkAddress = taskArguments.link ? taskArguments.link : LINK_ADDRESSES[hre.network.name];

    const privateKey = getPrivateKey();
    const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

    const provider = new providers.JsonRpcProvider(rpcProviderUrl);
    const wallet = new Wallet(privateKey);
    const deployer = wallet.connect(provider);

    const spinner = new Spinner();

    console.log(`ℹ️  Attempting to deploy SourceMinter smart contract on the ${hre.network.name} blockchain using ${deployer.address} address, with the Router address ${routerAddress} and LINK address ${linkAddress} provided as constructor arguments`);
    spinner.start();

    const sourceMinterFactory = await hre.ethers.getContractFactory('SourceMinter');
    const sourceMinter = await sourceMinterFactory.deploy(routerAddress, linkAddress);
    await sourceMinter.deployed();

    spinner.stop();
    console.log(`✅ SourceMinter contract deployed at address ${sourceMinter.address} on the ${hre.network.name} blockchain`);
  });

task("cross-chain-mint", "Mints the new NFT by sending the Cross-Chain Message")
  .addParam("sourceBlockchain", "The name of the source blockchain (for example ethereumSepolia)")
  .addParam("sourceMinter", "The address of the SourceMinter.sol smart contract on the source blockchain")
  .addParam("destinationBlockchain", "The name of the destination blockchain (for example polygonMumbai)")
  .addParam("destinationMinter", "The address of the DestinationMinter.sol smart contract on the destination blockchain")
  .addParam("payFeesIn", "Choose between 'Native' and 'LINK'")
  .setAction(async (taskArguments) => {
    const { sourceBlockchain, sourceMinter, destinationBlockchain, destinationMinter, payFeesIn } = taskArguments;

    const privateKey = getPrivateKey();
    const sourceRpcProviderUrl = getProviderRpcUrl(sourceBlockchain);

    const sourceProvider = new providers.JsonRpcProvider(sourceRpcProviderUrl);
    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(sourceProvider);

    const spinner = new Spinner();

    const sourceMinterContract = SourceMinter__factory.connect(sourceMinter, signer);

    const destinationChainSelector = getRouterConfig(destinationBlockchain).chainSelector;
    const fees = getPayFeesIn(payFeesIn);

    console.log(`ℹ️  Attempting to call the mint function of the SourceMinter.sol smart contract on the ${sourceBlockchain} from ${signer.address} account`);
    spinner.start();

    const tx = await sourceMinterContract.mint(
      destinationChainSelector,
      destinationMinter,
      fees
    );

    const receipt = await tx.wait();

    spinner.stop();
    console.log(`✅ Mint request sent, transaction hash: ${tx.hash}`);

    await getCcipMessageId(tx, receipt, sourceProvider);

    console.log(`✅ Task cross-chain-mint finished with the execution`);
  });

task('cross-chain-mint-balance-of', 'Gets the balance of MyNFTs for provided address')
  .addParam("myNft", "The address of the MyNFT smart contract")
  .addParam("blockchain", "The blockchain where the MyNFT smart contract was deployed")
  .addParam("owner", "The address to check the balance of MyNFTs")
  .setAction(async (taskArguments) => {
    const rpcProviderUrl = getProviderRpcUrl(taskArguments.blockchain);
    const provider = new providers.JsonRpcProvider(rpcProviderUrl);

    const spinner = new Spinner();

    const myNft = MyNFT__factory.connect(taskArguments.myNft, provider);

    console.log(`ℹ️  Attempting to check the balance of MyNFTs (${taskArguments.myNft}) for the ${taskArguments.owner} account`);
    spinner.start();

    const balanceOf = await myNft.balanceOf(taskArguments.owner);

    spinner.stop();
    console.log(`ℹ️  The balance of MyNFTs of the ${taskArguments.owner} account is ${balanceOf.toNumber()}`);
  });