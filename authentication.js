// User database (in production, use server-side authentication)
const users = [
    { id: "drdo-admin", password: "secure@123", name: "Admin User", role: "admin" },
    { id: "drdo-hr", password: "hr@2025", name: "HR Manager", role: "hr" },
    { id: "drdo-staff", password: "staff@drdo", name: "Staff Member", role: "staff" }
];

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
let inactivityTimer;

// Initialize authentication system
function initAuth() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Password toggle
        const toggle = document.querySelector('.password-toggle');
        if (toggle) {
            toggle.addEventListener('click', togglePasswordVisibility);
        }
    }
    
    // Check session on dashboard
    if (document.querySelector('.dashboard')) {
        checkSession();
        setupSessionMonitoring();
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggle = document.querySelector('.password-toggle');
    const isVisible = passwordInput.type === 'text';
    
    passwordInput.type = isVisible ? 'password' : 'text';
    toggle.textContent = isVisible ? '👁️' : '👁️‍🗨️';
    toggle.style.opacity = isVisible ? '0.7' : '1';
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }

    // Validate credentials
    const user = users.find(u => u.id === username && u.password === password);
    
    if (user) {
        // Create session
        createUserSession(user);
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showLoginError('Invalid credentials. Please try again.');
    }
}

// Create user session
function createUserSession(user) {
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
    }));
    sessionStorage.setItem('lastActivity', Date.now());
}

// Show login error message
function showLoginError(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.login-error');
    if (existingError) existingError.remove();
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'login-error';
    errorElement.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
        </div>
    `;
    
    // Insert after password wrapper
    const passwordWrapper = document.querySelector('.password-wrapper');
    if (passwordWrapper) {
        passwordWrapper.parentNode.insertBefore(errorElement, passwordWrapper.nextSibling);
    }
    
    // Add shake animation
    errorElement.style.animation = 'shake 0.5s';
    
    // Focus on username field
    document.getElementById('username').focus();
}

// Check session validity
function checkSession() {
    const lastActivity = sessionStorage.getItem('lastActivity');
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    if (!isAuthenticated || !lastActivity || (Date.now() - lastActivity > SESSION_TIMEOUT)) {
        logout();
    } else {
        updateUserInfo();
    }
}

// Setup session monitoring
function setupSessionMonitoring() {
    // Setup logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            confirmLogout();
        });
    }
    
    // Update last activity on user interaction
    const activityEvents = ['click', 'keypress', 'mousemove', 'scroll'];
    activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
    
    startInactivityTimer();
}

// Update user info in dashboard
function updateUserInfo() {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user && user.name) {
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = user.name.split(' ')[0];
            }
        }
    } catch (e) {
        console.error('Error updating user info:', e);
    }
}

// Reset inactivity timer
function resetInactivityTimer() {
    sessionStorage.setItem('lastActivity', Date.now());
    startInactivityTimer();
}

// Start inactivity timer
function startInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        alert('Your session will expire due to inactivity. Please refresh to continue.');
        logout();
    }, SESSION_TIMEOUT);
}

// Confirm logout
function confirmLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
    }
}

// Logout function
function logout() {
    clearTimeout(inactivityTimer);
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);