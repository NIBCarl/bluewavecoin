// Blue Wave Coin - Enhanced Navigation System
// Smooth scrolling, active link highlighting, and mobile menu functionality

(function() {
    'use strict';

    // Navigation state
    let navigationState = {
        currentSection: 'hero',
        isScrolling: false,
        isMobileMenuOpen: false,
        scrollOffset: 80 // Header height offset
    };

    // Initialize navigation system
    function initNavigationSystem() {
        console.log('🌊 Initializing Blue Wave navigation system...');
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize scroll spy
        initScrollSpy();
        
        // Initialize language switcher
        initLanguageSwitcher();
        
        // Fix any broken navigation links
        fixNavigationLinks();
        
        console.log('✅ Blue Wave navigation system ready!');
    }

    // Initialize smooth scrolling for navigation links
    function initSmoothScrolling() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    smoothScrollToElement(targetElement);
                    
                    // Close mobile menu if open
                    if (navigationState.isMobileMenuOpen) {
                        closeMobileMenu();
                    }
                    
                    // Update active link
                    updateActiveNavLink(targetId);
                }
            });
        });
        
        // Handle hero button scrolling
        const heroButtons = document.querySelectorAll('.hero-actions .btn');
        heroButtons.forEach(button => {
            if (button.textContent.includes('Read Whitepaper')) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    // In a real implementation, this would open the whitepaper
                    showWhitepaperModal();
                });
            }
        });
    }

    // Smooth scroll to element
    function smoothScrollToElement(element) {
        if (navigationState.isScrolling) return;
        
        navigationState.isScrolling = true;
        
        const targetPosition = element.offsetTop - navigationState.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // 800ms for smooth scroll
        
        let startTime = null;
        
        function scrollAnimation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            } else {
                navigationState.isScrolling = false;
            }
        }
        
        requestAnimationFrame(scrollAnimation);
    }

    // Easing function for smooth animation
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Initialize mobile menu
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navigationState.isMobileMenuOpen && 
                !e.target.closest('.mobile-nav') && 
                !e.target.closest('#hamburger')) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navigationState.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navigationState.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (navigationState.isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        navigationState.isMobileMenuOpen = true;
        
        if (hamburger) {
            hamburger.classList.add('active');
        }
        
        if (mobileNav) {
            mobileNav.classList.add('active');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close mobile menu
    function closeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        navigationState.isMobileMenuOpen = false;
        
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        
        if (mobileNav) {
            mobileNav.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Initialize scroll spy
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;
        
        const observerOptions = {
            root: null,
            rootMargin: `-${navigationState.scrollOffset}px 0px -50% 0px`,
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navigationState.currentSection = sectionId;
                    updateActiveNavLink(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Update active navigation link
    function updateActiveNavLink(sectionId) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const currentLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (currentLink && currentLink.classList.contains('nav-link')) {
            currentLink.classList.add('active');
        }
    }

    // Initialize language switcher
    function initLanguageSwitcher() {
        const languageSelect = document.getElementById('language-select');
        
        if (languageSelect) {
            languageSelect.addEventListener('change', function() {
                const selectedLanguage = this.value;
                changeLanguage(selectedLanguage);
            });
        }
    }

    // Change language (basic implementation)
    function changeLanguage(language) {
        console.log(`🌍 Changing language to: ${language}`);
        
        // Store language preference
        localStorage.setItem('bluewave-language', language);
        
        // In a full implementation, this would load different content
        // For now, just show a notification
        showLanguageChangeNotification(language);
    }

    // Show language change notification
    function showLanguageChangeNotification(language) {
        const languageNames = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch'
        };
        
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = `Language changed to ${languageNames[language] || language}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--democratic-blue, #003366);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Fix navigation links
    function fixNavigationLinks() {
        // Ensure all internal links work properly
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) {
                console.warn(`Navigation target not found: ${targetId}`);
                // Disable broken link
                link.style.opacity = '0.5';
                link.style.pointerEvents = 'none';
            }
        });
        
        // Add missing navigation functionality to buttons
        const learnMoreButtons = document.querySelectorAll('.btn-learn-more');
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    smoothScrollToElement(aboutSection);
                }
            });
        });
    }

    // Show whitepaper modal
    function showWhitepaperModal() {
        const modal = document.createElement('div');
        modal.className = 'whitepaper-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>📄 Blue Wave Coin Whitepaper</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="whitepaper-info">
                            <p>The Blue Wave Coin whitepaper outlines our vision for a Democratic cryptocurrency that:</p>
                            <ul>
                                <li>🇺🇸 Supports Democratic values and candidates</li>
                                <li>🌊 Creates sustainable funding for progressive causes</li>
                                <li>💰 Maintains 0% founder allocation</li>
                                <li>🔒 Ensures complete transparency and security</li>
                                <li>🌍 Promotes environmental sustainability</li>
                            </ul>
                            <div class="whitepaper-actions">
                                <button class="btn btn-primary" onclick="window.open('#whitepaper-pdf', '_blank')">
                                    📄 Download PDF
                                </button>
                                <button class="btn btn-secondary" onclick="window.open('#whitepaper-web', '_blank')">
                                    🌐 Read Online
                                </button>
                            </div>
                            <p class="whitepaper-note">
                                <small>Note: Full whitepaper will be available before public launch</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .whitepaper-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                font-family: var(--font-body, 'Lato', sans-serif);
            }
            
            .whitepaper-modal .modal-overlay {
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .whitepaper-modal .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 51, 102, 0.3);
            }
            
            .whitepaper-modal .modal-header {
                padding: 20px 20px 10px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .whitepaper-modal .modal-header h3 {
                margin: 0;
                color: var(--democratic-blue, #003366);
            }
            
            .whitepaper-modal .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            }
            
            .whitepaper-modal .modal-body {
                padding: 20px;
            }
            
            .whitepaper-info ul {
                margin: 15px 0;
                padding-left: 20px;
            }
            
            .whitepaper-info li {
                margin-bottom: 8px;
            }
            
            .whitepaper-actions {
                margin: 20px 0;
                display: flex;
                gap: 10px;
            }
            
            .whitepaper-actions .btn {
                flex: 1;
            }
            
            .whitepaper-note {
                text-align: center;
                color: #6b7280;
                margin-top: 15px;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) modal.remove();
        });
    }

    // Load saved language preference
    function loadLanguagePreference() {
        const savedLanguage = localStorage.getItem('bluewave-language');
        if (savedLanguage) {
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = savedLanguage;
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initNavigationSystem();
            loadLanguagePreference();
        });
    } else {
        initNavigationSystem();
        loadLanguagePreference();
    }

    // Export navigation functions
    window.BlueWaveNavigation = {
        scrollToSection: (sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                smoothScrollToElement(element);
            }
        },
        getCurrentSection: () => navigationState.currentSection,
        closeMobileMenu: closeMobileMenu
    };

})();
