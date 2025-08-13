// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
        document.querySelectorAll('.faq-answer').forEach(a => {
            a.classList.remove('active');
            a.style.maxHeight = '0';
        });
        
        // Toggle current FAQ
        if (!isActive) {
            question.classList.add('active');
            answer.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Presale functionality
const presaleAmount = document.getElementById('presale-amount');
const presaleOutput = document.getElementById('presale-output');
const presaleButton = document.getElementById('presale-button');

if (presaleAmount && presaleOutput) {
    presaleAmount.addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value) || 0;
        const rate = 0.0001; // Example rate: 1 BNB = 10,000 BWC
        const bwcAmount = amount * 10000;
        presaleOutput.textContent = `${bwcAmount.toLocaleString()} BWC`;
    });
}

// Wallet connection simulation
const connectWalletBtn = document.querySelectorAll('.btn-primary');

connectWalletBtn.forEach(btn => {
    if (btn.textContent.includes('Connect Wallet') || btn.textContent.includes('Buy Now')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Simulate wallet connection
            btn.textContent = 'Connecting...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Wallet Connected';
                btn.style.background = 'var(--accent-green)';
                
                // Show success message
                showNotification('Wallet connected successfully!', 'success');
            }, 2000);
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: var(--accent-green);' : ''}
        ${type === 'error' ? 'background: #ff4757;' : ''}
        ${type === 'info' ? 'background: var(--primary-blue);' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form validation for presale
const presaleForm = document.querySelector('.presale-form');
if (presaleForm) {
    presaleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = presaleAmount.value;
        if (!amount || amount <= 0) {
            showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        // Simulate transaction
        showNotification('Processing your purchase...', 'info');
        
        setTimeout(() => {
            showNotification('Purchase successful! Welcome to Blue Wave Coin!', 'success');
            presaleForm.reset();
            if (presaleOutput) presaleOutput.textContent = '0 BWC';
        }, 3000);
    });
}

// Dynamic progress bar animation
const progressBar = document.querySelector('.progress-fill');
if (progressBar) {
    const targetWidth = 42; // 42% as per content
    let currentWidth = 0;
    
    const animateProgress = () => {
        if (currentWidth < targetWidth) {
            currentWidth += 1;
            progressBar.style.width = currentWidth + '%';
            setTimeout(animateProgress, 20);
        }
    };
    
    // Start animation when progress bar is visible
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress();
                progressObserver.unobserve(entry.target);
            }
        });
    });
    
    progressObserver.observe(progressBar);
}

// Countdown timer for presale
function updateCountdown() {
    const presaleEnd = new Date('2024-12-31T23:59:59');
    const now = new Date();
    const diff = presaleEnd - now;
    
    if (diff <= 0) {
        document.getElementById('countdown').textContent = 'Presale Ended';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.textContent = `${days}d ${hours}h ${minutes}m left`;
    }
}

// Update countdown every minute
setInterval(updateCountdown, 60000);
updateCountdown();

// Social media sharing
const socialButtons = document.querySelectorAll('.social-link');
socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.textContent.toLowerCase();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out Blue Wave Coin - The Democrat-backed crypto making waves! 🌊');
        
        let shareUrl;
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                break;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    });
});

// Lazy loading for images (when you add actual images)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Performance optimization: Debounced scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(updateActiveNav, 100);
window.addEventListener('scroll', debouncedScroll);

// Initialize tooltips (if using any)
function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = trigger.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--dark-gray);
                color: var(--white);
                padding: 0.5rem 1rem;
                border-radius: 5px;
                font-size: 0.9rem;
                z-index: 1000;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = trigger.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        trigger.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();
    updateActiveNav();
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
});

// Error handling for external resources
window.addEventListener('error', (e) => {
    console.warn('Resource loading error:', e.filename, e.message);
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}
