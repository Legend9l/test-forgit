
// ====== Enhanced Banner Slider ======
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.banner-dot');

// Initialize banner slider
function initBannerSlider() {
  if (slides.length === 0) return;
  
  // Start auto-slide
  startAutoSlide();
  
  // Add touch/swipe support for mobile
  addTouchSupport();
  
  // Add keyboard navigation
  addKeyboardSupport();
  
  // Pause auto-slide on hover (desktop only)
  if (window.innerWidth > 768) {
    const bannerSlider = document.querySelector('.banner-slider');
    bannerSlider.addEventListener('mouseenter', pauseAutoSlide);
    bannerSlider.addEventListener('mouseleave', startAutoSlide);
  }
}

// Start auto-slide
function startAutoSlide() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    changeSlide(1);
  }, 5000); // Increased to 5 seconds for better UX
}

// Pause auto-slide
function pauseAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

// Change slide
function changeSlide(direction) {
  const totalSlides = slides.length;
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateSlide();
  startAutoSlide(); // Restart auto-slide after manual navigation
}

// Go to specific slide
function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlide();
  startAutoSlide(); // Restart auto-slide after manual navigation
}

// Update slide display
function updateSlide() {
  // Update slides
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
  
  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Add touch/swipe support for mobile
function addTouchSupport() {
  const bannerSlider = document.querySelector('.banner-slider');
  let startX = 0;
  let endX = 0;
  
  bannerSlider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    pauseAutoSlide();
  }, { passive: true });
  
  bannerSlider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        changeSlide(1); // Swipe left = next
      } else {
        changeSlide(-1); // Swipe right = previous
      }
    }
    
    startAutoSlide();
  }, { passive: true });
}

// Add keyboard navigation
function addKeyboardSupport() {
  document.addEventListener('keydown', (e) => {
    const bannerSlider = document.querySelector('.banner-slider');
    if (bannerSlider && bannerSlider.offsetParent !== null) { // Check if visible
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeSlide(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeSlide(1);
      }
    }
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  // Restart auto-slide with new timing if needed
  if (slideInterval) {
    startAutoSlide();
  }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initBannerSlider);

// ====== Load Products (Top Up) from products.json ======
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('products');
    data.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>
          <span class="old-price">$${(product.oldPrice || product.price * 1.2).toFixed(2)}</span> 
          <span class="new-price">$${product.price.toFixed(2)}</span>
        </p>
        <button onclick="addToCart('${product.id}', 1)">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  });

// ====== Load Game Keys from deals.json ======
fetch('keys.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('keys');
    data.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product'; // You can also use 'key-card' if styled separately
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>
          <span class="old-price">$${(product.oldPrice || product.price * 1.2).toFixed(2)}</span> 
          <span class="new-price">$${product.price.toFixed(2)}</span>
        </p>
        <button onclick="addToCart('${product.id}', 1)">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  });

// ====== Load Game Keys from deals.json ======

  fetch("topups.json")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        const containerId = `${product.id}-products`;
        const container = document.getElementById(containerId);
        if (container) {
          const div = document.createElement("div");
          div.className = "product";
          div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
             <p>
          <span class="old-price">$${(product.oldPrice || product.price * 1.2).toFixed(2)}</span> 
          <span class="new-price">$${product.price.toFixed(2)}</span>
        </p>
            <button onclick="addToCart('${product.id}', 1)">Add to Cart</button>
          `;
          container.appendChild(div);
        }
      });
    });
// ====== Load Game Keys from deals.json ======

  fetch("keys.json")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        const containerId = `${product.id}-products`;
        const container = document.getElementById(containerId);
        if (container) {
          const div = document.createElement("div");
          div.className = "product";
          div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
             <p>
          <span class="old-price">$${(product.oldPrice || product.price * 1.2).toFixed(2)}</span> 
          <span class="new-price">$${product.price.toFixed(2)}</span>
        </p>
         <h3><span>Stock : </span> ${product.stock}</h3>
            <button onclick="addToCart('${product.id}', 1)">Add to Cart</button>
          `;
          container.appendChild(div);
        }
      });
    });


