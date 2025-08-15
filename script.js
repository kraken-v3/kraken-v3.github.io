// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeReviewSlider();
    initializePricingToggle();
    initializeSmoothScrolling();
    initializeDemoRequests();
    initializeDiscordTracking();
    initializeAnimations();
});

// Review Slider Functionality
function initializeReviewSlider() {
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.review-prev');
    const nextBtn = document.querySelector('.review-next');
    let currentReview = 0;

    if (reviewCards.length === 0) return;

    function showReview(index) {
        reviewCards.forEach(card => card.classList.remove('active'));
        reviewCards[index].classList.add('active');
    }

    function nextReview() {
        currentReview = (currentReview + 1) % reviewCards.length;
        showReview(currentReview);
    }

    function prevReview() {
        currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;
        showReview(currentReview);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextReview);
    if (prevBtn) prevBtn.addEventListener('click', prevReview);

    // Auto-rotate reviews every 5 seconds
    setInterval(nextReview, 5000);
}

// Pricing Toggle Functionality
function initializePricingToggle() {
    const yearlyToggle = document.getElementById('yearly-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');

    if (!yearlyToggle) return;

    yearlyToggle.addEventListener('change', function() {
        if (this.checked) {
            // Show yearly prices
            monthlyPrices.forEach(price => price.style.display = 'none');
            yearlyPrices.forEach(price => price.style.display = 'inline');
        } else {
            // Show monthly prices
            monthlyPrices.forEach(price => price.style.display = 'inline');
            yearlyPrices.forEach(price => price.style.display = 'none');
        }
    });
}

// Smooth Scrolling for Navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Demo Request Functionality
function initializeDemoRequests() {
    const demoVideos = document.querySelectorAll('.demo-video');

    demoVideos.forEach(video => {
        video.addEventListener('click', function() {
            const demoType = this.parentElement.querySelector('h3').textContent;
            requestDemo(demoType);
        });
    });
}

function requestDemo(demoType) {
    const discordURL = 'https://discord.gg/your-discord-invite';
    const message = `Hi! I'd like to request a live demo of: ${demoType}`;

    // Create a notification
    showNotification(`Redirecting to Discord to request: ${demoType}`, 'info');

    // Open Discord in new tab
    setTimeout(() => {
        window.open(discordURL, '_blank');
    }, 1000);

    // Track demo request
    console.log('Demo requested:', demoType);
}

// Discord Link Tracking
function initializeDiscordTracking() {
    const discordLinks = document.querySelectorAll('a[href*="discord"]');

    discordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.textContent.trim();
            const section = this.closest('section')?.id || 'unknown';

            // Track the click
            console.log('Discord link clicked:', {
                text: linkText,
                section: section,
                timestamp: new Date().toISOString()
            });

            // Show confirmation message
            if (linkText.includes('Join Discord')) {
                showNotification('Opening Discord server...', 'success');
            }
        });
    });
}

// Animation on Scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animatedElements = document.querySelectorAll('.feature-card, .demo-card, .pricing-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6b66c7'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        font-size: 14px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Cart functionality (kept for visual consistency but non-functional)
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = '0';
    }
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Utility function to get Discord invite link
function getDiscordInvite() {
    // You can replace this with your actual Discord invite link
    return 'https://discord.gg/your-discord-invite';
}

// Handle form submissions (redirect to Discord)
function handleFormSubmission(formType) {
    showNotification(`Please join our Discord server to ${formType}`, 'info');
    setTimeout(() => {
        window.open(getDiscordInvite(), '_blank');
    }, 1500);
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);

    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (konamiCode.join('') === konamiSequence.join('')) {
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        // Add special visual effect
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // Here you would integrate with your analytics service
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');

    trackEvent('page_loaded', {
        loadTime: loadTime,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }

    .animated {
        animation: fadeInUp 0.6s ease-out forwards !important;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize cart count on load
updateCartCount();

// Expose functions for global access if needed
window.KrakenV3 = {
    requestDemo,
    showNotification,
    trackEvent,
    getDiscordInvite
};
