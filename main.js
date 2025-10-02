// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCy7lVxSlpWCvN6sNSYr38APelVXppcAcU",
    authDomain: "fddhgfhgfh.firebaseapp.com",
    databaseURL: "https://fddhgfhgfh-default-rtdb.firebaseio.com",
    projectId: "fddhgfhgfh",
    storageBucket: "fddhgfhgfh.firebasestorage.app",
    messagingSenderId: "710929135473",
    appId: "1:710929135473:web:e1bc4117e38759ccbc68d0",
    measurementId: "G-NRGWFZ6DS8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
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
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');

// Default games data
const defaultGames = [
    {
        name: "Duck Life 1",
        url: "https://my-github-site.github.io/ducklife/ducklife1/index.html",
        image: ""
    },
    {
        name: "Duck Life 2",
        url: "https://my-github-site.github.io/ducklife/ducklife2/index.html",
        image: ""
    },
    {
        name: "Duck Life 3",
        url: "https://my-github-site.github.io/ducklife/ducklife3/index.html",
        image: ""
    },
    {
        name: "Duck Life 4",
        url: "https://my-github-site.github.io/ducklife/ducklife4/index.html",
        image: ""
    }
];

// State
let currentUser = null; // {email, username}
let isLogin = true;
let games = [];
let filteredGames = [];
let searchTerm = '';

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
    // Check if user info is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showMainApp();
        loadGames();
        updateUsernameDisplay();
    } else {
        showAuthModal();
    }
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

    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);

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

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value.trim();

    hideError();

    if (!email || !password || (!isLogin && !username)) {
        showError('Please fill in all required fields.');
        return;
    }

    if (isLogin) {
        // Login: check users in database
        database.ref('users').orderByChild('email').equalTo(email).once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    showError('User not found.');
                    return;
                }

                let userData = null;
                snapshot.forEach(childSnap => {
                    const val = childSnap.val();
                    if (val.email === email) {
                        userData = val;
                    }
                });

                if (!userData) {
                    showError('User not found.');
                    return;
                }

                if (userData.password !== password) {
                    showError('Incorrect password.');
                    return;
                }

                // Successful login
                currentUser = {
                    email: userData.email,
                    username: userData.username
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showMainApp();
                loadGames();
                updateUsernameDisplay();

                // Reset form
                authForm.reset();
            })
            .catch(err => {
                showError('Login failed: ' + err.message);
            });

    } else {
        // Sign up: check if email already exists
        database.ref('users').orderByChild('email').equalTo(email).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    showError('Email is already registered.');
                    return;
                }

                // Save new user in database
                const newUser = {
                    username: username,
                    email: email,
                    password: password,
                    createdAt: Date.now()
                };

                database.ref('users').push(newUser)
                    .then(() => {
                        currentUser = {
                            email: newUser.email,
                            username: newUser.username
                        };
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        showMainApp();
                        loadGames();
                        updateUsernameDisplay();

                        // Reset form
                        authForm.reset();
                    })
                    .catch(err => {
                        showError('Sign up failed: ' + err.message);
                    });
            })
            .catch(err => {
                showError('Sign up failed: ' + err.message);
            });
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthModal();
    clearSearch();
}

// Update username display in UI
function updateUsernameDisplay() {
    usernameDisplay.textContent = currentUser?.username || currentUser?.email || '';
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

    const gamesToRender = searchTerm ? filteredGames : games;

    if (gamesToRender.length === 0) {
        const noGamesMsg = document.createElement('div');
        noGamesMsg.className = 'no-games-message';
        noGamesMsg.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No games found</h3>
            <p>${searchTerm ? `No games match "${searchTerm}"` : 'No games available'}</p>
        `;
        gamesGrid.appendChild(noGamesMsg);
        return;
    }

    gamesToRender.forEach((game, index) => {
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

    if (!currentUser) {
        alert('You must be logged in to add games.');
        return;
    }

    const newGame = {
        name: name,
        url: url,
        image: image,
        addedBy: currentUser.email,
        addedAt: Date.now()
    };

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
        } else {
            el.style.transform = '';
        }
    });
});

// Search Functions
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm) {
        filteredGames = games.filter(game =>
            game.name.toLowerCase().includes(searchTerm)
        );
        clearSearchBtn.classList.remove('hidden');
    } else {
        filteredGames = [];
        clearSearchBtn.classList.add('hidden');
    }

    renderGames();
}

function clearSearch() {
    searchInput.value = '';
    searchTerm = '';
    filteredGames = [];
    clearSearchBtn.classList.add('hidden');
    renderGames();
}

console.log('Nova Games Hub initialized! 🚀');
