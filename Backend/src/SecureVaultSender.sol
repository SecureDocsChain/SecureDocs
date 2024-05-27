// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {SecureVault, Metadata} from "./SecureVault.sol";
import {SecureVaultFactory} from "./SecureVaultFactory.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

error Unauthorized();
error ContractLogicAlreadySet();
error SecureVaultAlreadyDeployed();
error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);

/**
 * @title SecureVaultCrossChainRouter
 * @notice SecureVaultCrossChainRouter contract that sends cross-chain messages
 * 
 * @dev sendVerifiedDocumentCrossChain() sends a cross-chain message to a receiver
 */
contract SecureVaultSender is Ownable {
  address immutable factory;

  IRouterClient private s_router;
  LinkTokenInterface private s_linkToken;

  event MessageSent(
    bytes32 indexed messageId,
    uint64 indexed destinationChainSelector,
    address receiver,
    bytes datas,
    address feeToken,
    uint256 fees
  );

  // constructor for amoy testnet
  constructor(address _factory) Ownable(msg.sender) {
    factory = _factory;
    s_router = IRouterClient(0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2);
    s_linkToken = LinkTokenInterface(0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904);
  }

  function sendVerifiedDocumentCrossChain(
    address owner,
    uint256 tokenId,
    uint64 destinationChainSelector,
    address receiver
  ) external returns (bytes32 messageId) {
    address secureVault = SecureVaultFactory(factory).getSecureVault(owner);
    if (secureVault == address(0)) revert Unauthorized();
    Metadata memory metadata = SecureVault(secureVault).getMetadata(tokenId);

    bytes memory datas = abi.encode(owner, tokenId, metadata);

    // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
    Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
      receiver: abi.encode(receiver), // ABI-encoded receiver address
      data: datas, // ABI-encoded string
      tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array indicating no tokens are being sent
      extraArgs: Client._argsToBytes(
          // Additional arguments, setting gas limit
          Client.EVMExtraArgsV1({gasLimit: 200_000})
      ),
      // Set the feeToken  address, indicating LINK will be used for fees
      feeToken: address(s_linkToken)
    });

    // Get the fee required to send the message
    uint256 fees = s_router.getFee(
      destinationChainSelector,
      evm2AnyMessage
    );

    // Transfer the fees from caller to the contract
    s_linkToken.transferFrom(msg.sender, address(this), fees);

    // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
    s_linkToken.approve(address(s_router), fees);

    // Send the message through the router and store the returned message ID
    messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

    // Emit an event with message details
    emit MessageSent(
      messageId,
      destinationChainSelector,
      receiver,
      datas,
      address(s_linkToken),
      fees
    );

    // Return the message ID
    return messageId;
  }
}