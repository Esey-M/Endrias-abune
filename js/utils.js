// Utility functions for UI enhancements

// Active page indicator
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('nav-active');
        } else {
            link.classList.remove('nav-active');
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
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Enhanced mobile menu with animation and backdrop
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!menuBtn || !navMenu) return;
    
    // Create backdrop overlay
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.id = 'mobile-menu-backdrop';
    body.appendChild(backdrop);
    
    function openMenu() {
        navMenu.classList.remove('hidden');
        navMenu.classList.add('flex', 'flex-col', 'gap-4', 'mobile-menu-open');
        
        // Add close button if it doesn't exist
        if (!navMenu.querySelector('.mobile-menu-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-menu-close';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Close menu');
            closeBtn.addEventListener('click', closeMenu);
            navMenu.insertBefore(closeBtn, navMenu.firstChild);
        }
        
        backdrop.classList.add('show');
        body.style.overflow = 'hidden';
        menuBtn.setAttribute('aria-expanded', 'true');
    }
    
    function closeMenu() {
        // Add closing animation
        navMenu.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            navMenu.classList.add('hidden');
            navMenu.classList.remove('mobile-menu-open');
            navMenu.style.animation = '';
            backdrop.classList.remove('show');
            body.style.overflow = '';
            menuBtn.setAttribute('aria-expanded', 'false');
        }, 300);
    }
    
    // Toggle menu on button click
    menuBtn.addEventListener('click', () => {
        if (navMenu.classList.contains('hidden')) {
            openMenu();
        } else {
            closeMenu();
        }
    });
    
    // Close menu when clicking backdrop
    backdrop.addEventListener('click', closeMenu);
    
    // Close menu when clicking a nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 100); // Small delay for smooth transition
        });
    });
    
    // Close menu on window resize (if resizing to xl screens - 1280px+)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1280) {
            closeMenu();
        }
    });
}

// Initialize all utilities when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    initScrollToTop();
    initMobileMenu();
});

