import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ethers } from 'ethers';

// This is the main Staking component. It receives props from its parent component.
function Staking({ contract, account, walletAddress, showAlert }) {
    // State variables to manage the component's data
    const [amount, setAmount] = useState(''); // Stores the amount to stake/unstake
    const [canStakeNow, setCanStakeNow] = useState(false); // Indicates if staking is currently possible
    const [stakedBalance, setStakedBalance] = useState('0'); // Stores the user's current staked balance
    const [isFocused, setIsFocused] = useState(false); // Tracks if the input field is focused

    // This effect runs when the component mounts or when contract/account changes
    useEffect(() => {
      // Function to check if staking is possible
      const checkCanStake = async () => {
        const result = await canStake();
        setCanStakeNow(result);
      };
    
      // If contract and account are available, check if staking is possible and get the staked balance
      if (contract && account) {
        checkCanStake();
        getStakeBalance();
      }
    }, [contract, account]);
  
    // Function to handle the staking process
    const handleStake = async () => {
        if (!isWalletConnected()) return; // Check if wallet is connected
        if (!isValidAmount()) return; // Check if the amount is valid
        
        // Ask for user confirmation
        const confirmStake = window.confirm(`Are you sure you want to stake ${amount} tokens?`);
        if (!confirmStake) return;
      
        try {
          await performStakeTransaction(); // Perform the staking transaction
          showAlert(`You have successfully staked ${amount} tokens.`, "success");
          setAmount(''); // Clear the input field after successful staking
        } catch (error) {
          handleStakingError(error); // Handle any errors that occur during staking
        }
    };
      
    // Function to check if the wallet is connected
    const isWalletConnected = () => {
        if (!walletAddress) {
          showAlert("Please connect your wallet to proceed.", "error");
          return false;
        }
        return true;
    };
      
    // Function to check if the entered amount is valid
    const isValidAmount = () => {
        if (!amount || amount <= 0) {
          showAlert("Please enter a valid amount.", "error");
          return false;
        }
        return true;
    };
      
    // Function to perform the actual staking transaction
    const performStakeTransaction = async () => {
        await getStakeBalance();
        // Estimate the gas required for the transaction
        const gasEstimate = await contract.stake.estimateGas(STAKE_PARAM, { value: ethers.parseEther(amount) });
        // Send the staking transaction
        const tx = await contract.stake(STAKE_PARAM, { 
          value: ethers.parseEther(amount),
          gasLimit: gasEstimate.mul(GAS_LIMIT_FACTOR).div(100) // Add 20% to the estimated gas
        });
        await tx.wait(); // Wait for the transaction to be mined
        await getStakeBalance(); // Update the staked balance after staking
    };
      
    // Function to handle errors that occur during staking
    const handleStakingError = (error) => {
        console.error("Staking interaction:", error);
        if (error.code === 4001) {
          showAlert("You canceled the staking transaction. No tokens were staked.", "info");
        } else if (error.reason && error.reason.includes("You have unstaked within 1 day")) {
          showAlert("You cannot stake within 1 day after unstaking. Please try again after 24 hours.", "error");
        } else {
          showAlert("An error occurred while staking. Please try again.", "error");
        }
    };
      
    const STAKE_PARAM = 0; // Parameter used in the staking function of the smart contract
    const GAS_LIMIT_FACTOR = 120; // 20% extra gas limit to ensure transaction success
  
    // Function to handle the unstaking process
    const handleUnstake = async () => {
      if (!isWalletConnected()) return; // Check if wallet is connected
      if (!isValidAmount()) return; // Check if the amount is valid
      if (parseFloat(amount) > parseFloat(stakedBalance)) {
        showAlert("You cannot unstake more than your staked balance.", "error");
        return;
      }

      // Ask for user confirmation
      const confirmUnstake = window.confirm(`Are you sure you want to unstake ${amount} tokens?`);
      if (!confirmUnstake) return;

      try {
        // Send the unstaking transaction
        const tx = await contract.unstake(ethers.parseEther(amount));
        await tx.wait(); // Wait for the transaction to be mined
        showAlert(`You have successfully unstaked ${amount} tokens.`, "success");
        setAmount(''); // Clear the input field after successful unstaking
        await getStakeBalance(); // Update the staked balance after unstaking
      } catch (error) {
        handleUnstakingError(error); // Handle any errors that occur during unstaking
      }
    };

    // Function to handle errors that occur during unstaking
    const handleUnstakingError = (error) => {
      console.error("Unstaking interaction:", error);
      if (error.code === 4001) {
        showAlert("You canceled the unstaking transaction. No tokens were unstaked.", "info");
      } else {
        showAlert('An error occurred while unstaking. Please try again.', "error");
      }
    };
  
    // Function to get the user's current staked balance
    const getStakeBalance = async () => {
      if (!contract || !account) return;
      try {
        const balance = await contract.getStakeBalance(account);
        const formattedBalance = ethers.formatEther(balance);
        setStakedBalance(formattedBalance);
        console.log("Staked balance:", formattedBalance);
      } catch (error) {
        console.error("Error fetching the staked balance:", error);
      }
    };
  
    // Function to check if staking is currently possible
    const canStake = async () => {
      if (!contract || !account) return false;
      try {
        const canStake = await contract.getCanStake();
        return canStake;
      } catch (error) {
        console.error("Error checking if staking is possible:", error);
        return false;
      }
    };
  
    // Function to handle the "Can I Stake?" button click
    const handleCanIStake = async () => {
      if (!isWalletConnected()) return;
      if (!isValidAmount()) return;
      const result = await canStake();
      showAlert(result ? "Yes, you can stake." : "No, you cannot stake at the moment.", result ? "success" : "info");
    };
  
    // The component's UI
    return (
        <div className="mt-8 space-y-6">
        <div className="relative mb-4">
          <input 
            type="number" 
            id="amount"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            placeholder=" "
          />
          <label 
            htmlFor="amount" 
            className={`absolute left-4 transition-all duration-200 ${
                isFocused || amount 
                  ? '-top-2.5 text-sm text-purple-500 bg-white px-1' 
                  : 'top-2 text-gray-500'
            }`}
          >
            Amount to stake/unstake
          </label>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Your staked balance: {stakedBalance} tokens
        </div>
        <div className="flex flex-col space-y-4">
          <button 
            onClick={handleStake}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Stake
          </button>
          <button 
            onClick={handleUnstake}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Unstake
          </button>
          <button 
            onClick={handleCanIStake}
            className="w-full bg-purple-400 text-white py-2 px-4 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Can I Stake?
          </button>
        </div>
      </div>
    );
}
  
export default Staking;