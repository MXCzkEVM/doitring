// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/ProxyForwardUpgradeable.sol";

contract DoitRingFriend is VerifiableUpgradeable, ProxyForwardUpgradeable, ERC721URIStorageUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
  uint256 private _tokenIds;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  mapping(address => uint256) public userToGroup;

  event GroupCreated(
    address indexed creator,
    uint256 group,
    string tokenURI,
    uint256 timestamp
  );
  event GroupJoined(
    address indexed user,
    uint256 group,
    uint256 timestamp
  );
  event GroupLeaved(
    address indexed user,
    uint256 group,
    uint256 timestamp
  );

  error UserAlreadyInGroup();
  error UserNotInGroup();

  function initialize(address _owner, address _verifier) public initializer {
    __Ownable_init(_owner);
    __Proxyed_init(_owner);
    __Verifie_init(_verifier);
    __UUPSUpgradeable_init();
    _tokenIds = 1;
  }

  function create(address signer, string memory tokenURI, bytes memory signature) public proxy(signer) {
    verify(abi.encodePacked(signer, tokenURI), signature);

    uint256 groupId = mint(signer, tokenURI);

    userToGroup[signer] = groupId;
    emit GroupCreated(signer, groupId, tokenURI, block.timestamp);
    emit GroupJoined(signer, groupId, block.timestamp);
  }

  function join(address signer, uint256 groupId, bytes memory signature) public proxy(signer) {
    verify(abi.encodePacked(signer, groupId), signature);
    if (userToGroup[signer] != 0) {
      revert UserAlreadyInGroup();
    }

    userToGroup[signer] = groupId;
    emit GroupJoined(signer, groupId, block.timestamp);
  }

  function leave(address signer) public proxy(signer) {
    if (userToGroup[signer] == 0) {
      revert UserNotInGroup();
    }

    uint256 groupId = userToGroup[signer];
    delete userToGroup[signer];
    emit GroupLeaved(signer, groupId, block.timestamp);
  }

  function group(address user) public view returns(uint256) {
    return userToGroup[user];
  }

  function mint(address user, string memory tokenURI) internal returns (uint256) {
    uint256 newItemId = _tokenIds;
    _safeMint(user, newItemId);
    _setTokenURI(newItemId, tokenURI);
    _tokenIds++;
    return newItemId;
  }
  
  function _baseURI() internal pure override returns (string memory) {
    return "https://gateway.pinata.cloud/ipfs/";
  }
}