// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureDocsNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    struct Document {
        address notary;
        address user;
        string documentHash;
        bool isVerified;
    }

    mapping(uint256 => Document) public documents;
    mapping(address => bool) public notaryWhitelist;

    event DocumentVerified(uint256 indexed tokenId, address indexed notary, address indexed user, string documentHash);
    event NotaryAdded(address indexed notary);
    event NotaryRemoved(address indexed notary);

    constructor() ERC721("SecureDocsNFT", "SDNFT") {
        tokenCounter = 0;
    }

    modifier onlyNotary() {
        require(notaryWhitelist[msg.sender], "Only authorized notaries can perform this action");
        _;
    }

    function addNotary(address notary) public onlyOwner {
        notaryWhitelist[notary] = true;
        emit NotaryAdded(notary);
    }

    function removeNotary(address notary) public onlyOwner {
        notaryWhitelist[notary] = false;
        emit NotaryRemoved(notary);
    }

    function verifyDocument(address user, string memory documentHash) public onlyNotary returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(user, newTokenId);

        documents[newTokenId] = Document({
            notary: msg.sender,
            user: user,
            documentHash: documentHash,
            isVerified: true
        });

        emit DocumentVerified(newTokenId, msg.sender, user, documentHash);

        tokenCounter += 1;
        return newTokenId;
    }
}