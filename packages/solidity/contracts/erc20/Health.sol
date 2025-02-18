// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../utils/ProxyForward.sol";

contract Health is ERC20, ProxyForward, Ownable {
  constructor(address _owner) ERC20("Blueberry", "Blueberry") Ownable(_owner) ProxyForward(_owner) {
    _mint(_owner, 40000000 * 10 ** 18);
  }

  function mint(address account,  uint256 amount) public onlyOwner {
    _mint(account, amount);
  }

  function proxy_approve(address signer, address spender, uint256 value) public proxy(signer) {
    _approve(signer, spender, value);
  }
}
