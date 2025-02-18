// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./utils/VerifiableUpgradeable.sol";
import "./utils/ProxyForwardUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

contract DoitRingStaked is VerifiableUpgradeable, ProxyForwardUpgradeable, BidirectionalTransfer, UUPSUpgradeable, OwnableUpgradeable {

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  uint256 locking;
  mapping(address => Stake[]) public Stakes;
  mapping(address => mapping(uint128 => uint256)) public Cancells;

  error StakeEmpty();
  error StakeAmountEmpty();
  error StakeCancelEmpty();
  error StakeCancelUnexpired();
  
  event StakeCreated(
    address indexed staker,
    uint indexed index,
    address token,
    uint amount,
    uint timestamp
  );

  event StakeCancelled(
    address indexed staker,
    uint indexed index,
    address token,
    uint amount,
    uint timestamp
  );

  event StakeClaimed(
    address indexed staker,
    uint indexed index,
    address token,
    uint amount,
    uint timestamp
  );

  struct Stake {
    uint index;
    address staker;
    address token;
    uint amount;
    uint timestamp;
  }

  function initialize(address _owner) public initializer {
    __Ownable_init(_owner);
    __Proxyed_init(_owner);
    __UUPSUpgradeable_init();
    locking = 30 * 86400;
  }

  function create(address sender, address token, uint amount) public proxy(sender) {
    if (amount == 0)
      revert StakeAmountEmpty();

    uint index = Stakes[sender].length;

    Stake memory stake = Stake(index, sender, token, amount, block.timestamp);
    Stakes[sender].push(stake);

    transfer(sender, address(this), token, amount);

    emit StakeCreated(
      sender,
      index,
      token,
      amount,
      block.timestamp
    );
  }

  function cancel(address sender, uint128 index) public proxy(sender) {
    if (Stakes[sender][index].amount == 0)
      revert StakeEmpty();

    Cancells[sender][index] = block.timestamp + locking;

    emit StakeCancelled(
      sender,
      index,
      Stakes[sender][index].token, 
      Stakes[sender][index].amount,
      block.timestamp
    );
  }

  function claim(address sender, uint128 index) public proxy(sender) {
    if (Stakes[sender][index].amount == 0)
      revert StakeEmpty();
    if (Cancells[sender][index] == 0)
      revert StakeCancelEmpty();
    if (Cancells[sender][index] > block.timestamp)
      revert StakeCancelUnexpired();

    transfer(
      address(this),
      sender,
      Stakes[sender][index].token,
      Stakes[sender][index].amount
    );

   emit StakeClaimed(
      sender,
      index,
      Stakes[sender][index].token, 
      Stakes[sender][index].amount, 
      block.timestamp
    );

    delete Stakes[sender][index];
    delete Cancells[sender][index];
  }

  function stakes(address owner) public view returns(Stake[] memory) {
    return Stakes[owner];
  }

  function status(address owner, uint128 index) public view returns(uint16) {
    if (Cancells[owner][index] != 0) {
      if (Cancells[owner][index] > block.timestamp)
        return 3;
      else
        return 2;
    }
    if (Stakes[owner][index].amount != 0)
      return 1;
    else
      return 0;
  }

  function length(address owner) public view returns(uint256) {
   return Stakes[owner].length;
  }

  function expiration(address owner, uint128 index) public view returns(uint256) {
    return Cancells[owner][index];
  }

  function exists(address owner, uint128 index) public view returns(bool) {
    return Stakes[owner][index].amount != 0;
  }

  function setLocking(uint256 duration) public onlyOwner() {
    locking = duration;
  }

  function __migrate_stakes(address owner, Stake[] memory stakes_) public onlyOwner() {
    delete Stakes[owner];
    for (uint256 index = 0; index < stakes_.length; index++) {
      Stakes[owner].push(stakes_[index]);
    }
  }
  
  function __migrate_StakeCreated(address owner, uint256 index, address token, uint amount, uint timestamp) public onlyOwner() {
    emit StakeCreated(
      owner,
      index,
      token,
      amount,
      timestamp
    );
  }

  function __migrate_StakeCancelled(address owner, uint256 index, address token, uint amount, uint timestamp) public onlyOwner() {
    emit StakeCancelled(
      owner,
      index,
      token,
      amount,
      timestamp
    );
  }

  function __migrate_StakeClaimed(address owner, uint256 index, address token, uint amount, uint timestamp) public onlyOwner() {
    emit StakeClaimed(
      owner,
      index,
      token,
      amount,
      timestamp
    );
  }
}