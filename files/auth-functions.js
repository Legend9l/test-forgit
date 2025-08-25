// Authentication UI Functions

// Open authentication modal
function openAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

// Close authentication modal
function closeAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Switch between auth modals
function switchAuthModal(fromModalId, toModalId) {
    closeAuthModal(fromModalId);
    setTimeout(() => {
        openAuthModal(toModalId);
    }, 300);
}

// Show forgot password modal
function showForgotPassword() {
    closeAuthModal('loginModal');
    setTimeout(() => {
        openAuthModal('forgotPasswordModal');
    }, 300);
}

// Show user profile modal
function showUserProfile() {
    if (!authManager.isLoggedIn()) {
        openAuthModal('loginModal');
        return;
    }
    
    const user = authManager.getCurrentUser();
    const profile = authManager.getUserProfile();
    
    // Populate profile form
    document.getElementById('profileName').value = profile?.displayName || user.displayName || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profilePhone').value = profile?.phone || '';
    
    openAuthModal('profileModal');
}

// Show order history
function showOrderHistory() {
    if (!authManager.isLoggedIn()) {
        openAuthModal('loginModal');
        return;
    }
    
    loadOrderHistory();
    openAuthModal('orderHistoryModal');
}

// Load order history
async function loadOrderHistory() {
    const orderList = document.getElementById('orderHistoryList');
    orderList.innerHTML = '<p style="text-align: center; color: #94a3b8;">Loading orders...</p>';
    
    try {
        const orders = await authManager.getUserOrders();
        
        if (orders.length === 0) {
            orderList.innerHTML = '<p style="text-align: center; color: #94a3b8;">No orders found.</p>';
            return;
        }
        
        orderList.innerHTML = orders.map(order => `
            <div class="order-item">
                <h4>Order #${order.id.slice(-8)}</h4>
                <div class="order-details">
                    <p><strong>Date:</strong> ${new Date(order.createdAt.toDate()).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Items:</strong> ${order.items.length} item(s)</p>
                </div>
                <span class="order-status ${order.status}">${order.status}</span>
            </div>
        `).join('');
    } catch (error) {
        orderList.innerHTML = '<p style="text-align: center; color: #ef4444;">Error loading orders.</p>';
    }
}

// Change password
function changePassword() {
    // This would typically open a password change modal
    alert('Password change functionality will be implemented soon.');
}

// Delete account
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // This would typically call authManager.deleteAccount()
        alert('Account deletion functionality will be implemented soon.');
    }
}

// Show terms and conditions
function showTerms() {
    // This would typically open a terms modal
    alert('Terms & Conditions will be displayed here.');
}

// Initialize authentication forms
function initAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await authManager.login(email, password);
            
            if (result.success) {
                closeAuthModal('loginModal');
                showNotification('Login successful!', 'success');
            } else {
                showNotification(result.error, 'error');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            const terms = document.getElementById('registerTerms').checked;
            
            // Validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showNotification('Please accept the terms and conditions', 'error');
                return;
            }
            
            const result = await authManager.register(email, password, name, phone);
            
            if (result.success) {
                closeAuthModal('registerModal');
                showNotification('Registration successful! Welcome to Luxe Shop!', 'success');
            } else {
                showNotification(result.error, 'error');
            }
        });
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('profileName').value;
            const phone = document.getElementById('profilePhone').value;
            
            const result = await authManager.updateProfile({
                displayName: name,
                phone: phone
            });
            
            if (result.success) {
                showNotification('Profile updated successfully!', 'success');
                closeAuthModal('profileModal');
            } else {
                showNotification(result.error, 'error');
            }
        });
    }
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            
            try {
                await authManager.auth.sendPasswordResetEmail(email);
                showNotification('Password reset email sent! Check your inbox.', 'success');
                closeAuthModal('forgotPasswordModal');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: #f8fafc;
        font-weight: 500;
        z-index: 10001;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize auth navigation
function initAuthNavigation() {
    // Add auth buttons to navigation
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const authNav = document.createElement('li');
        authNav.className = 'auth-nav';
        authNav.innerHTML = `
            <button class="auth-button login-btn" onclick="openAuthModal('loginModal')">
                <span class="material-icons">login</span>
                Login
            </button>
            <div class="user-info">
                <div class="user-avatar">
                    <span class="material-icons">person</span>
                </div>
                <span class="user-name"></span>
                <button class="auth-button logout-btn" onclick="authManager.logout()">
                    <span class="material-icons">logout</span>
                    Logout
                </button>
            </div>
        `;
        navLinks.appendChild(authNav);
    }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('auth-modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.auth-modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAuthForms();
    initAuthNavigation();
}); 