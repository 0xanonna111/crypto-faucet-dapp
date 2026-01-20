// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FaucetToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("TestCoin", "TEST") {
        // Mint 10 million tokens to the deployer initially
        _mint(msg.sender, initialSupply * 10**decimals());
    }
}
