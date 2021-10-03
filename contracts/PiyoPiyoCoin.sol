// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PiyoCoin is ERC20 {

  address public minter;

  event MinterChanged(address indexed from, address to);

  constructor()  payable ERC20("PiyoPiyoCoin", "PIYO") {
    minter = msg.sender; //only initially
  }    

  function passMinterRole(address GameCenter) public returns (bool) {
  	require(msg.sender==minter, 'Error, only owner can change pass minter role');
  	minter = GameCenter;

    emit MinterChanged(msg.sender, GameCenter);
    return true;
  }

  function mint(address account, uint256 amount) public {
	require(msg.sender==minter, 'Error, msg.sender does not have minter role'); //GameCenter
	_mint(account, amount);
  }


}