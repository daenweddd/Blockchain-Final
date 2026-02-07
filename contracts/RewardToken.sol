// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// Reward token 
contract RewardToken is ERC20, Ownable {

    // address that is allowed to mint tokens 
    address public minter;

    // custom errors
    error NotMinter();
    error ZeroAddress();

    // token constructor
    constructor(string memory name_, string memory symbol_)
        ERC20(name_, symbol_)
        Ownable(msg.sender) {}

    // set contract that can mint tokens
    function setMinter(address _minter) external onlyOwner {
        if (_minter == address(0)) revert ZeroAddress(); // prevent zero address
        minter = _minter;
    }

    // mint new tokens to user
    function mint(address to, uint256 amount) external {
        // only minter contract can call this
        if (msg.sender != minter) revert NotMinter();
        _mint(to, amount);
    }
}
