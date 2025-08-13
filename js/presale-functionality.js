// Blue Wave Coin - Enhanced Presale Functionality
// Complete presale system with real-time updates and purchase handling

(function() {
    'use strict';

    // Presale state management
    let presaleState = {
        currentPhase: 'presale',
        tokensRaised: 2100000,
        totalSupply: 1000000000,
        currentPrice: 0.005,
        minPurchase: 0.01,
        maxPurchase: 10,
        progressPercentage: 68,
        isActive: true,
        endTime: new Date('2024-12-31T23:59:59Z').getTime()
    };

    // Price tiers for presale phases
    const priceTiers = {
        presale: { price: 0.005, label: 'Presale Price' },
        public: { price: 0.01, label: 'Public Sale' },
        listing: { price: 0.02, label: 'DEX Listing' }
    };

    // Initialize presale system
    function initPresaleSystem() {
        console.log('🌊 Initializing Blue Wave presale system...');
        
        // Initialize calculator
        initPresaleCalculator();
        
        // Initialize purchase buttons
        initPurchaseButtons();
        
        // Initialize countdown timer
        initCountdownTimer();
        
        // Update progress display
        updateProgressDisplay();
        
        // Start real-time updates
        startRealTimeUpdates();
        
        console.log('✅ Blue Wave presale system ready!');
    }

    // Initialize presale calculator
    function initPresaleCalculator() {
        // Handle multiple ETH input fields
        const ethInputs = document.querySelectorAll('.eth-amount-input, #eth-amount, #eth-amount-1');
        const outputAmounts = document.querySelectorAll('.output-amount');
        
        // Set up listeners for all ETH input fields
        ethInputs.forEach(ethInput => {
            if (ethInput) {
                // Enhanced calculator with real-time ETH price
                ethInput.addEventListener('input', function() {
                    calculateTokens(this.value);
                    // Sync all input fields
                    syncInputFields(this.value);
                });
                
                // Add input validation
                ethInput.addEventListener('blur', function() {
                    validatePurchaseAmount(this.value);
                });
                
                // Initial calculation
                if (ethInput.value) {
                    calculateTokens(ethInput.value);
                }
            }
        });
        
        // Add quick amount buttons
        addQuickAmountButtons();
    }

    // Sync all input fields to the same value
    function syncInputFields(value) {
        const ethInputs = document.querySelectorAll('.eth-amount-input, #eth-amount, #eth-amount-1');
        ethInputs.forEach(input => {
            if (input.value !== value) {
                input.value = value;
            }
        });
    }

    // Calculate tokens based on ETH input
    async function calculateTokens(ethAmount) {
        const ethValue = parseFloat(ethAmount) || 0;
        
        if (ethValue === 0) {
            updateCalculatorDisplay(0, 0, 0);
            return;
        }
        
        try {
            // Get current ETH price (in production, use real API)
            const ethPrice = await getCurrentETHPrice();
            const usdAmount = ethValue * ethPrice;
            const blueWaveTokens = Math.floor(usdAmount / presaleState.currentPrice);
            
            updateCalculatorDisplay(blueWaveTokens, usdAmount, ethValue);
            
            // Show bonus if applicable
            showBonusCalculation(blueWaveTokens, usdAmount);
            
        } catch (error) {
            console.error('Calculation error:', error);
            // Fallback calculation
            const fallbackETHPrice = 3500;
            const usdAmount = ethValue * fallbackETHPrice;
            const blueWaveTokens = Math.floor(usdAmount / presaleState.currentPrice);
            updateCalculatorDisplay(blueWaveTokens, usdAmount, ethValue);
        }
    }

    // Get current ETH price (mock implementation)
    async function getCurrentETHPrice() {
        // In production, replace with real API call
        // Example: CoinGecko, CoinMarketCap, or DeFi oracle
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                // Mock price with slight variations
                const basePrice = 3500;
                const variation = (Math.random() - 0.5) * 200;
                resolve(basePrice + variation);
            }, 100);
        });
    }

    // Update calculator display
    function updateCalculatorDisplay(tokens, usdAmount, ethAmount) {
        // Update all output amount elements
        const outputAmounts = document.querySelectorAll('.output-amount');
        outputAmounts.forEach(outputAmount => {
            if (outputAmount) {
                outputAmount.textContent = `${tokens.toLocaleString()} $BLUEWAVE`;
                
                // Add animation if significant change
                if (tokens > 1000) {
                    outputAmount.classList.add('highlight-calculation');
                    setTimeout(() => {
                        outputAmount.classList.remove('highlight-calculation');
                    }, 1000);
                }
            }
        });
        
        // Update all USD value elements
        const usdValues = document.querySelectorAll('.usd-value');
        usdValues.forEach(usdValue => {
            if (usdValue) {
                usdValue.textContent = `≈ $${usdAmount.toFixed(2)} USD`;
            }
        });
        
        // Update any other displays
        updatePurchasePreview(tokens, usdAmount, ethAmount);
    }

    // Show bonus calculation
    function showBonusCalculation(tokens, usdAmount) {
        // Check if we're in the "Join the Democratic Crypto Revolution" section
        const isDemocraticRevolutionSection = document.querySelector('#presale .section-title')?.textContent?.includes('Join the Democratic Crypto Revolution');
        
        // Skip bonus calculations for the Democratic Revolution section
        if (isDemocraticRevolutionSection) {
            const bonusDisplays = document.querySelectorAll('.bonus-display');
            bonusDisplays.forEach(display => {
                display.style.display = 'none';
            });
            return;
        }
        
        let bonus = 0;
        let bonusText = '';
        
        // Determine bonus based on purchase amount
        if (usdAmount >= 5000) {
            bonus = 0.20; // 20% bonus
            bonusText = '🎉 20% Bonus!';
        } else if (usdAmount >= 1000) {
            bonus = 0.15; // 15% bonus
            bonusText = '🎉 15% Bonus!';
        } else if (usdAmount >= 500) {
            bonus = 0.10; // 10% bonus
            bonusText = '🎉 10% Bonus!';
        } else if (usdAmount >= 100) {
            bonus = 0.05; // 5% bonus
            bonusText = '🎉 5% Bonus!';
        }
        
        const bonusDisplay = document.querySelector('.bonus-display');
        if (bonusDisplay) {
            if (bonus > 0) {
                const bonusTokens = Math.floor(tokens * bonus);
                const totalTokens = tokens + bonusTokens;
                
                bonusDisplay.innerHTML = `
                    <div class="bonus-info active">
                        <span class="bonus-label">${bonusText}</span>
                        <span class="bonus-amount">+${bonusTokens.toLocaleString()} bonus tokens</span>
                        <span class="total-amount">Total: ${totalTokens.toLocaleString()} $BLUEWAVE</span>
                    </div>
                `;
                bonusDisplay.style.display = 'block';
            } else {
                bonusDisplay.style.display = 'none';
            }
        }
    }

    // Add quick amount buttons
    function addQuickAmountButtons() {
        // Check if we're in the Democratic Revolution section (no quick buttons there)
        const isDemocraticRevolutionSection = document.querySelector('#presale .section-title')?.textContent?.includes('Join the Democratic Crypto Revolution');
        
        if (isDemocraticRevolutionSection) {
            return; // Don't add quick amount buttons to Democratic Revolution section
        }
        
        const calculatorSection = document.querySelector('.purchase-form, .presale-calculator');
        
        if (calculatorSection && !calculatorSection.querySelector('.quick-amounts')) {
            const quickAmounts = document.createElement('div');
            quickAmounts.className = 'quick-amounts';
            quickAmounts.innerHTML = `
                <div class="quick-amounts-label">Quick amounts:</div>
                <div class="quick-amount-buttons">
                    <button class="quick-amount-btn" data-amount="0.1">0.1 ETH</button>
                    <button class="quick-amount-btn" data-amount="0.5">0.5 ETH</button>
                    <button class="quick-amount-btn" data-amount="1">1 ETH</button>
                    <button class="quick-amount-btn" data-amount="5">5 ETH</button>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .quick-amounts {
                    margin: 15px 0;
                    padding: 15px;
                    background: #f8fafc;
                    border-radius: 10px;
                }
                
                .quick-amounts-label {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 10px;
                }
                
                .quick-amount-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .quick-amount-btn {
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .quick-amount-btn:hover {
                    border-color: var(--democratic-blue, #003366);
                    background: var(--light-blue, #f0f9ff);
                }
                
                .bonus-display {
                    margin-top: 15px;
                    padding: 15px;
                    background: linear-gradient(135deg, #fef3c7, #fbbf24);
                    border-radius: 10px;
                    display: none;
                }
                
                .bonus-info.active {
                    text-align: center;
                }
                
                .bonus-label {
                    font-weight: bold;
                    color: #92400e;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .bonus-amount {
                    color: #1f2937;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .total-amount {
                    font-weight: bold;
                    color: var(--democratic-blue, #003366);
                    display: block;
                }
                
                .highlight-calculation {
                    animation: highlight 1s ease-out;
                }
                
                @keyframes highlight {
                    0% { background: rgba(0, 168, 204, 0.2); }
                    100% { background: transparent; }
                }
            `;
            document.head.appendChild(style);
            
            // Insert after the input field
            const ethInput = document.getElementById('eth-amount');
            if (ethInput) {
                ethInput.parentNode.insertBefore(quickAmounts, ethInput.nextSibling);
            }
            
            // Add bonus display
            const bonusDisplay = document.createElement('div');
            bonusDisplay.className = 'bonus-display';
            quickAmounts.parentNode.insertBefore(bonusDisplay, quickAmounts.nextSibling);
            
            // Add event listeners
            quickAmounts.querySelectorAll('.quick-amount-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const amount = btn.dataset.amount;
                    if (ethInput) {
                        ethInput.value = amount;
                        calculateTokens(amount);
                        
                        // Add visual feedback
                        btn.style.background = 'var(--democratic-blue, #003366)';
                        btn.style.color = 'white';
                        setTimeout(() => {
                            btn.style.background = '';
                            btn.style.color = '';
                        }, 200);
                    }
                });
            });
        }
    }

    // Validate purchase amount
    function validatePurchaseAmount(ethAmount) {
        const ethValue = parseFloat(ethAmount) || 0;
        const errorElement = document.querySelector('.purchase-error');
        
        let errorMessage = '';
        
        if (ethValue > 0 && ethValue < presaleState.minPurchase) {
            errorMessage = `Minimum purchase: ${presaleState.minPurchase} ETH`;
        } else if (ethValue > presaleState.maxPurchase) {
            errorMessage = `Maximum purchase: ${presaleState.maxPurchase} ETH`;
        }
        
        if (errorElement) {
            if (errorMessage) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            } else {
                errorElement.style.display = 'none';
            }
        } else if (errorMessage) {
            // Create error element if it doesn't exist
            const error = document.createElement('div');
            error.className = 'purchase-error';
            error.textContent = errorMessage;
            error.style.cssText = `
                color: #dc2626;
                font-size: 14px;
                margin-top: 5px;
                padding: 8px;
                background: #fef2f2;
                border-radius: 6px;
                border: 1px solid #fecaca;
            `;
            
            const ethInput = document.getElementById('eth-amount');
            if (ethInput) {
                ethInput.parentNode.insertBefore(error, ethInput.nextSibling);
            }
        }
        
        return errorMessage === '';
    }

    // Initialize purchase buttons
    function initPurchaseButtons() {
        const purchaseButtons = document.querySelectorAll('.btn-purchase, .btn-buy-now, .btn-card');
        
        purchaseButtons.forEach(button => {
            button.addEventListener('click', handlePurchaseClick);
        });
    }

    // Handle purchase button click
    async function handlePurchaseClick(event) {
        event.preventDefault();
        
        // Check wallet connection
        if (!window.BlueWaveWallet || !window.BlueWaveWallet.isConnected()) {
            showPurchaseError('Please connect your wallet first');
            // Trigger wallet connection
            if (window.BlueWaveWallet) {
                window.BlueWaveWallet.connect();
            }
            return;
        }
        
        // Get purchase amount from any ETH input field
        const ethInputs = document.querySelectorAll('.eth-amount-input, #eth-amount, #eth-amount-1');
        let ethAmount = 0;
        
        // Find the first input with a value
        for (const input of ethInputs) {
            const value = parseFloat(input.value) || 0;
            if (value > 0) {
                ethAmount = value;
                break;
            }
        }
        
        if (!ethAmount || ethAmount === 0) {
            showPurchaseError('Please enter an amount to purchase');
            return;
        }
        
        // Validate amount
        if (!validatePurchaseAmount(ethAmount)) {
            return;
        }
        
        // Show purchase confirmation
        showPurchaseConfirmation(ethAmount);
    }

    // Show purchase confirmation modal
    function showPurchaseConfirmation(ethAmount) {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal';
        
        // Calculate purchase details
        getCurrentETHPrice().then(ethPrice => {
            const usdAmount = ethAmount * ethPrice;
            const tokens = Math.floor(usdAmount / presaleState.currentPrice);
            
            // Check if we're in the Democratic Revolution section (no bonuses)
            const isDemocraticRevolutionSection = document.querySelector('#presale .section-title')?.textContent?.includes('Join the Democratic Crypto Revolution');
            const bonus = isDemocraticRevolutionSection ? 0 : calculateBonus(usdAmount);
            const totalTokens = tokens + bonus;
            
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>🌊 Confirm Blue Wave Purchase</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="purchase-summary">
                                <div class="summary-row">
                                    <span>You're paying:</span>
                                    <span class="amount">${ethAmount} ETH (≈$${usdAmount.toFixed(2)})</span>
                                </div>
                                <div class="summary-row">
                                    <span>You'll receive:</span>
                                    <span class="amount">${tokens.toLocaleString()} $BLUEWAVE</span>
                                </div>
                                ${bonus > 0 ? `
                                <div class="summary-row bonus">
                                    <span>Bonus tokens:</span>
                                    <span class="amount">+${bonus.toLocaleString()} $BLUEWAVE</span>
                                </div>
                                <div class="summary-row total">
                                    <span><strong>Total tokens:</strong></span>
                                    <span class="amount"><strong>${totalTokens.toLocaleString()} $BLUEWAVE</strong></span>
                                </div>
                                ` : ''}
                                <div class="summary-row">
                                    <span>Price per token:</span>
                                    <span class="amount">$${presaleState.currentPrice.toFixed(4)}</span>
                                </div>
                            </div>
                            <div class="purchase-note">
                                <p>🔒 Your tokens will be available after the presale ends</p>
                                <p>📊 This transaction supports the Democratic movement</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary cancel-purchase">Cancel</button>
                            <button class="btn btn-primary confirm-purchase">
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .purchase-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    font-family: var(--font-body, 'Lato', sans-serif);
                }
                
                .modal-overlay {
                    background: rgba(0, 0, 0, 0.8);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 51, 102, 0.3);
                }
                
                .modal-header {
                    padding: 20px 20px 10px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    margin: 0;
                    color: var(--democratic-blue, #003366);
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .purchase-summary {
                    background: #f8fafc;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                }
                
                .summary-row:not(:last-child) {
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .summary-row.bonus {
                    color: #059669;
                    font-weight: 500;
                }
                
                .summary-row.total {
                    color: var(--democratic-blue, #003366);
                    border-top: 2px solid var(--democratic-blue, #003366);
                    padding-top: 12px;
                    margin-top: 12px;
                }
                
                .purchase-note {
                    background: #eff6ff;
                    border-radius: 8px;
                    padding: 15px;
                    border-left: 4px solid var(--democratic-blue, #003366);
                }
                
                .purchase-note p {
                    margin: 5px 0;
                    font-size: 14px;
                    color: #1e40af;
                }
                
                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 10px;
                }
                
                .modal-footer .btn {
                    flex: 1;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            modal.querySelector('.cancel-purchase').addEventListener('click', () => modal.remove());
            modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) modal.remove();
            });
            
            modal.querySelector('.confirm-purchase').addEventListener('click', () => {
                processPurchase(ethAmount, tokens, totalTokens);
                modal.remove();
            });
        });
    }

    // Calculate bonus tokens
    function calculateBonus(usdAmount) {
        if (usdAmount >= 5000) return Math.floor(usdAmount / presaleState.currentPrice * 0.20);
        if (usdAmount >= 1000) return Math.floor(usdAmount / presaleState.currentPrice * 0.15);
        if (usdAmount >= 500) return Math.floor(usdAmount / presaleState.currentPrice * 0.10);
        if (usdAmount >= 100) return Math.floor(usdAmount / presaleState.currentPrice * 0.05);
        return 0;
    }

    // Process purchase (simulation)
    async function processPurchase(ethAmount, tokens, totalTokens) {
        const progressModal = showProgressModal();
        
        try {
            // Simulate blockchain transaction
            progressModal.updateStatus('Initiating transaction...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            progressModal.updateStatus('Waiting for confirmation...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            progressModal.updateStatus('Processing purchase...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update presale state
            presaleState.tokensRaised += tokens;
            presaleState.progressPercentage = Math.min((presaleState.tokensRaised / presaleState.totalSupply) * 100, 100);
            
            progressModal.updateStatus('Purchase successful!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            progressModal.close();
            
            // Show success modal
            showPurchaseSuccess(ethAmount, totalTokens);
            
            // Update displays
            updateProgressDisplay();
            
            // Trigger celebration animation
            if (window.BlueWaveAnimations) {
                window.BlueWaveAnimations.triggerProgressCelebration(
                    document.querySelector('.progress-section')
                );
            }
            
        } catch (error) {
            console.error('Purchase error:', error);
            progressModal.updateStatus('Transaction failed');
            await new Promise(resolve => setTimeout(resolve, 1000));
            progressModal.close();
            showPurchaseError('Transaction failed. Please try again.');
        }
    }

    // Show progress modal
    function showProgressModal() {
        const modal = document.createElement('div');
        modal.className = 'progress-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="progress-content">
                        <div class="progress-spinner">🌊</div>
                        <div class="progress-status">Initiating purchase...</div>
                        <div class="progress-note">Please don't close this window</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .progress-modal .modal-content {
                max-width: 400px;
                text-align: center;
            }
            
            .progress-content {
                padding: 40px 20px;
            }
            
            .progress-spinner {
                font-size: 48px;
                animation: wave 2s ease-in-out infinite;
                margin-bottom: 20px;
            }
            
            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-10deg); }
                75% { transform: rotate(10deg); }
            }
            
            .progress-status {
                font-size: 18px;
                font-weight: 500;
                color: var(--democratic-blue, #003366);
                margin-bottom: 10px;
            }
            
            .progress-note {
                font-size: 14px;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        return {
            updateStatus: (status) => {
                modal.querySelector('.progress-status').textContent = status;
            },
            close: () => modal.remove()
        };
    }

    // Show purchase success
    function showPurchaseSuccess(ethAmount, tokens) {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="success-content">
                        <div class="success-icon">🎉</div>
                        <h3>Purchase Successful!</h3>
                        <div class="success-details">
                            <p>You've successfully joined the Blue Wave movement!</p>
                            <div class="success-amount">
                                <strong>${tokens.toLocaleString()} $BLUEWAVE</strong>
                            </div>
                            <p>Paid: ${ethAmount} ETH</p>
                        </div>
                        <div class="success-actions">
                            <button class="btn btn-primary" onclick="this.closest('.success-modal').remove()">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 5000);
    }

    // Show purchase error
    function showPurchaseError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
            </div>
        `;
        
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

    // Initialize countdown timer
    function initCountdownTimer() {
        const timerElements = document.querySelectorAll('.countdown-timer, .presale-timer');
        
        if (timerElements.length === 0) return;
        
        function updateTimer() {
            const now = new Date().getTime();
            const timeLeft = presaleState.endTime - now;
            
            if (timeLeft <= 0) {
                timerElements.forEach(element => {
                    element.innerHTML = '<span class="timer-ended">Presale Ended</span>';
                });
                presaleState.isActive = false;
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timerHTML = `
                <div class="timer-segment">
                    <span class="timer-value">${days}</span>
                    <span class="timer-label">Days</span>
                </div>
                <div class="timer-segment">
                    <span class="timer-value">${hours}</span>
                    <span class="timer-label">Hours</span>
                </div>
                <div class="timer-segment">
                    <span class="timer-value">${minutes}</span>
                    <span class="timer-label">Minutes</span>
                </div>
                <div class="timer-segment">
                    <span class="timer-value">${seconds}</span>
                    <span class="timer-label">Seconds</span>
                </div>
            `;
            
            timerElements.forEach(element => {
                element.innerHTML = timerHTML;
            });
        }
        
        // Update immediately and then every second
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Update progress display
    function updateProgressDisplay() {
        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.style.width = presaleState.progressPercentage + '%';
        });
        
        // Update raised amount
        const raisedElements = document.querySelectorAll('.raised-amount, .tokens-raised');
        raisedElements.forEach(element => {
            if (window.BlueWaveAnimations) {
                window.BlueWaveAnimations.animateNumber(element, presaleState.tokensRaised, {
                    formatCurrency: element.textContent.includes('$')
                });
            } else {
                element.textContent = presaleState.tokensRaised.toLocaleString();
            }
        });
        
        // Update percentage display
        const percentageElements = document.querySelectorAll('.progress-percentage');
        percentageElements.forEach(element => {
            element.textContent = presaleState.progressPercentage.toFixed(1) + '%';
        });
    }

    // Start real-time updates
    function startRealTimeUpdates() {
        // Simulate real-time presale updates
        setInterval(() => {
            // Small random increases to simulate other purchases
            const randomIncrease = Math.random() * 1000;
            presaleState.tokensRaised += randomIncrease;
            presaleState.progressPercentage = Math.min((presaleState.tokensRaised / presaleState.totalSupply) * 100, 100);
            
            updateProgressDisplay();
        }, 30000); // Update every 30 seconds
    }

    // Update purchase preview
    function updatePurchasePreview(tokens, usdAmount, ethAmount) {
        const previewElements = document.querySelectorAll('.purchase-preview');
        
        previewElements.forEach(element => {
            if (tokens > 0) {
                element.innerHTML = `
                    <div class="preview-summary">
                        <div class="preview-row">
                            <span>ETH Amount:</span>
                            <span>${ethAmount} ETH</span>
                        </div>
                        <div class="preview-row">
                            <span>USD Value:</span>
                            <span>$${usdAmount.toFixed(2)}</span>
                        </div>
                        <div class="preview-row highlight">
                            <span>$BLUEWAVE Tokens:</span>
                            <span>${tokens.toLocaleString()}</span>
                        </div>
                    </div>
                `;
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPresaleSystem);
    } else {
        initPresaleSystem();
    }

    // Export presale functions
    window.BlueWavePresale = {
        getState: () => presaleState,
        updateProgress: updateProgressDisplay,
        calculateTokens: calculateTokens
    };

})();
