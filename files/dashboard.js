// Dashboard JavaScript

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
        loadDashboardData();
    } else {
        // Redirect to login if not authenticated
        showLoginPrompt();
    }
});

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load user profile
        await loadUserProfile();
        
        // Load user stats
        await loadUserStats();
        
        // Load recent orders
        await loadRecentOrders();
        
        // Update cart count
        updateCartCount();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Load user profile data
async function loadUserProfile() {
    const user = authManager.getCurrentUser();
    const profile = authManager.getUserProfile();
    
    if (user) {
        document.getElementById('userName').textContent = profile?.displayName || user.displayName || 'User';
        document.getElementById('userEmail').textContent = user.email || 'No email';
        document.getElementById('userPhone').textContent = profile?.phone || 'No phone';
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const orders = await authManager.getUserOrders();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const cartItems = cart.length;
        
        // Update UI
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
        document.getElementById('cartItems').textContent = cartItems;
        
    } catch (error) {
        console.error('Error loading user stats:', error);
        // Set default values
        document.getElementById('totalOrders').textContent = '0';
        document.getElementById('totalSpent').textContent = '$0';
        document.getElementById('cartItems').textContent = '0';
    }
}

// Load recent orders
async function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    
    try {
        const orders = await authManager.getUserOrders();
        
        if (orders.length === 0) {
            recentOrdersContainer.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">shopping_bag</span>
                    <h3>No Orders Yet</h3>
                    <p>Start shopping to see your orders here!</p>
                    <button class="btn-primary" onclick="window.location.href='index.html'">
                        <span class="material-icons">store</span>
                        Browse Products
                    </button>
                </div>
            `;
            return;
        }
        
        // Show only the 3 most recent orders
        const recentOrders = orders.slice(0, 3);
        
        recentOrdersContainer.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <h4>Order #${order.id.slice(-8)}</h4>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${new Date(order.createdAt.toDate()).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Items:</strong> ${order.items.length} item(s)</p>
                </div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="viewOrderDetails('${order.id}')">
                        <span class="material-icons">visibility</span>
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent orders:', error);
        recentOrdersContainer.innerHTML = `
            <div class="error-state">
                <span class="material-icons">error</span>
                <h3>Error Loading Orders</h3>
                <p>Unable to load your recent orders.</p>
                <button class="btn-secondary" onclick="loadRecentOrders()">
                    <span class="material-icons">refresh</span>
                    Try Again
                </button>
            </div>
        `;
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsElement = document.getElementById('cartItems');
    if (cartItemsElement) {
        cartItemsElement.textContent = cart.length;
    }
}

// View order details
function viewOrderDetails(orderId) {
    // This would typically open a detailed order view modal
    alert(`Order details for ${orderId} will be displayed here.`);
}

// Show login prompt
function showLoginPrompt() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <div class="login-prompt">
            <div class="login-prompt-content">
                <span class="material-icons">lock</span>
                <h2>Login Required</h2>
                <p>Please log in to access your dashboard.</p>
                <div class="login-actions">
                    <button class="btn-primary" onclick="openAuthModal('loginModal')">
                        <span class="material-icons">login</span>
                        Login
                    </button>
                    <button class="btn-secondary" onclick="openAuthModal('registerModal')">
                        <span class="material-icons">person_add</span>
                        Register
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Listen for auth state changes
if (typeof authManager !== 'undefined') {
    authManager.onAuthStateChanged((user) => {
        if (user) {
            // User logged in, load dashboard
            loadDashboardData();
        } else {
            // User logged out, show login prompt
            showLoginPrompt();
        }
    });
}

// Add dashboard-specific CSS
const dashboardStyles = `
<style>
.dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.dashboard-header {
    text-align: center;
    margin-bottom: 30px;
}

.dashboard-header h1 {
    color: #f8fafc;
    font-size: 2.5rem;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.dashboard-header p {
    color: #94a3b8;
    font-size: 1.1rem;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
}

.dashboard-card {
    background: #1e293b;
    border-radius: 12px;
    border: 1px solid #334155;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.dashboard-card.full-width {
    grid-column: 1 / -1;
}

.card-header {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    padding: 20px;
    border-bottom: 1px solid #475569;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h2 {
    color: #f8fafc;
    margin: 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-header .material-icons {
    color: #facc15;
}

.card-content {
    padding: 20px;
}

.profile-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.profile-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #facc15;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #1e293b;
}

.profile-details h3 {
    color: #f8fafc;
    margin: 0 0 5px 0;
    font-size: 1.2rem;
}

.profile-details p {
    color: #94a3b8;
    margin: 0;
    font-size: 0.9rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: #334155;
    border-radius: 8px;
    border: 1px solid #475569;
}

.stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #facc15;
    margin-bottom: 5px;
}

.stat-label {
    color: #94a3b8;
    font-size: 0.9rem;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.order-item {
    background: #334155;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #475569;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.order-header h4 {
    color: #f8fafc;
    margin: 0;
    font-size: 1.1rem;
}

.order-details p {
    color: #94a3b8;
    margin: 5px 0;
    font-size: 0.9rem;
}

.order-actions {
    margin-top: 10px;
}

.quick-actions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    background: #475569;
    color: #f8fafc;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.action-btn:hover {
    background: #64748b;
    transform: translateY(-1px);
}

.security-status {
    margin-bottom: 20px;
}

.security-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.security-icon {
    color: #10b981;
    font-size: 1.5rem;
}

.security-item h4 {
    color: #f8fafc;
    margin: 0 0 2px 0;
    font-size: 1rem;
}

.security-item p {
    color: #94a3b8;
    margin: 0;
    font-size: 0.9rem;
}

.login-prompt {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
}

.login-prompt-content {
    text-align: center;
    background: #1e293b;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #334155;
    max-width: 400px;
}

.login-prompt-content .material-icons {
    font-size: 4rem;
    color: #facc15;
    margin-bottom: 20px;
}

.login-prompt-content h2 {
    color: #f8fafc;
    margin-bottom: 10px;
}

.login-prompt-content p {
    color: #94a3b8;
    margin-bottom: 25px;
}

.login-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.empty-state, .error-state {
    text-align: center;
    padding: 40px 20px;
}

.empty-state .material-icons, .error-state .material-icons {
    font-size: 3rem;
    color: #94a3b8;
    margin-bottom: 15px;
}

.empty-state h3, .error-state h3 {
    color: #f8fafc;
    margin-bottom: 10px;
}

.empty-state p, .error-state p {
    color: #94a3b8;
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .login-actions {
        flex-direction: column;
    }
    
    .card-header {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
}
</style>
`;

// Inject dashboard styles
document.head.insertAdjacentHTML('beforeend', dashboardStyles); 