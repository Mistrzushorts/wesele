/* ===============================================
   WESELE - Gaming Theme Website
   JavaScript Functionality
   =============================================== */

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initSmoothScroll();
});

/* ============= MOBILE MENU TOGGLE ============= */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/* ============= SMOOTH SCROLL FUNCTION ============= */
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* ============= SMOOTH SCROLL ANCHORS ============= */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            smoothScroll(targetId);
        });
    });
}

/* ============= SCROLL EFFECTS ============= */
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow to navbar on scroll
        if (currentScroll > 0) {
            navbar.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.2)';
        } else {
            navbar.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.1)';
        }

        // Fade in cards on scroll (Intersection Observer)
        observeCards();

        lastScroll = currentScroll;
    });
}

/* ============= INTERSECTION OBSERVER FOR FADE IN ============= */
function observeCards() {
    const cards = document.querySelectorAll('.content-card, .tile');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

/* ============= ENHANCE TILE INTERACTION ============= */
document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            tile.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'translateY(0) scale(1)';
        });
    });
});

/* ============= LAZY LOADING FOR IMAGES (if any) ============= */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/* ============= ADAPTIVE NAVBAR ============= */
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-section');
                link.style.borderBottom = '2px solid var(--accent-cyan)';
            } else {
                link.style.borderBottom = 'none';
            }
        });
    });
});

/* ============= UTILITY: ADD CSS ANIMATIONS ============= */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .active-section {
        color: var(--accent-cyan) !important;
    }
`;
document.head.appendChild(style);

/* ============= KEYBOARD NAVIGATION ============= */
document.addEventListener('keydown', (e) => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentIndex = sections.findIndex(section => {
        return section.getBoundingClientRect().top < window.innerHeight / 2;
    });

    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault();
        smoothScroll(sections[currentIndex + 1].id);
    }
    
    if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        smoothScroll(sections[currentIndex - 1].id);
    }
});

/* ============= PERFORMANCE: DEBOUNCE SCROLL ============= */
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

/* ============= ENHANCED SCROLL EFFECT ============= */
const debouncedScroll = debounce(() => {
    initScrollEffects();
}, 250);

window.addEventListener('scroll', debouncedScroll);

/* ============= TABLE OF CONTENTS GENERATOR (Optional) ============= */
function generateTableOfContents() {
    const toc = [];
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const title = section.querySelector('h2');
        if (title) {
            toc.push({
                id: section.id,
                title: title.textContent,
                level: 2
            });
        }
    });
    
    return toc;
}

/* ============= INITIALIZE ON LOAD ============= */
window.addEventListener('load', () => {
    // Fade in sections as they come into view
    observeCards();
    
    // Additional performance enhancements
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
});

/* ============= SCROLL TO TOP BUTTON ============= */
function initScrollToTop() {
    let scrollBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '⬆';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00d9ff, #d946ef);
            color: #0a0e27;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            display: none;
            z-index: 999;
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 217, 255, 0.3);
        `;
        document.body.appendChild(scrollBtn);
    }
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.alignItems = 'center';
            scrollBtn.style.justifyContent = 'center';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', initScrollToTop);

/* ============= PRINT STYLES ============= */
const printStyle = document.createElement('style');
printStyle.media = 'print';
printStyle.textContent = `
    .navbar, .hero-btn, .scroll-to-top { display: none; }
    body { background: white; color: black; }
    .content-card { border-color: #999; background: white; }
`;
document.head.appendChild(printStyle);

/* ============= ACCESSIBILITY: FOCUS STYLES ============= */
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    button:focus,
    a:focus,
    input:focus {
        outline: 2px solid #00d9ff;
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);

console.log('🎭 Wesele Gaming Website Loaded Successfully');
