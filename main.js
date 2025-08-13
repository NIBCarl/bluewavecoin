// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Language switching functionality
const languageSwitcher = document.getElementById('language-switcher');

if (languageSwitcher) {
    languageSwitcher.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        changeLanguage(selectedLanguage);
    });
}

function changeLanguage(language) {
    // Update i18next language
    if (i18next && i18next.changeLanguage) {
        i18next.changeLanguage(language, (err, t) => {
            if (err) return console.log('something went wrong loading', err);
            
            // Update all elements with data-i18n attribute
            updateTranslations();
        });
    }
}

function updateTranslations() {
    // Get all elements with data-i18n attribute
    const translatableElements = document.querySelectorAll('[data-i18n]');
    
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18next && i18next.t) {
            element.textContent = i18next.t(key);
        }
    });
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update translations when the page loads
    updateTranslations();
});
