import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, AlertCircle, Copy, CheckCircle, ExternalLink } from 'lucide-react';

const WalletConnection = () => {
  const {
    account,
    isConnecting,
    error,
    isConnected,
    isMetaMaskInstalled,
    connectWallet,
    disconnect,
    getBalance,
    getNetwork,
  } = useWeb3();

  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);
  const [copied, setCopied] = useState(false);

  // Balance ve network bilgilerini güncelle
  useEffect(() => {
    if (isConnected) {
      fetchWalletInfo();
    }
  }, [isConnected, account]);

  const fetchWalletInfo = async () => {
    try {
      const [balanceResult, networkResult] = await Promise.all([
        getBalance(),
        getNetwork(),
      ]);
      setBalance(balanceResult);
      setNetwork(networkResult);
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-red-100 font-semibold">MetaMask Not Found</h3>
            <p className="text-red-200 text-sm mt-1">
              Please install MetaMask to connect your wallet.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-red-300 hover:text-red-100 text-sm mt-2 transition-colors"
            >
              Install MetaMask
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-white/60 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-purple-200 text-sm mb-4">
            Connect your MetaMask wallet to access Web3 features
          </p>
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mb-4">
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect MetaMask
              </div>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-lg border border-green-400/30 p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Wallet Connected</h3>
            <p className="text-green-200 text-sm">Successfully connected to MetaMask</p>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="text-white/60 hover:text-white text-sm px-3 py-1 rounded border border-white/20 hover:border-white/40 transition-colors"
        >
          Disconnect
        </button>
      </div>

      <div className="space-y-3">
        {/* Wallet Address */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">
                Wallet Address
              </p>
              <p className="text-white font-mono text-sm mt-1">
                {formatAddress(account)}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(account)}
              className="text-white/60 hover:text-white transition-colors p-1"
              title="Copy address"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wide">
            Balance
          </p>
          <p className="text-white font-semibold mt-1">
            {parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>

        {/* Network */}
        {network && (
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wide">
              Network
            </p>
            <p className="text-white text-sm mt-1">
              {getNetworkName(Number(network.chainId))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnection; 