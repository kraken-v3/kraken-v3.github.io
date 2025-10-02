// Firebase Configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "AIzaSyCy7lVxSlpWCvN6sNSYr38APelVXppcAcU",
    authDomain: "https://fddhgfhgfh-default-rtdb.firebaseio.com",
    databaseURL: "https://fddhgfhgfh-default-rtdb.firebaseio.com",
    projectId: "fddhgfhgfh",
    storageBucket: "fddhgfhgfh.firebasestorage.app",
    messagingSenderId: "710929135473",
    appId: "1:710929135473:web:e1bc4117e38759ccbc68d0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const authModal = document.getElementById('auth-modal');
const mainApp = document.getElementById('main-app');
const authForm = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
const tabBtns = document.querySelectorAll('.tab-btn');
const authBtnText = document.getElementById('auth-btn-text');
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const gamesGrid = document.getElementById('games-grid');
const addGameBtn = document.getElementById('add-game-btn');
const addGameModal = document.getElementById('add-game-modal');
const addGameForm = document.getElementById('add-game-form');
const closeAddGameBtn = document.getElementById('close-add-game');

// Default games data
const defaultGames = [
    {
        name: "Duck Life 1",
        url: "https://my-github-site.github.io/ducklife/ducklife1/index.html",
        category: "adventure",
        image: ""
    },
    {
        name: "Duck Life 2",
        url: "https://my-github-site.github.io/ducklife/ducklife2/index.html",
        category: "adventure",
        image: ""
    },
    {
        name: "Duck Life 3",
        url: "https://my-github-site.github.io/ducklife/ducklife3/index.html",
        category: "adventure",
        image: ""
    },
    {
        name: "Duck Life 4",
        url: "https://my-github-site.github.io/ducklife/ducklife4/index.html",
        category: "adventure",
        image: ""
    }
];

// State
let currentUser = null;
let isLogin = true;
let games = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();

    // Show loading screen for 3 seconds
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000);
});

// App Initialization
function initializeApp() {
    // Check auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            showMainApp();
            loadUserData();
            loadGames();
        } else {
            currentUser = null;
            showAuthModal();
        }
    });
}

// Event Listeners
function setupEventListeners() {
    // Auth tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
    });

    // Auth form
    authForm.addEventListener('submit', handleAuth);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Add game modal
    addGameBtn.addEventListener('click', () => showModal(addGameModal));
    closeAddGameBtn.addEventListener('click', () => hideModal(addGameModal));
    addGameForm.addEventListener('submit', handleAddGame);

    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });
}

// Loading Screen
function hideLoadingScreen() {
    loadingScreen.style.animation = 'modalFadeIn 0.5s ease-out reverse';
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 500);
}

// Modal Functions
function showModal(modal) {
    modal.classList.remove('hidden');
    modal.style.animation = 'modalFadeIn 0.3s ease-out';
}

function hideModal(modal) {
    modal.style.animation = 'modalFadeIn 0.3s ease-out reverse';
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function showAuthModal() {
    hideModal(mainApp);
    setTimeout(() => showModal(authModal), 100);
}

function showMainApp() {
    hideModal(authModal);
    setTimeout(() => {
        mainApp.classList.remove('hidden');
        mainApp.style.animation = 'appFadeIn 0.5s ease-out';
    }, 100);
}

// Auth Functions
function switchAuthTab(tab) {
    isLogin = tab === 'login';

    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update form
    const signupOnlyElements = document.querySelectorAll('.signup-only');
    signupOnlyElements.forEach(el => {
        el.classList.toggle('hidden', isLogin);
    });

    // Update button text
    authBtnText.textContent = isLogin ? 'Enter Nova' : 'Join Nova';

    // Clear error
    hideError();
}

function handleAuth(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    hideError();

    if (isLogin) {
        // Login
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('Login successful');
            })
            .catch((error) => {
                showError(error.message);
            });
    } else {
        // Sign up
        if (!username.trim()) {
            showError('Username is required');
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Save user data
                const user = userCredential.user;
                return database.ref('users/' + user.uid).set({
                    username: username,
                    email: email,
                    createdAt: Date.now()
                });
            })
            .then(() => {
                console.log('Sign up successful');
            })
            .catch((error) => {
                showError(error.message);
            });
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        console.log('Logout successful');
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