// ====== Add to Cart Handler ======
// Global cart data (moved to top level)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth manager if Firebase is available
    if (typeof firebase !== 'undefined') {
        // Auth manager will be initialized in auth.js
        console.log('Firebase available, auth system ready');
    } else {
        console.log('Firebase not available, using local storage only');
    }
    
    // Initialize existing functionality
    initBannerSlider();
    loadFAQData();
});

function addToCart(id) {
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Sync with server if user is logged in
  if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
    authManager.saveCartToServer(cart);
  }
  
  showCartNotification('Product added to cart!');
}

//// buy
function buyOnWhatsApp(title, price) {
  const message = `Hello, I want to buy this product:\n\n*${title}*\nPrice: $${price.toFixed(2)}`;
  const phoneNumber = "212601124335"; // رقمك على واتساب بدون "+" (مثلاً: المغرب يبدأ بـ 212)
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
}

// ====== Live Support Popup Functions ======

// Open support popup
function openSupportPopup() {
  const popup = document.getElementById('supportPopup');
  popup.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  
  // Focus on input field
  setTimeout(() => {
    document.getElementById('messageInput').focus();
  }, 300);
  
  // Add helpful welcome message if this is the first time opening
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages && chatMessages.children.length === 1) {
    setTimeout(() => {
      addMessageToChat("💡 **Quick Tips:**\n\n• Use the quick action buttons below for common questions\n• I can help with orders, payments, delivery, and technical issues\n• Feel free to ask anything - I'm here to help!\n\nWhat can I assist you with today? 🚀", 'agent');
    }, 1000);
  }
}

// Close support popup
function closeSupportPopup() {
  const popup = document.getElementById('supportPopup');
  popup.classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scrolling
}

// Handle Enter key press in message input
function handleMessageKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Send message function
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (message === '') return;
  
  // Add user message to chat
  addMessageToChat(message, 'user');
  
  // Clear input
  input.value = '';
  
  // Simulate typing indicator
  showTypingIndicator();
  
  // Simulate agent response after a delay
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateAgentResponse(message);
    addMessageToChat(response, 'agent');
  }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
}

// Send quick message from quick action buttons
function sendQuickMessage(message) {
  const input = document.getElementById('messageInput');
  input.value = message;
  sendMessage();
}

