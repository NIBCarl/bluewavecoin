// Blue Wave Coin - Wallet Connection System
// Comprehensive Web3 wallet integration for Democratic cryptocurrency

(function() {
    'use strict';

    // Wallet connection state
    let walletState = {
        isConnected: false,
        account: null,
        provider: null,
        chainId: null,
        balance: 0,
        walletType: null
    };

    // Supported wallets with proper detection
    const supportedWallets = {
        metamask: {
            name: 'MetaMask',
            icon: '🦊',
            check: () => {
                return window.ethereum && (
                    window.ethereum.isMetaMask || 
                    (window.ethereum.providers && window.ethereum.providers.some(p => p.isMetaMask))
                );
            },
            connect: connectMetaMask,
            installUrl: 'https://metamask.io/download/'
        },
        coinbase: {
            name: 'Coinbase Wallet',
            icon: '💙',
            check: () => {
                return window.ethereum && (
                    window.ethereum.isCoinbaseWallet ||
                    (window.ethereum.providers && window.ethereum.providers.some(p => p.isCoinbaseWallet))
                );
            },
            connect: connectCoinbaseWallet,
            installUrl: 'https://www.coinbase.com/wallet'
        },
        walletconnect: {
            name: 'WalletConnect',
            icon: '🔗',
            check: () => true, // Always available as fallback
            connect: connectWalletConnect,
            installUrl: null // No installation needed
        }
    };

    // Blue Wave token contract details (example - replace with actual)
    const BLUEWAVE_CONTRACT = {
        address: '0x742d35Cc6634C0532925a3b8D65f5b0f1d6A5a1f', // Example address
        abi: [
            // Minimal ERC20 ABI for balance checking
            {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{"name": "", "type": "string"}],
                "type": "function"
            }
        ]
    };

    // Initialize wallet connection system
    function initWalletSystem() {
        console.log('🌊 Initializing Blue Wave wallet system...');
        
        // Add click handlers to connect wallet buttons
        document.querySelectorAll('.nav-cta, .btn-connect-wallet').forEach(button => {
            button.addEventListener('click', handleWalletConnection);
        });

        // Check if already connected
        setTimeout(checkExistingConnection, 500);
        
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('disconnect', handleDisconnect);
        }

        console.log('✅ Blue Wave wallet system ready!');
    }

    // Handle wallet connection button click
    async function handleWalletConnection(event) {
        event.preventDefault();
        
        if (walletState.isConnected) {
            showWalletModal();
        } else {
            showWalletSelectionModal();
        }
    }

    // Show wallet selection modal
    function showWalletSelectionModal() {
        // Remove existing modal if any
        const existingModal = document.querySelector('.wallet-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'wallet-modal';
        modal.innerHTML = `
            <div class="wallet-modal-overlay">
                <div class="wallet-modal-content">
                    <div class="wallet-modal-header">
                        <h3>🌊 Connect to Blue Wave</h3>
                        <button class="wallet-modal-close">&times;</button>
                    </div>
                    <div class="wallet-modal-body">
                        <p>Choose your wallet to join the Democratic movement:</p>
                        <div class="wallet-options">
                            ${Object.entries(supportedWallets).map(([key, wallet]) => {
                                const isAvailable = wallet.check();
                                return `
                                    <button class="wallet-option" data-wallet="${key}" ${!isAvailable ? 'data-install-url="' + (wallet.installUrl || '') + '"' : ''}>
                                        <span class="wallet-icon">${wallet.icon}</span>
                                        <span class="wallet-name">${wallet.name}</span>
                                        ${!isAvailable ? '<span class="wallet-status">Install Wallet</span>' : '<span class="wallet-status">Connect</span>'}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <div class="wallet-terms">
                            <p>By connecting, you agree to join the Democratic crypto movement.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .wallet-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                font-family: var(--font-body, 'Lato', sans-serif);
            }
            
            .wallet-modal-overlay {
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .wallet-modal-content {
                background: white;
                border-radius: 15px;
                max-width: 400px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 51, 102, 0.3);
            }
            
            .wallet-modal-header {
                padding: 20px 20px 10px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .wallet-modal-header h3 {
                margin: 0;
                color: var(--democratic-blue, #003366);
                font-size: 1.25rem;
            }
            
            .wallet-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 30px;
                height: 30px;
            }
            
            .wallet-modal-body {
                padding: 20px;
            }
            
            .wallet-options {
                margin: 20px 0;
            }
            
            .wallet-option {
                width: 100%;
                padding: 15px;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                background: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;
                transition: all 0.3s ease;
            }
            
            .wallet-option:hover:not(:disabled) {
                border-color: var(--democratic-blue, #003366);
                background: var(--light-blue, #f0f9ff);
            }
            
            .wallet-option:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .wallet-icon {
                font-size: 24px;
            }
            
            .wallet-name {
                font-weight: 500;
                flex: 1;
                text-align: left;
            }
            
            .wallet-status {
                font-size: 12px;
                color: #6b7280;
            }
            
            .wallet-terms {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
            }
            
            .wallet-terms p {
                font-size: 14px;
                color: #6b7280;
                margin: 0;
                text-align: center;
            }
            
            .wallet-connecting {
                opacity: 0.7;
                pointer-events: none;
            }
            
            .wallet-connecting::after {
                content: '...';
                animation: dots 1.5s infinite;
            }
            
            @keyframes dots {
                0%, 20% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.wallet-modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.wallet-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) modal.remove();
        });

        // Add wallet option listeners
        modal.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', async () => {
                const walletType = option.dataset.wallet;
                const wallet = supportedWallets[walletType];
                const installUrl = option.dataset.installUrl;
                
                // Check if wallet is available
                if (!wallet.check() && installUrl) {
                    // Redirect to installation
                    window.open(installUrl, '_blank');
                    return;
                }
                
                if (!wallet.check() && !installUrl) {
                    showErrorMessage('This wallet type is not available in your browser');
                    return;
                }
                
                option.classList.add('wallet-connecting');
                option.innerHTML = `
                    <span class="wallet-icon">${wallet.icon}</span>
                    <span class="wallet-name">Connecting to ${wallet.name}</span>
                `;
                
                try {
                    await wallet.connect();
                    modal.remove();
                } catch (error) {
                    console.error('Wallet connection failed:', error);
                    option.classList.remove('wallet-connecting');
                    option.innerHTML = `
                        <span class="wallet-icon">${wallet.icon}</span>
                        <span class="wallet-name">${wallet.name}</span>
                        <span class="wallet-status">Connection Failed</span>
                    `;
                    
                    showErrorMessage('Failed to connect to ' + wallet.name + ': ' + error.message);
                    
                    setTimeout(() => {
                        const isAvailable = wallet.check();
                        option.innerHTML = `
                            <span class="wallet-icon">${wallet.icon}</span>
                            <span class="wallet-name">${wallet.name}</span>
                            ${!isAvailable ? '<span class="wallet-status">Install Wallet</span>' : '<span class="wallet-status">Connect</span>'}
                        `;
                    }, 2000);
                }
            });
        });
    }

    // MetaMask connection
    async function connectMetaMask() {
        try {
            let provider = null;
            
            // Check for MetaMask in different scenarios
            if (window.ethereum) {
                if (window.ethereum.isMetaMask) {
                    provider = window.ethereum;
                } else if (window.ethereum.providers) {
                    // Multiple wallets installed
                    provider = window.ethereum.providers.find(p => p.isMetaMask);
                }
            }
            
            if (!provider) {
                throw new Error('MetaMask not detected. Please install MetaMask wallet.');
            }

            const accounts = await provider.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please unlock MetaMask.');
            }

            walletState.account = accounts[0];
            walletState.provider = provider;
            walletState.walletType = 'metamask';
            walletState.isConnected = true;

            await updateWalletInfo();
            updateWalletUI();
            
            showSuccessMessage('🦊 MetaMask connected successfully!');
            console.log('✅ MetaMask connected:', walletState.account);

        } catch (error) {
            console.error('MetaMask connection error:', error);
            if (error.code === 4001) {
                throw new Error('Connection rejected by user');
            } else if (error.code === -32002) {
                throw new Error('Connection request already pending');
            }
            throw new Error('Failed to connect MetaMask: ' + error.message);
        }
    }

    // WalletConnect connection (simplified fallback)
    async function connectWalletConnect() {
        // For demo purposes, show instructions
        showWalletConnectInstructions();
    }

    // Coinbase Wallet connection
    async function connectCoinbaseWallet() {
        try {
            let provider = null;
            
            // Check for Coinbase Wallet in different scenarios
            if (window.ethereum) {
                if (window.ethereum.isCoinbaseWallet) {
                    provider = window.ethereum;
                } else if (window.ethereum.providers) {
                    // Multiple wallets installed
                    provider = window.ethereum.providers.find(p => p.isCoinbaseWallet);
                }
            }
            
            if (!provider) {
                throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet.');
            }

            const accounts = await provider.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please unlock Coinbase Wallet.');
            }

            walletState.account = accounts[0];
            walletState.provider = provider;
            walletState.walletType = 'coinbase';
            walletState.isConnected = true;

            await updateWalletInfo();
            updateWalletUI();
            
            showSuccessMessage('💙 Coinbase Wallet connected successfully!');

        } catch (error) {
            console.error('Coinbase Wallet connection error:', error);
            if (error.code === 4001) {
                throw new Error('Connection rejected by user');
            }
            throw new Error('Failed to connect Coinbase Wallet: ' + error.message);
        }
    }

    // Show WalletConnect instructions
    function showWalletConnectInstructions() {
        const modal = document.createElement('div');
        modal.className = 'wallet-modal';
        modal.innerHTML = `
            <div class="wallet-modal-overlay">
                <div class="wallet-modal-content">
                    <div class="wallet-modal-header">
                        <h3>🔗 WalletConnect Instructions</h3>
                        <button class="wallet-modal-close">&times;</button>
                    </div>
                    <div class="wallet-modal-body">
                        <p>To use WalletConnect with Blue Wave Coin:</p>
                        <ol>
                            <li>Download a WalletConnect compatible wallet app</li>
                            <li>Create or import your wallet</li>
                            <li>Look for the WalletConnect or "Connect to DApp" option</li>
                            <li>Scan the QR code when it appears</li>
                        </ol>
                        <p><strong>Note:</strong> Full WalletConnect integration coming soon!</p>
                        <button class="btn btn-primary" onclick="this.closest('.wallet-modal').remove()">
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.wallet-modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.wallet-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) modal.remove();
        });
    }

    // Update wallet information
    async function updateWalletInfo() {
        if (!walletState.provider || !walletState.account) return;

        try {
            // Get chain ID
            walletState.chainId = await walletState.provider.request({
                method: 'eth_chainId'
            });

            // Get ETH balance
            const balance = await walletState.provider.request({
                method: 'eth_getBalance',
                params: [walletState.account, 'latest']
            });
            
            walletState.balance = parseInt(balance, 16) / Math.pow(10, 18);

        } catch (error) {
            console.error('Error updating wallet info:', error);
        }
    }

    // Update wallet UI
    function updateWalletUI() {
        const connectButtons = document.querySelectorAll('.nav-cta, .btn-connect-wallet');
        
        connectButtons.forEach(button => {
            if (walletState.isConnected) {
                const shortAddress = walletState.account.slice(0, 6) + '...' + walletState.account.slice(-4);
                button.innerHTML = `
                    <span class="wallet-icon">${supportedWallets[walletState.walletType]?.icon || '🔗'}</span>
                    <span class="wallet-address">${shortAddress}</span>
                `;
                button.classList.add('wallet-connected');
            } else {
                button.innerHTML = 'Connect Wallet';
                button.classList.remove('wallet-connected');
            }
        });

        // Update any wallet info displays
        updateWalletInfoDisplays();
    }

    // Update wallet info displays
    function updateWalletInfoDisplays() {
        const walletInfoElements = document.querySelectorAll('.wallet-info');
        
        walletInfoElements.forEach(element => {
            if (walletState.isConnected) {
                element.innerHTML = `
                    <div class="wallet-connected-info">
                        <div class="wallet-address">
                            ${walletState.account.slice(0, 10)}...${walletState.account.slice(-8)}
                        </div>
                        <div class="wallet-balance">
                            ${walletState.balance.toFixed(4)} ETH
                        </div>
                    </div>
                `;
            } else {
                element.innerHTML = '<div class="wallet-not-connected">Wallet not connected</div>';
            }
        });
    }

    // Show wallet modal for connected wallet
    function showWalletModal() {
        const modal = document.createElement('div');
        modal.className = 'wallet-modal';
        modal.innerHTML = `
            <div class="wallet-modal-overlay">
                <div class="wallet-modal-content">
                    <div class="wallet-modal-header">
                        <h3>🌊 Blue Wave Wallet</h3>
                        <button class="wallet-modal-close">&times;</button>
                    </div>
                    <div class="wallet-modal-body">
                        <div class="wallet-info-display">
                            <div class="wallet-type">
                                <span class="wallet-icon">${supportedWallets[walletState.walletType]?.icon || '🔗'}</span>
                                <span>${supportedWallets[walletState.walletType]?.name || 'Connected Wallet'}</span>
                            </div>
                            <div class="wallet-address-full">
                                <label>Address:</label>
                                <div class="address-copy">
                                    <span class="address">${walletState.account}</span>
                                    <button class="copy-btn" onclick="navigator.clipboard.writeText('${walletState.account}')">📋</button>
                                </div>
                            </div>
                            <div class="wallet-balance-display">
                                <label>ETH Balance:</label>
                                <span class="balance">${walletState.balance.toFixed(6)} ETH</span>
                            </div>
                        </div>
                        <div class="wallet-actions">
                            <button class="btn btn-secondary" onclick="window.open('https://etherscan.io/address/${walletState.account}', '_blank')">
                                View on Etherscan
                            </button>
                            <button class="btn btn-outline disconnect-btn">
                                Disconnect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add additional styles for wallet modal
        const style = document.createElement('style');
        style.textContent = `
            .wallet-info-display {
                margin: 20px 0;
                padding: 20px;
                background: #f8fafc;
                border-radius: 10px;
            }
            
            .wallet-info-display > div {
                margin-bottom: 15px;
            }
            
            .wallet-info-display label {
                display: block;
                font-weight: 500;
                color: #374151;
                margin-bottom: 5px;
            }
            
            .wallet-type {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
            }
            
            .address-copy {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .address {
                font-family: monospace;
                font-size: 14px;
                word-break: break-all;
                flex: 1;
            }
            
            .copy-btn {
                background: none;
                border: 1px solid #d1d5db;
                border-radius: 5px;
                padding: 5px 8px;
                cursor: pointer;
            }
            
            .balance {
                font-weight: 500;
                color: var(--democratic-blue, #003366);
            }
            
            .wallet-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .wallet-actions .btn {
                flex: 1;
            }
            
            .disconnect-btn {
                color: #dc2626 !important;
                border-color: #dc2626 !important;
            }
            
            .disconnect-btn:hover {
                background: #dc2626 !important;
                color: white !important;
            }
            
            .wallet-connected {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .wallet-connected .wallet-icon {
                font-size: 16px;
            }
            
            .wallet-connected .wallet-address {
                font-family: monospace;
                font-size: 14px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.wallet-modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.wallet-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) modal.remove();
        });

        modal.querySelector('.disconnect-btn').addEventListener('click', () => {
            disconnectWallet();
            modal.remove();
        });
    }

    // Check for existing connection
    async function checkExistingConnection() {
        if (!window.ethereum) {
            console.log('No Web3 provider detected');
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (accounts && accounts.length > 0) {
                walletState.account = accounts[0];
                walletState.provider = window.ethereum;
                walletState.isConnected = true;
                
                // Determine wallet type more accurately
                if (window.ethereum.isMetaMask) {
                    walletState.walletType = 'metamask';
                } else if (window.ethereum.isCoinbaseWallet) {
                    walletState.walletType = 'coinbase';
                } else if (window.ethereum.providers) {
                    // Multiple providers
                    const metaMaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
                    const coinbaseProvider = window.ethereum.providers.find(p => p.isCoinbaseWallet);
                    
                    if (metaMaskProvider) {
                        walletState.walletType = 'metamask';
                        walletState.provider = metaMaskProvider;
                    } else if (coinbaseProvider) {
                        walletState.walletType = 'coinbase';
                        walletState.provider = coinbaseProvider;
                    } else {
                        walletState.walletType = 'unknown';
                    }
                } else {
                    walletState.walletType = 'unknown';
                }

                await updateWalletInfo();
                updateWalletUI();
                
                // Remove the premature success message
                console.log('✅ Existing wallet connection found:', walletState.account);
            } else {
                console.log('No connected wallet accounts found');
            }
        } catch (error) {
            console.error('Error checking existing connection:', error);
        }
    }

    // Handle account changes
    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            disconnectWallet();
        } else {
            walletState.account = accounts[0];
            updateWalletInfo();
            updateWalletUI();
        }
    }

    // Handle chain changes
    function handleChainChanged(chainId) {
        walletState.chainId = chainId;
        updateWalletInfo();
    }

    // Handle disconnect
    function handleDisconnect() {
        disconnectWallet();
    }

    // Disconnect wallet
    function disconnectWallet() {
        walletState = {
            isConnected: false,
            account: null,
            provider: null,
            chainId: null,
            balance: 0,
            walletType: null
        };
        
        updateWalletUI();
        showSuccessMessage('👋 Wallet disconnected');
        console.log('🔌 Wallet disconnected');
    }

    // Show success message
    function showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'wallet-toast success';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--democratic-blue, #003366);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-family: var(--font-body, 'Lato', sans-serif);
            animation: slideIn 0.3s ease-out;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Show error message
    function showErrorMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'wallet-toast error';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-family: var(--font-body, 'Lato', sans-serif);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWalletSystem);
    } else {
        initWalletSystem();
    }

    // Export wallet state for external access
    window.BlueWaveWallet = {
        getState: () => walletState,
        connect: showWalletSelectionModal,
        disconnect: disconnectWallet,
        isConnected: () => walletState.isConnected
    };

})();
