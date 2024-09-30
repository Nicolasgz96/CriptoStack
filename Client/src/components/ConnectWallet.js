import React from 'react';
import Web3 from 'web3'; // Note: This import is not used in the current code

// ConnectWallet component that handles wallet connection and disconnection
const ConnectWallet = ({ connectWallet, disconnectWallet, isConnected }) => {
    // Function to handle button click
    const handleClick = () => {
        if (isConnected) {
            // If wallet is connected, disconnect it
            disconnectWallet();
        } else {
            // If wallet is not connected, connect it
            connectWallet();
        }
    };

    // Render the button
    return (
        <button 
            onClick={handleClick} // Call handleClick when the button is clicked
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            {/* Change button text based on connection status */}
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
    );
};

export default ConnectWallet;