// Add message to chat
function addMessageToChat(message, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${message}</p>
      <span class="message-time">${currentTime}</span>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message agent typing-indicator';
  typingDiv.id = 'typingIndicator';
  
  typingDiv.innerHTML = `
    <div class="message-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Global FAQ data
let faqData = null;

// Load FAQ data
async function loadFAQData() {
  try {
    const response = await fetch('support-faq.json');
    faqData = await response.json();
  } catch (error) {
    console.error('Error loading FAQ data:', error);
    // Fallback to basic responses if FAQ fails to load
    faqData = {
      quick_responses: {
        default: [
          "Thank you for your message! I'm here to help. Could you please provide more details about your inquiry?",
          "I understand your concern. Let me help you resolve this issue. Could you share more specific information?",
          "Thanks for reaching out! I'll do my best to assist you. What specific help do you need?",
          "I appreciate you contacting us. Let me gather some information to better assist you with your request."
        ]
      }
    };
  }
}

// Generate agent response based on user message using FAQ system
function generateAgentResponse(userMessage) {
  if (!faqData) {
    // Fallback response if FAQ data isn't loaded
    return "Thank you for your message! I'm here to help. Could you please provide more details about your inquiry?";
  }
  
  const message = userMessage.toLowerCase();
  
  // Search through all categories and questions
  for (const categoryKey in faqData.categories) {
    const category = faqData.categories[categoryKey];
    
    for (const question of category.questions) {
      // Check if any keyword matches the user message
      for (const keyword of question.keywords) {
        if (message.includes(keyword.toLowerCase())) {
          return question.response;
        }
      }
    }
  }
  
  // Enhanced fallback responses with more helpful suggestions
  const enhancedResponses = [
    "I understand you need help! 🤔 Could you please be more specific? For example:\n\n• Are you having trouble with an order?\n• Do you need help with payment?\n• Is there a technical issue?\n• Do you have questions about our products?\n\nI'm here to help with anything! 🚀",
    "Thanks for reaching out! 💬 To help you better, could you tell me:\n\n• What specific issue are you experiencing?\n• Are you looking for a particular product?\n• Do you need help with the checkout process?\n• Are you having trouble with delivery?\n\nI want to make sure I give you the best possible assistance! ✨",
    "I'm here to help! 🎯 To provide you with the most accurate support, could you please specify:\n\n• What type of help do you need?\n• Are you a new or returning customer?\n• What product or service are you interested in?\n• Are you experiencing any errors?\n\nLet me know the details and I'll guide you through it! 🚀"
  ];
  
  return enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)];
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  // Load FAQ data for support system
  loadFAQData();
  
  const popup = document.getElementById('supportPopup');
  
  popup.addEventListener('click', function(event) {
    if (event.target === popup) {
      closeSupportPopup();
    }
  });
  
  // Close popup with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && popup.classList.contains('active')) {
      closeSupportPopup();
    }
  });
  
  // Initialize order page if we're on the order page
  if (window.location.pathname.includes('order.html')) {
    initOrderPage();
  }
});

// ====== Order Page Functions ======

// Global cart data
let products = [];

// Initialize order page
function initOrderPage() {
  loadProducts();
  loadCart();
  setupPaymentMethodHandlers();
  setupFormValidation();
  setupCreditCardFormatting();
}

// Load products from JSON files
async function loadProducts() {
  try {
    const [productsResponse, keysResponse, topupsResponse] = await Promise.all([
      fetch('products.json'),
      fetch('keys.json'),
      fetch('topups.json')
    ]);
    
    const productsData = await productsResponse.json();
    const keysData = await keysResponse.json();
    const topupsData = await topupsResponse.json();
    
    products = [...productsData, ...keysData, ...topupsData];
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Load cart items
function loadCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; color: #94a3b8;">Your cart is empty</p>';
    updateTotals();
    return;
  }
  
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${product.title}</div>
          <div class="cart-item-price">$${product.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-quantity">Qty: ${item.quantity}</div>
      `;
      cartItemsContainer.appendChild(cartItem);
    }
  });
  
  updateTotals();
}

// Update order totals
function updateTotals() {
  const subtotal = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const tax = subtotal * 0.05; // 5% tax
  const discount = subtotal * 0.10; // 10% discount for demo
  const total = subtotal + tax - discount;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Setup payment method handlers
function setupPaymentMethodHandlers() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const creditCardDetails = document.getElementById('creditCardDetails');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
      if (this.value === 'creditCard') {
        creditCardDetails.style.display = 'block';
        // Make credit card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('expiryDate').required = true;
        document.getElementById('cvv').required = true;
        document.getElementById('cardName').required = true;
      } else {
        creditCardDetails.style.display = 'none';
        // Remove required from credit card fields
        document.getElementById('cardNumber').required = false;
        document.getElementById('expiryDate').required = false;
        document.getElementById('cvv').required = false;
        document.getElementById('cardName').required = false;
      }
    });
  });
}

// Setup form validation
function setupFormValidation() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      processOrder();
    }
  });
}

