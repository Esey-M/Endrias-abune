// Utility functions for UI enhancements
// Updated for Bootstrap 5 compatibility

// Active page indicator
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active', 'nav-active');
        } else {
            link.classList.remove('active', 'nav-active');
        }
    });
}

// Scroll to top button functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.innerHTML = `
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Listen to scroll events
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton(); // Initial check
}

// Initialize Bootstrap offcanvas close on link click
function initOffcanvasNavigation() {
    const offcanvasElement = document.getElementById('navbarOffcanvas');
    if (!offcanvasElement) return;
    
    // Get the Bootstrap offcanvas instance
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    
    // Close offcanvas when a nav link is clicked
    const navLinks = offcanvasElement.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            offcanvas.hide();
        });
    });
}

// Sync language button states between desktop and mobile
function syncLanguageButtons() {
    const currentLang = localStorage.getItem('language') || 'nl';
    
    // Get all language buttons
    const tiButtons = document.querySelectorAll('[id^="lang-ti"]');
    const nlButtons = document.querySelectorAll('[id^="lang-nl"]');
    
    tiButtons.forEach(btn => {
        if (currentLang === 'ti') {
            btn.classList.remove('lang-btn-inactive');
            btn.classList.add('lang-btn-active');
        } else {
            btn.classList.remove('lang-btn-active');
            btn.classList.add('lang-btn-inactive');
        }
    });
    
    nlButtons.forEach(btn => {
        if (currentLang === 'nl') {
            btn.classList.remove('lang-btn-inactive');
            btn.classList.add('lang-btn-active');
        } else {
            btn.classList.remove('lang-btn-active');
            btn.classList.add('lang-btn-inactive');
        }
    });
}

// Initialize all utilities when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    initScrollToTop();
    initOffcanvasNavigation();
    syncLanguageButtons();
});

// Re-sync language buttons when language changes
// This hooks into the language.js setLanguage function
const originalSetLanguageUtil = window.setLanguage;
if (originalSetLanguageUtil) {
    window.setLanguage = function(lang) {
        originalSetLanguageUtil(lang);
        syncLanguageButtons();
    };
}
