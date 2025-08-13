// Animation utilities for Blue Wave Coin website
import autoAnimate from '@formkit/auto-animate';
import { WOW } from 'wow.js';

// Animation configuration
const animationConfig = {
  // Performance detection
  isLowEndDevice: navigator.hardwareConcurrency < 4 || navigator.connection?.effectiveType === 'slow-2g',
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

// Initialize WOW.js for scroll animations
export function initScrollAnimations() {
  if (animationConfig.reducedMotion) {
    console.log('Animations disabled due to user preference');
    return;
  }

  const wow = new WOW({
    boxClass: 'animate-on-scroll',
    animateClass: 'animate__animated',
    offset: 100,
    mobile: !animationConfig.isLowEndDevice,
    live: true,
    callback: function(box) {
      // Track animation events for analytics
      console.log('Democratic animation triggered:', box.className);
    }
  });
  
  wow.init();
  console.log('Democratic scroll animations initialized');
}

// AutoAnimate helper for political messaging
export function animateContainer(element, options = {}) {
  if (!element || animationConfig.reducedMotion) return null;
  
  const settings = {
    ...animationConfig.getOptimalSettings(),
    ...options
  };
  
  return autoAnimate(element, settings);
}

// Democratic pulse animation
export function addDemocraticPulse(element) {
  if (!element || animationConfig.reducedMotion) return;
  
  element.classList.add('democratic-pulse');
}

// Unity wave animation
export function triggerUnityWave(element) {
  if (!element || animationConfig.reducedMotion) return;
  
  element.classList.add('unity-wave');
  setTimeout(() => {
    element.classList.remove('unity-wave');
  }, 2000);
}

// Progress celebration animation
export function triggerProgressCelebration(element) {
  if (!element || animationConfig.reducedMotion) return;
  
  element.classList.add('progress-celebration');
  setTimeout(() => {
    element.classList.remove('progress-celebration');
  }, 1000);
}

// Animate number counters
export function animateNumber(element, targetValue, options = {}) {
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
      element.textContent = currentValue.toLocaleString();
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Stagger animation for multiple elements
export function staggerAnimate(elements, className, delay = 100) {
  if (!elements || animationConfig.reducedMotion) return;
  
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(className);
    }, index * delay);
  });
}

// Card hover effects
export function addCardHoverEffects() {
  const cards = document.querySelectorAll('.political-card, .team-card, .quote-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!animationConfig.reducedMotion) {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

// Button interaction feedback
export function addButtonEffects() {
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
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// FAQ accordion animations
export function initFAQAnimations() {
  const faqContainer = document.querySelector('.faq-list');
  if (faqContainer) {
    animateContainer(faqContainer);
  }
  
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
        q.querySelector('i').style.transform = '';
      });
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.classList.remove('active');
        a.style.maxHeight = '0';
      });
      
      // Toggle current FAQ
      if (!isActive) {
        this.classList.add('active');
        this.querySelector('i').style.transform = 'rotate(180deg)';
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// Navigation animations
export function initNavigationAnimations() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      if (!animationConfig.reducedMotion) {
        this.style.transform = 'translateY(-2px)';
      }
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Add democratic pulse to CTA button
  const ctaButton = document.querySelector('.nav-cta');
  if (ctaButton) {
    addDemocraticPulse(ctaButton);
  }
}

// Progress bar animations
export function animateProgressBar(progressElement, targetPercentage) {
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
      // Trigger celebration if at 100%
      if (targetPercentage >= 100) {
        triggerProgressCelebration(progressElement.closest('.progress-section'));
      }
    }
  }
  
  requestAnimationFrame(updateProgress);
}

// Accessibility controls
export function addAccessibilityControls() {
  // Create animation toggle button
  const toggleButton = document.createElement('button');
  toggleButton.textContent = animationConfig.reducedMotion ? 'Enable Animations' : 'Disable Animations';
  toggleButton.className = 'animation-toggle';
  toggleButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 10px 15px;
    background: var(--democratic-blue);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    display: none;
  `;
  
  // Show button only if user has not set a preference
  if (!window.matchMedia('(prefers-reduced-motion)').matches) {
    toggleButton.style.display = 'block';
  }
  
  toggleButton.addEventListener('click', function() {
    animationConfig.reducedMotion = !animationConfig.reducedMotion;
    this.textContent = animationConfig.reducedMotion ? 'Enable Animations' : 'Disable Animations';
    
    // Toggle CSS class on body
    document.body.classList.toggle('reduce-animations', animationConfig.reducedMotion);
    
    // Reinitialize animations
    if (!animationConfig.reducedMotion) {
      initScrollAnimations();
    }
  });
  
  document.body.appendChild(toggleButton);
}

// Initialize all animations
export function initAllAnimations() {
  console.log('Initializing Blue Wave Democratic animations...');
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initAnimations, 100);
    });
  } else {
    setTimeout(initAnimations, 100);
  }
}

function initAnimations() {
  // Core animation systems
  initScrollAnimations();
  initNavigationAnimations();
  initFAQAnimations();
  
  // Interactive effects
  addCardHoverEffects();
  addButtonEffects();
  
  // Accessibility
  addAccessibilityControls();
  
  // Animate hero statistics
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach((stat, index) => {
    setTimeout(() => {
      const value = stat.textContent.replace(/[^0-9]/g, '');
      if (value) {
        animateNumber(stat, parseInt(value), {
          formatCurrency: stat.textContent.includes('$')
        });
      }
    }, index * 500);
  });
  
  // Animate progress bars
  const progressBars = document.querySelectorAll('.progress-fill');
  progressBars.forEach(bar => {
    const percentage = parseInt(bar.style.width) || 68;
    setTimeout(() => {
      animateProgressBar(bar, percentage);
    }, 1000);
  });
  
  // Add democratic effects to key elements
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    triggerUnityWave(heroSection);
  }
  
  console.log('Democratic animations initialized successfully!');
}

// Export configuration for external use
export { animationConfig };
