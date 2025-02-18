// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/ProxyForward.sol";

contract DoitRingNFT is ERC721, ProxyForward, Ownable {
  constructor(address _owner) ERC721("DoitRingNFT", "DoitRingNFT") Ownable(_owner) ProxyForward(_owner) {
    _tokenIdCounter = 1;
    totalSupply = 1;
  }

  uint256 private _tokenIdCounter;
  uint128 public totalSupply;

  function mint(address signer) public proxy(signer) {
    uint256 tokenId = _tokenIdCounter;
    _safeMint(signer, tokenId);
    _tokenIdCounter += 1;
    totalSupply += 1;
  }

  function __migrate_mint(address signer, uint256 tokenId) public onlyOwner {
    _safeMint(signer, tokenId);
    _tokenIdCounter += 1;
    totalSupply += 1;
  }
}
