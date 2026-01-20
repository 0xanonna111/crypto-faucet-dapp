// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Faucet {
    IERC20 public token;
    uint256 public constant AMOUNT = 100 * 10**18; // 100 Tokens
    uint256 public constant LOCK_TIME = 1 days;

    mapping(address => uint256) public nextAccessTime;

    event TokensDispensed(address receiver, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function requestTokens() external {
        require(msg.sender != address(0), "Invalid address");
        require(block.timestamp >= nextAccessTime[msg.sender], "Cooldown active: Please wait 24h");
        require(token.balanceOf(address(this)) >= AMOUNT, "Faucet is empty");

        nextAccessTime[msg.sender] = block.timestamp + LOCK_TIME;
        token.transfer(msg.sender, AMOUNT);
        
        emit TokensDispensed(msg.sender, AMOUNT);
    }
    
    // View function to help the UI
    function getCooldownSeconds(address user) external view returns (uint256) {
        if (block.timestamp >= nextAccessTime[user]) {
            return 0;
        } else {
            return nextAccessTime[user] - block.timestamp;
        }
    }
}
