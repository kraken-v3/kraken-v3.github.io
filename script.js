// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Payment processing functionality
function processPayment(method) {
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        alert(`Payment method selected: ${method.toUpperCase()}\n\nRedirecting to secure payment gateway...\n\nNote: This is a demo. In production, this would redirect to the actual payment processor.`);

        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

// Download app functionality
function downloadApp() {
    // Show download confirmation with disclaimer
    const confirmed = confirm(
        "Download Kraken V3 for Windows?\n\n" +
        "⚠️ IMPORTANT: This is just the application installer.\n" +
        "You'll need a valid subscription ($5/month) to use the app.\n" +
        "The app will ask for your account credentials on first launch.\n\n" +
        "Click OK to proceed with download."
    );

    if (confirmed) {
        // Show loading state
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
        button.disabled = true;

        // Simulate download preparation
        setTimeout(() => {
            alert(
                "Download Started!\n\n" +
                "📁 File: KrakenV3-Setup.exe\n" +
                "💾 Size: ~45 MB\n\n" +
                "⚠️ Remember: You'll need an active subscription to use the app.\n" +
                "Purchase your subscription below after installation!\n\n" +
                "Note: This is a demo. In production, this would trigger the actual download."
            );

            // In production, trigger actual download:
            // window.location.href = "https://yourdomain.com/downloads/KrakenV3-Setup.exe";

            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

// Discord server join functionality
function joinDiscord() {
    // In a real application, this would be the actual Discord invite link
    const discordInviteLink = "https://discord.gg/krakenv3"; // Replace with actual invite

    // Show confirmation dialog
    if (confirm("Join our Discord community?\n\nYou'll be redirected to Discord to join the Kraken V3 server.")) {
        // In a real app, this would open the Discord invite
        alert("Discord invite link: " + discordInviteLink + "\n\nNote: This is a demo. Replace with your actual Discord server invite link.");

        // Uncomment the line below to actually redirect (replace with real invite link)
        // window.open(discordInviteLink, '_blank');
    }
}

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 35, 0.95)';
    } else {
        header.style.background = 'rgba(15, 15, 35, 0.9)';
    }
});

// Add click events to navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Add some interactive animations
    const featureCards = document.querySelectorAll('.feature-card');
    const reviewCards = document.querySelectorAll('.review-card');

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Initially hide cards for animation
    [...featureCards, ...reviewCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add particle effect to hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.5);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// Add floating animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize particles when page loads
document.addEventListener('DOMContentLoaded', createParticles);

// Mobile menu toggle (if needed for smaller screens)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or menus
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('mobile-active');
    }
});

// Performance optimization: Debounce scroll events
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
const debouncedScrollHandler = debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 35, 0.95)';
    } else {
        header.style.background = 'rgba(15, 15, 35, 0.9)';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