// Validate form
function validateForm() {
  const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
  let isValid = true;
  
  // Check required fields
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      showFieldError(field, 'This field is required');
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });
  
  // Validate email
  const email = document.getElementById('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value && !emailRegex.test(email.value)) {
    showFieldError(email, 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate phone
  const phone = document.getElementById('phone');
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (phone.value && !phoneRegex.test(phone.value.replace(/\s/g, ''))) {
    showFieldError(phone, 'Please enter a valid phone number');
    isValid = false;
  }
  
  // Check terms agreement
  const terms = document.getElementById('terms');
  if (!terms.checked) {
    alert('Please agree to the Terms & Conditions and Privacy Policy');
    isValid = false;
  }
  
  // Validate credit card if selected
  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
  if (selectedPayment && selectedPayment.value === 'creditCard') {
    const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    cardFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        showFieldError(field, 'This field is required');
        isValid = false;
      } else {
        clearFieldError(field);
      }
    });
  }
  
  return isValid;
}

// Show field error
function showFieldError(field, message) {
  clearFieldError(field);
  field.style.borderColor = '#f87171';
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.style.color = '#f87171';
  errorDiv.style.fontSize = '12px';
  errorDiv.style.marginTop = '4px';
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
  field.style.borderColor = '#334155';
  const errorDiv = field.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Setup credit card formatting
function setupCreditCardFormatting() {
  const cardNumber = document.getElementById('cardNumber');
  const expiryDate = document.getElementById('expiryDate');
  const cvv = document.getElementById('cvv');
  
  if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = value;
    });
  }
  
  if (expiryDate) {
    expiryDate.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }
  
  if (cvv) {
    cvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }
}

// Process order
function processOrder() {
  const formData = new FormData(document.getElementById('checkoutForm'));
  const orderData = {
    customer: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone')
    },
    payment: {
      method: formData.get('paymentMethod'),
      cardNumber: formData.get('cardNumber'),
      expiryDate: formData.get('expiryDate'),
      cvv: formData.get('cvv'),
      cardName: formData.get('cardName')
    },
    order: {
      items: cart,
      subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
      tax: parseFloat(document.getElementById('tax').textContent.replace('$', '')),
      discount: parseFloat(document.getElementById('discount').textContent.replace('-$', '')),
      total: parseFloat(document.getElementById('total').textContent.replace('$', ''))
    },
    notes: formData.get('notes'),
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString()
  };
  
  // Simulate payment processing
  showProcessingMessage();
  
  setTimeout(async () => {
    // Simulate successful payment
    clearCart();
    showSuccessModal(orderData.orderNumber);
    
    // Save order to server if user is logged in
    if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
      try {
        const result = await authManager.saveOrder(orderData);
        if (result.success) {
          console.log('Order saved to server:', result.orderId);
        } else {
          console.error('Failed to save order to server:', result.error);
        }
      } catch (error) {
        console.error('Error saving order to server:', error);
      }
    }
    
    // Send order data to server (in real implementation)
    console.log('Order processed:', orderData);
    
    // Send confirmation email (in real implementation)
    sendOrderConfirmation(orderData);
    
  }, 3000);
}

// Show processing message
function showProcessingMessage() {
  const submitBtn = document.querySelector('.btn-primary');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<span class="material-icons rotating">sync</span> Processing...';
  submitBtn.disabled = true;
  
  // Re-enable button after processing
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 3000);
}

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LX${timestamp}${random}`;
}

// Show success modal
function showSuccessModal(orderNumber) {
  document.getElementById('orderNumber').textContent = orderNumber;
  document.getElementById('successModal').classList.add('active');
}

// Clear cart
function clearCart() {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Clear cart on server if user is logged in
  if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
    authManager.saveCartToServer(cart);
  }
}

// Send order confirmation (simulated)
function sendOrderConfirmation(orderData) {
  // In real implementation, this would send an email
  console.log('Order confirmation sent to:', orderData.customer.email);
}

// Modal functions
function showTerms() {
  document.getElementById('termsModal').classList.add('active');
}

function showPrivacy() {
  document.getElementById('privacyModal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => modal.classList.remove('active'));
  }
});

// Add to cart function (for use from other pages)
function addToCart(productId, quantity = 1) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity: quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show success message
  showCartNotification('Product added to cart!');
}

// Show cart notification
function showCartNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
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
  
  .rotating {
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
