// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RewardToken - educational ERC-20 reward token (no real value)
/// @notice Minting is restricted to a single minter (your Crowdfunding contract)
contract RewardToken is ERC20, Ownable {
    address public minter;

    error NotMinter();
    error ZeroAddress();

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {}

    /// @notice Set the minter (should be your Crowdfunding contract address)
    function setMinter(address _minter) external onlyOwner {
        if (_minter == address(0)) revert ZeroAddress();
        minter = _minter;
    }

    /// @notice Mint reward tokens to a user (call this from Crowdfunding contract)
    function mint(address to, uint256 amount) external {
        if (msg.sender != minter) revert NotMinter();
        _mint(to, amount);
    }
}
