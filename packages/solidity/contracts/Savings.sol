// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./utils/ProxyForwardUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

contract Savings is Initializable, BidirectionalTransfer, ProxyForwardUpgradeable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable  {
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}


  event Deposited(
    address indexed sender,
    address indexed receiver,
    address token,
    uint256 amount,
    string memo
  );

  event Withdrawn(
    address indexed receiver,
    address token,
    uint256 amount
  );

  mapping(address => mapping(address => uint256)) Treasury; 

  function initialize(address _owner) public initializer {
    __Ownable_init(_owner);
    __Proxyed_init(_owner);
    __UUPSUpgradeable_init();
  }

  function balanceOf(address owner, address token) public view returns(uint256) {
    return Treasury[owner][token];
  }

  function deposit(address owner, address token, uint256 amount, string memory memo) external payable {
    Treasury[owner][token] += amount;
    transfer(msg.sender, address(this), token, amount);
    emit Deposited(msg.sender, owner, token, amount, memo);
  }

  function withdraw(address owner, address token) external payable proxy(owner) {
    transfer(address(this), owner, token, Treasury[owner][token]);
    emit Withdrawn(owner, token, Treasury[owner][token]);
    delete Treasury[owner][token];
  }
}