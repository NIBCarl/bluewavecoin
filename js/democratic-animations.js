// Democratic Animations for Blue Wave Coin Website
// Traditional script (non-module) for broader compatibility

(function() {
    'use strict';
    
    // Animation configuration
    const animationConfig = {
        // Performance detection
        isLowEndDevice: navigator.hardwareConcurrency < 4,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        
        // Default animation settings
        defaults: {
            duration: 600,
            easing: 'ease-out',
            stagger: 0.1
        },
        
        // Get optimized settings based on device capabilities
        getOptimalSettings() {
            return {
                duration: this.isLowEndDevice ? 300 : this.defaults.duration,
                easing: this.isLowEndDevice ? 'linear' : this.defaults.easing,
                stagger: this.isLowEndDevice ? 0.05 : this.defaults.stagger
            };
        }
    };

    // Initialize scroll animations (using basic intersection observer)
    function initScrollAnimations() {
        if (animationConfig.reducedMotion) {
            console.log('Scroll animations disabled due to user preference');
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Apply animation classes
                    element.classList.add('animate__animated');
                    
                    // Add delay if specified
                    const delay = element.getAttribute('data-wow-delay');
                    if (delay) {
                        element.style.animationDelay = delay;
                    }
                    
                    console.log('Democratic animation triggered:', element.className);
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });

        console.log('Democratic scroll animations initialized');
    }

    // Democratic pulse animation
    function addDemocraticPulse(element) {
        if (!element || animationConfig.reducedMotion) return;
        element.classList.add('democratic-pulse');
    }

    // Unity wave animation
    function triggerUnityWave(element) {
        if (!element || animationConfig.reducedMotion) return;
        
        element.classList.add('unity-wave');
        setTimeout(() => {
            element.classList.remove('unity-wave');
        }, 2000);
    }

    // Progress celebration animation
    function triggerProgressCelebration(element) {
        if (!element || animationConfig.reducedMotion) return;
        
        element.classList.add('progress-celebration');
        setTimeout(() => {
            element.classList.remove('progress-celebration');
        }, 1000);
    }

    // Animate number counters
    function animateNumber(element, targetValue, options = {}) {
        if (!element || animationConfig.reducedMotion) {
            element.textContent = targetValue.toLocaleString();
            return;
        }
        
        const { duration = 2000, formatCurrency = false } = options;
        const startValue = 0;
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
            
            if (formatCurrency) {
                element.textContent = '$' + currentValue.toLocaleString();
            } else {
                element.textContent = currentValue.toLocaleString() + (targetValue >= 1000 ? '+' : '');
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    // Card hover effects
    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.political-card, .team-card, .quote-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!animationConfig.reducedMotion) {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // Button interaction feedback
    function addButtonEffects() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (animationConfig.reducedMotion) return;
                
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
    }

    // FAQ accordion animations
    function initFAQAnimations() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Close all other FAQs
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                    const icon = q.querySelector('i');
                    if (icon) icon.style.transform = '';
                });
                
                document.querySelectorAll('.faq-answer').forEach(a => {
                    a.classList.remove('active');
                    a.style.maxHeight = '0';
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    this.classList.add('active');
                    const icon = this.querySelector('i');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    
                    if (answer) {
                        answer.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                }
            });
        });
    }

    // Navigation animations
    function initNavigationAnimations() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (!animationConfig.reducedMotion) {
                    this.style.transform = 'translateY(-2px)';
                    this.style.transition = 'all 0.3s ease';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // Progress bar animations
    function animateProgressBar(progressElement, targetPercentage) {
        if (!progressElement || animationConfig.reducedMotion) {
            progressElement.style.width = targetPercentage + '%';
            return;
        }
        
        let currentPercentage = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        function updateProgress(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easedProgress = 1 - Math.pow(1 - progress, 2);
            currentPercentage = targetPercentage * easedProgress;
            
            progressElement.style.width = currentPercentage + '%';
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            } else {
                // Trigger celebration if at high percentage
                if (targetPercentage >= 60) {
                    const progressSection = progressElement.closest('.progress-section, .presale-widget');
                    if (progressSection) {
                        triggerProgressCelebration(progressSection);
                    }
                }
            }
        }
        
        requestAnimationFrame(updateProgress);
    }

    // Accessibility controls
    function addAccessibilityControls() {
        // Only respect system preferences, no manual toggle button
        // This ensures a cleaner user experience while maintaining accessibility
        console.log('Accessibility: Animations respect prefers-reduced-motion setting');
    }

    // Initialize all animations
    function initAllAnimations() {
        console.log('Initializing Blue Wave Democratic animations...');
        
        // Core animation systems
        initScrollAnimations();
        initNavigationAnimations();
        initFAQAnimations();
        
        // Interactive effects
        addCardHoverEffects();
        addButtonEffects();
        
        // Accessibility
        addAccessibilityControls();
        
        // Animate hero statistics with delay
        setTimeout(() => {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach((stat, index) => {
                setTimeout(() => {
                    const textContent = stat.textContent.replace(/[^0-9]/g, '');
                    if (textContent) {
                        const value = parseInt(textContent);
                        animateNumber(stat, value, {
                            formatCurrency: stat.textContent.includes('$')
                        });
                    }
                }, index * 500);
            });
        }, 1000);
        
        // Animate progress bars
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const widthStyle = bar.style.width || bar.getAttribute('style');
                const percentage = widthStyle ? parseInt(widthStyle.match(/\d+/)?.[0]) || 68 : 68;
                animateProgressBar(bar, percentage);
            });
        }, 1500);
        
        // Add democratic effects to key elements
        setTimeout(() => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                triggerUnityWave(heroSection);
            }
        }, 2000);
        
        console.log('Democratic animations initialized successfully!');
    }

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initAllAnimations, 100);
        });
    } else {
        setTimeout(initAllAnimations, 100);
    }

    // Export functions to global scope for external access
    window.BlueWaveAnimations = {
        animateNumber,
        triggerUnityWave,
        triggerProgressCelebration,
        addDemocraticPulse,
        animationConfig
    };

})();
