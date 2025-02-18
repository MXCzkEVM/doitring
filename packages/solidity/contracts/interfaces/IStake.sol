// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStake {

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
}