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
    
    // Force right positioning function - runs aggressively
    const forceRightPosition = () => {
        if (window.innerWidth < 1400) { // Only on mobile
            // Use requestAnimationFrame to ensure it runs after Bootstrap's positioning
            requestAnimationFrame(() => {
                offcanvasElement.style.setProperty('right', '0', 'important');
                offcanvasElement.style.setProperty('left', 'auto', 'important');
                offcanvasElement.style.setProperty('margin-left', '0', 'important');
                offcanvasElement.style.setProperty('padding-left', '0', 'important');
                
                // Also check computed style and force if needed
                const computedLeft = window.getComputedStyle(offcanvasElement).left;
                if (computedLeft !== 'auto' && computedLeft !== '0px') {
                    // Force via transform if needed
                    const currentTransform = window.getComputedStyle(offcanvasElement).transform;
                    if (currentTransform === 'none' || !currentTransform.includes('translateX(0)')) {
                        offcanvasElement.style.setProperty('transform', 'translateX(0)', 'important');
                    }
                }
            });
        }
    };
    
    // Get the Bootstrap offcanvas instance
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
    
    // Close offcanvas when a nav link is clicked
    const navLinks = offcanvasElement.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            offcanvas.hide();
        });
    });
    
    // Prevent body overflow when offcanvas is open
    offcanvasElement.addEventListener('show.bs.offcanvas', () => {
        document.body.classList.add('offcanvas-open');
        forceRightPosition();
        // Also force after a small delay to override Bootstrap
        setTimeout(forceRightPosition, 10);
        setTimeout(forceRightPosition, 50);
    });
    
    offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
        document.body.classList.remove('offcanvas-open');
    });
    
    // Also handle when offcanvas is fully shown/hidden
    offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
        document.body.classList.add('offcanvas-open');
        forceRightPosition();
        // Force multiple times to ensure it sticks
        setTimeout(forceRightPosition, 10);
        setTimeout(forceRightPosition, 50);
        setTimeout(forceRightPosition, 100);
    });
    
    offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
        document.body.classList.remove('offcanvas-open');
    });
    
    // Use MutationObserver to watch for style changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                forceRightPosition();
            }
        });
    });
    
    observer.observe(offcanvasElement, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    
    // Force position on load
    forceRightPosition();
    
    // Also force on window resize
    window.addEventListener('resize', forceRightPosition);
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
