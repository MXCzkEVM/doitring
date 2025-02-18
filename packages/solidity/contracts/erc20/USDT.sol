// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20, Ownable {
  constructor(address _owner) ERC20("USDT", "USDT") Ownable(msg.sender) {
    _mint(_owner, 40000000 * 10 ** 18);
  }

  function mint(address account,  uint256 amount) public onlyOwner {
    _mint(account, amount);
  }
}
