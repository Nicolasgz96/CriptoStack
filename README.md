# Blockchain Staking Application

## Overview

This project is a decentralized application (dApp) that enables users to stake and unstake tokens on an Ethereum-compatible blockchain. Built with React and ethers.js, it provides a user-friendly interface for interacting with a staking smart contract.

## Features

- Wallet Connection: Seamless integration with Web3 wallets like MetaMask
- Staking: Ability to stake tokens into the smart contract
- Unstaking: Functionality to withdraw staked tokens
- Real-time Balance: Display of user's current staked balance
- Transaction Handling: Efficient management of blockchain transactions
- Responsive Design: Mobile-friendly interface using Tailwind CSS
- Alert System: User notifications for actions and errors

## Technologies Used

- React.js
- ethers.js
- Tailwind CSS
- Web3.js (for wallet connection)

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Web3 wallet (e.g., MetaMask) installed in your browser

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/blockchain-staking-app.git
   ```

2. Navigate to the project directory:
   ```
   cd blockchain-staking-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```
   REACT_APP_CONTRACT_ADDRESS=your_contract_address_here
   ```

5. Start the development server:
   ```
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Usage

1. Connect your Web3 wallet using the "Connect Wallet" button.
2. Enter the amount you wish to stake in the input field.
3. Click "Stake" to stake your tokens or "Unstake" to withdraw them.
4. Confirm the transaction in your Web3 wallet.
5. View your updated staked balance on the interface.

## Smart Contract

The application interacts with a custom staking smart contract. The ABI for this contract is located in `src/utils/ABI/Transactions.json`. Ensure that you're connecting to the correct network where the contract is deployed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Thanks to the Ethereum community for providing robust tools and documentation.
- Tailwind CSS for the utility-first CSS framework.
