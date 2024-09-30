import React, { useState, useEffect } from "react";
import ConnectWallet from './components/ConnectWallet';
import Staking from "./utils/staking/Staking";
import Alert from "./components/Alert";
import { ethers } from 'ethers';
import contractABI from './utils/ABI/Transactions.json';

// The address of the smart contract we're interacting with
const contractAddress = '0xE8A3bbCbaca793ad7ba601e9061123ac744b72a7'; 

function App() {
  // State variables to manage the application's data
  const [walletAddress, setWalletAddress] = useState(''); // Stores the connected wallet address
  const [provider, setProvider] = useState(null); // Stores the Ethereum provider
  const [contract, setContract] = useState(null); // Stores the instance of the smart contract
  const [account, setAccount] = useState(''); // Stores the current account address
  const [alert, setAlert] = useState(null); // Stores the current alert message and type

 // Function to connect the wallet
 const connectWallet = async () => {
  if (window.ethereum) { // Check if MetaMask is installed
    try {
      // Create a new ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Request access to the user's accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Get the signer (the connected account)
      const signer = await provider.getSigner();

      setProvider(provider);
      const address = await signer.getAddress();
      setWalletAddress(address);
      setAccount(address);

      // Create an instance of the smart contract
      const contractInstance = new ethers.Contract(contractAddress, contractABI.abi, signer);
      setContract(contractInstance);
      showAlert("Wallet connected successfully", "success");
    } catch (error) {
      console.error("Error connecting the wallet:", error);
      showAlert("Error connecting the wallet. Please try again.", "error");
    }
  } else {
    showAlert("Please install MetaMask!", "error");
  }
};

// Function to disconnect the wallet
const disconnectWallet = () => {
  setWalletAddress('');
  setProvider(null);
  setContract(null);
  setAccount('');
};

// Function to truncate the wallet address for display
const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Function to show an alert message
const showAlert = (message, type) => {
  setAlert({ message, type });
};

// Function to close the alert message
const closeAlert = () => {
  setAlert(null);
};

// The main render function for the App component
return (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 py-6 flex flex-col justify-center sm:py-12">
    {/* Display the alert if there is one */}
    {alert && <Alert message={alert.message} type={alert.type} onClose={closeAlert} />}
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          {/* Main content container */}
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-4xl font-bold mb-5 text-center text-gray-800">Staking Application</h1>
            {/* ConnectWallet component */}
            <ConnectWallet 
              connectWallet={connectWallet} 
              disconnectWallet={disconnectWallet}
              isConnected={!!walletAddress}
            />
            {/* Display wallet address if connected */}
            {walletAddress ? (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">Wallet connected:</p>
                <p 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200 cursor-pointer"
                  title={walletAddress}
                >
                  {truncateAddress(walletAddress)}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-center text-sm text-gray-600">Please connect your wallet.</p>
            )}
            {/* Staking component */}
            <Staking 
              contract={contract}
              account={account}
              walletAddress={walletAddress}
              showAlert={showAlert}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default App;