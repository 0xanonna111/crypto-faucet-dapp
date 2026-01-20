# Crypto Faucet dApp

A decentralized faucet that allows users to request "TestCoin" (TEST) every 24 hours. This architecture is commonly used on testnets (like Sepolia or Goerli) to help developers acquire tokens for testing.

## 💧 Features
- **ERC-20 Integration**: Dispenses a standard OpenZeppelin token.
- **Cooldown Logic**: Prevents users from spamming requests (1 request per day).
- **Contract Funding**: The Faucet contract must be funded with tokens to work.
- **Balance Tracking**: UI shows the user's cooldown status and faucet health.

## 🛠 Architecture
1. **FaucetToken**: A mintable ERC-20 token.
2. **Faucet Contract**: Holds the tokens and tracks `mapping(address => uint) lastAccessTime`.
3. **Frontend**: Checks if the user is in cooldown and enables/disables the "Request" button.

## 🚀 Deployment Guide

1. **Install**
   ```bash
   npm install
