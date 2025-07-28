document.addEventListener('DOMContentLoaded', function() {
    // Only run on pages with dashboard class
    if (!document.querySelector('.dashboard')) return;

    // 1. Initialize Date and Time Elements
    const initializeDateTime = () => {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-IN', options);
        document.getElementById('currentYear').textContent = now.getFullYear();
        
        const hours = now.getHours();
        let greeting = 'Good Morning';
        if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
        if (hours >= 17) greeting = 'Good Evening';
        document.getElementById('timeGreeting').textContent = greeting;
    };

    // 2. Load User Data from Session
    const loadUserData = () => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user && user.name) {
                document.getElementById('userName').textContent = user.name.split(' ')[0];
            }
        } catch (e) {
            console.error("Error loading user:", e);
        }
    };

    // 3. Quick Tools Functionality (only on dashboard)
    const setupQuickTools = () => {
        if (!document.querySelector('.quick-tools-section')) return;
        
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.querySelector('span:not(.icon)').textContent;
                alert(`Action: ${action}\nThis would open the ${action} module in a real application.`);
            });
        });
    };

    // 4. Filter Functionality (only on dashboard)
    const setupActivityFilter = () => {
        const filterSelect = document.querySelector('.filter-select');
        if (!filterSelect) return;
        
        filterSelect.addEventListener('change', function() {
            const filter = this.value;
            document.querySelectorAll('.activity-item').forEach(item => {
                item.style.display = (filter === 'All Activities' || item.textContent.includes(filter)) 
                    ? 'flex' 
                    : 'none';
            });
        });
    };

    // 5. Logout Functionality
    const setupLogout = () => {
        const logoutBtn = document.querySelector('.logout-btn');
        if (!logoutBtn) return;
        
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.clear();
                window.location.href = 'index.html';
            }
        });
    };

    // 6. Tab Functionality (for section pages)
    const setupTabs = () => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        if (tabBtns.length === 0) return;
        
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const tabPrefix = this.closest('[class$="-tabs"]').className.replace('-tabs', '');
                const tabId = this.getAttribute('data-tab') + '-' + tabPrefix;
                document.getElementById(tabId).classList.add('active');
            });
        });
    };

    // Initialize all components
    initializeDateTime();
    loadUserData();
    setupQuickTools();
    setupActivityFilter();
    setupLogout();
    setupTabs();
});