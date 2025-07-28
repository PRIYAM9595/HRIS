document.addEventListener('DOMContentLoaded', function() {
    // Only run on dashboard page
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

    // 3. Navigation Handling
    const setupNavigation = () => {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active navigation item
                navItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding section
                const sectionId = this.getAttribute('data-section');
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === sectionId) {
                        section.classList.add('active');
                    }
                });
                
                // Special handling for dashboard to show Quick Tools
                if (sectionId === 'dashboard') {
                    document.getElementById('quick-tools').classList.add('active');
                    document.getElementById('activity').classList.add('active');
                } else {
                    document.getElementById('quick-tools').classList.remove('active');
                    document.getElementById('activity').classList.remove('active');
                }
                
                // Load module content if not dashboard
                if (sectionId !== 'dashboard') {
                    loadModuleContent(sectionId);
                }
            });
        });
    };

    // 4. Module Content Loading
    const loadModuleContent = (module) => {
        const container = document.querySelector(`#${module} .module-container`);
        if (!container) return;
        
        container.innerHTML = '<div class="loading">Loading module data...</div>';
        
        // Simulate API call with timeout
        setTimeout(() => {
            container.innerHTML = generateModuleContent(module);
        }, 500);
    };

    const generateModuleContent = (module) => {
        switch(module) {
            case 'training':
                return `
                    <div class="module-card">
                        <h3>Student Training</h3>
                        <div class="progress-bar">
                            <div class="progress" style="width: 65%"></div>
                        </div>
                        <div class="module-stats">
                            <div>24 Ongoing</div>
                            <div>12 Completed</div>
                            <div>8 Upcoming</div>
                        </div>
                    </div>
                    <div class="module-card">
                        <h3>Employee Training</h3>
                        <div class="progress-bar">
                            <div class="progress" style="width: 42%"></div>
                        </div>
                        <div class="module-stats">
                            <div>18 Ongoing</div>
                            <div>24 Completed</div>
                            <div>5 Upcoming</div>
                        </div>
                    </div>
                `;
                
            case 'hiring':
                return `
                    <div class="module-card">
                        <h3>Current Hiring Process</h3>
                        <div class="hiring-stages">
                            <div class="stage active">Applications</div>
                            <div class="stage">NATS Verification</div>
                            <div class="stage">Committee Review</div>
                            <div class="stage">Final Approval</div>
                        </div>
                        <div class="module-stats">
                            <div>56 Applications</div>
                            <div>12 Shortlisted</div>
                            <div>4 Positions</div>
                        </div>
                    </div>
                `;
                
            default:
                return `
                    <div class="module-card">
                        <h3>${module.charAt(0).toUpperCase() + module.slice(1)} Module</h3>
                        <p>This section contains all ${module} related functionality.</p>
                        <div class="placeholder-content">
                            <p>Sample content for ${module} module would appear here.</p>
                            <ul>
                                <li>Feature 1</li>
                                <li>Feature 2</li>
                                <li>Feature 3</li>
                            </ul>
                        </div>
                    </div>
                `;
        }
    };

    // 5. Quick Tools Functionality
    const setupQuickTools = () => {
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.querySelector('span:not(.icon)').textContent;
                alert(`Action: ${action}\nThis would open the ${action} module in a real application.`);
            });
        });
    };

    // 6. Filter Functionality
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

    // 7. Logout Functionality
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

    // Initialize all components
    initializeDateTime();
    loadUserData();
    setupNavigation();
    setupQuickTools();
    setupActivityFilter();
    setupLogout();

    // Activate default tab
    const defaultNavItem = document.querySelector('.nav-item.active');
    if (defaultNavItem) {
        defaultNavItem.click();
    } else if (document.querySelector('.nav-item')) {
        document.querySelector('.nav-item').click();
    }
});