function loadUserData() {
    if (!currentUser) return;

    database.ref('users/' + currentUser.uid).once('value')
        .then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                usernameDisplay.textContent = userData.username || currentUser.email;
            } else {
                usernameDisplay.textContent = currentUser.email;
            }
        })
        .catch((error) => {
            console.error('Error loading user data:', error);
            usernameDisplay.textContent = currentUser.email;
        });
}

// Error Handling
function showError(message) {
    authError.textContent = message;
    authError.classList.remove('hidden');
}

function hideError() {
    authError.classList.add('hidden');
}

// Games Management
function loadGames() {
    database.ref('games').once('value')
        .then((snapshot) => {
            const gamesData = snapshot.val();
            if (gamesData) {
                games = Object.keys(gamesData).map(key => ({
                    id: key,
                    ...gamesData[key]
                }));
            } else {
                // Initialize with default games
                initializeDefaultGames();
            }
            renderGames();
        })
        .catch((error) => {
            console.error('Error loading games:', error);
            // Fallback to default games
            games = defaultGames.map((game, index) => ({ ...game, id: index.toString() }));
            renderGames();
        });
}

function initializeDefaultGames() {
    const gamesRef = database.ref('games');
    defaultGames.forEach((game, index) => {
        gamesRef.push(game);
    });
    games = defaultGames.map((game, index) => ({ ...game, id: index.toString() }));
}

function renderGames() {
    gamesGrid.innerHTML = '';

    games.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });
}

function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.setProperty('--card-index', index);

    const gameImage = game.image ?
        `<img src="${game.image}" alt="${game.name}">` :
        `<i class="fas fa-gamepad"></i>`;

    card.innerHTML = `
        <div class="game-image">
            ${gameImage}
        </div>
        <div class="game-title">${game.name}</div>
        <div class="game-category">${game.category}</div>
    `;

    card.addEventListener('click', () => playGame(game.url));

    return card;
}

function playGame(url) {
    // Open game in new tab
    window.open(url, '_blank');
}

function handleAddGame(e) {
    e.preventDefault();

    const name = document.getElementById('game-name').value;
    const url = document.getElementById('game-url').value;
    const image = document.getElementById('game-image').value;
    const category = document.getElementById('game-category').value;

    const newGame = {
        name: name,
        url: url,
        image: image,
        category: category,
        addedBy: currentUser.uid,
        addedAt: Date.now()
    };

    // Add to Firebase
    database.ref('games').push(newGame)
        .then(() => {
            // Reload games
            loadGames();

            // Reset form and close modal
            addGameForm.reset();
            hideModal(addGameModal);

            console.log('Game added successfully');
        })
        .catch((error) => {
            console.error('Error adding game:', error);
            alert('Error adding game: ' + error.message);
        });
}

// Utility Functions
function createParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() > 0.5 ? '0, 255, 255' : '255, 0, 255'}, ${Math.random() * 0.5 + 0.3})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';

        particlesContainer.appendChild(particle);
    }
}

// Initialize particles when main app is shown
function enhanceUI() {
    createParticles();

    // Add hover effects to game cards
    document.querySelectorAll('.game-card').forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.animationPlayState = 'paused';
        });

        card.addEventListener('mouseleave', () => {
            card.style.animationPlayState = 'running';
        });
    });
}

// Call enhance UI after games are rendered
const originalRenderGames = renderGames;
renderGames = function() {
    originalRenderGames.call(this);
    setTimeout(enhanceUI, 100);
};

// Add some dynamic effects
document.addEventListener('mousemove', (e) => {
    const cursor = { x: e.clientX, y: e.clientY };
    const elements = document.querySelectorAll('.game-card');

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(cursor.x - centerX, 2) + Math.pow(cursor.y - centerY, 2)
        );

        if (distance < 200) {
            const intensity = (200 - distance) / 200;
            el.style.transform = `translateY(-${intensity * 5}px)`;
        }
    });
});

console.log('Nova Games Hub initialized! 🚀');
