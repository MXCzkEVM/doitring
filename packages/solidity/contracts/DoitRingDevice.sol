// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";
import "./utils/ProxyForwardUpgradeable.sol";

contract DoitRingDevice is ProxyForwardUpgradeable, VerifiableUpgradeable, BidirectionalTransfer, UUPSUpgradeable, OwnableUpgradeable {

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  struct DeviceMapping {
    uint256 timestamp;
    int256 height;
    string sncode;
  }

  struct TokenMapping {
    address token;
    uint256 tokenId;
  }

  struct Reward {
    address token;
    uint256 amount;
  }

  mapping(address => string) private AddressMapDevice;
  mapping(string => TokenMapping) private DeviceMapToken;
  mapping(address => mapping(uint256 => DeviceMapping)) private TokenMapDevice;

  mapping(string => bool) private ClaimIDsMapClaimed;

  error DeviceRegistered();
  error DeviceUnregistered();
  error DeviceEmpty();
  error ClaimInvalidClaimed();
  error ERC721IncorrectOwner();

  event Claimed(
    address indexed token,
    uint256 indexed tokenId,
    string uid,
    string sncode,
    address to,
    Reward[] rewards,
    string memo,
    int256 blockHeight,
    uint256 timestamp
  );

  event Registered(
    address indexed token,
    uint256 indexed tokenId,
    address indexed sender,
    string sncode,
    int256 blockHeight,
    uint256 timestamp
  );

  event Binded(
    address indexed owner,
    string sncode,
    int256 blockHeight,
    uint256 timestamp
  );


  function initialize(address _owner, address _verifier) public initializer {
    __Ownable_init(_owner);
    __Proxyed_init(_owner);
    __Verifie_init(_verifier);
    __UUPSUpgradeable_init();
  }

  function register(address sender, address token, uint256 tokenId, string memory sncode) public proxy(sender) {
    if (IERC721(token).ownerOf(tokenId) != sender)
      revert ERC721IncorrectOwner();
    if (bytes(sncode).length == 0)
      revert DeviceEmpty();
    if (DeviceMapToken[sncode].token != address(0))
      revert DeviceRegistered();

    TokenMapDevice[token][tokenId] = DeviceMapping(block.timestamp, int(block.number), sncode);
    DeviceMapToken[sncode] = TokenMapping(token, tokenId);
    
    emit Registered(
      token,
      tokenId,
      sender,
      sncode, 
      int(block.number), 
      block.timestamp
    );

    AddressMapDevice[sender] = sncode;

    emit Binded(sender, sncode, int(block.number), block.timestamp);
  }

  function rebind(address sender, string memory sncode) public proxy(sender) {
    if (bytes(sncode).length == 0)
      revert DeviceEmpty();
    if (DeviceMapToken[sncode].token == address(0))
      revert DeviceUnregistered();
    if (IERC721(DeviceMapToken[sncode].token)
       .ownerOf(DeviceMapToken[sncode].tokenId) != msg.sender)
      revert ERC721IncorrectOwner();

    AddressMapDevice[msg.sender] = sncode;

    emit Binded(msg.sender, sncode, int(block.number), block.timestamp);
  }

  function claim(
    address sender,
    string memory uid,
    string memory sncode,
    Reward[] memory rewards,
    bytes memory signature, 
    string memory memo
  ) public proxy(sender) {
    TokenMapping memory tmapping = DeviceMapToken[sncode];
    if (tmapping.token == address(0))
      revert DeviceUnregistered();
    if (IERC721(tmapping.token).ownerOf(tmapping.tokenId) != sender)
      revert ERC721IncorrectOwner();
    if (ClaimIDsMapClaimed[uid])
      revert ClaimInvalidClaimed();

    bytes32 rewardsHash = keccak256(abi.encode(rewards));
    verify(abi.encodePacked(uid, sender, sncode, rewardsHash), signature);

    ClaimIDsMapClaimed[uid] = true;

    for (uint256 i = 0; i < rewards.length; i++) {
      if (rewards[i].amount > 0)
        transfer(
          address(this),
          sender,
          rewards[i].token, 
          rewards[i].amount
        );
    }
    
    emit Claimed(
      tmapping.token,
      tmapping.tokenId, 
      uid,
      sncode,
      sender, 
      rewards,
      memo,
      int(block.number),
      block.timestamp
    );
  }

  function getTokenInAddress(address user) public view returns (TokenMapping memory) {
    return DeviceMapToken[AddressMapDevice[user]];
  }

  function getTokenInDevice(string memory sncode) public view returns (TokenMapping memory) {
    return DeviceMapToken[sncode];
  }

  function getDeviceInToken(address token, uint256 tokenId) public view returns (DeviceMapping memory) {
    return TokenMapDevice[token][tokenId];
  }

  function getDeviceInAddress(address user)  public view returns (string memory) {
    return AddressMapDevice[user];
  }
  
  function existsBinded(address token, uint256 tokenId) public view returns (bool) {
    return bytes(getDeviceInToken(token, tokenId).sncode).length != 0;
  }

  function withdraw(address token, uint256 amount) public onlyOwner() {
    transfer(address(this), msg.sender, token, amount);
  }

  function __migrate_Claimed(
    address token, uint256 tokenId, string memory uid, string memory sncode,
    address to, Reward[] memory rewards, string memory memo,
    int256 blockHeight, uint256 timestamp
  ) public onlyOwner {
    ClaimIDsMapClaimed [uid] = true;
    emit Claimed(
      token,
      tokenId,
      uid,
      sncode,
      to,
      rewards,
      memo,
      blockHeight,
      timestamp
    );
  }

  function __migrate_Registered(
    address token, uint256 tokenId, address sender,
    string memory sncode, int256 blockHeight, uint256 timestamp
  ) public onlyOwner {
    TokenMapDevice[token][tokenId] = DeviceMapping(timestamp, blockHeight, sncode);
    DeviceMapToken[sncode] = TokenMapping(token, tokenId);
    AddressMapDevice[sender] = sncode;
    emit Registered(
      token,
      tokenId,
      sender,
      sncode,
      blockHeight,
      timestamp
    );
    emit Binded(sender, sncode, blockHeight, timestamp);
  }
}
