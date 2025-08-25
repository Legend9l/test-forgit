# Luxe Shop - Backend Authentication System

A comprehensive e-commerce platform for digital gaming products with a full backend authentication system built with Firebase.

## 🚀 Features

### Authentication System
- **User Registration**: Complete registration with email, password, name, and phone
- **User Login**: Secure email/password authentication
- **Password Reset**: Email-based password reset functionality
- **User Profiles**: Editable user profiles with personal information
- **Session Management**: Persistent login sessions with automatic logout

### Cart & Order Management
- **Synchronized Cart**: Cart data syncs between local storage and server
- **Order History**: Complete order tracking and history
- **Order Processing**: Secure order processing with payment methods
- **Real-time Updates**: Live cart and order status updates

### User Dashboard
- **Personal Dashboard**: User-specific dashboard with stats and actions
- **Order Tracking**: View and manage all orders
- **Profile Management**: Edit personal information and security settings
- **Quick Actions**: Fast access to common user actions

### Security Features
- **Firebase Authentication**: Industry-standard authentication
- **Data Encryption**: Secure data transmission and storage
- **Session Security**: Protected routes and secure sessions
- **Input Validation**: Comprehensive form validation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore)
- **Database**: Cloud Firestore (NoSQL)
- **Hosting**: Firebase Hosting
- **Security**: Firebase Security Rules

## 📁 Project Structure

```
files/
├── index.html              # Main landing page
├── keys.html               # Game keys page
├── top-up.html             # Top-up products page
├── order.html              # Checkout page
├── dashboard.html          # User dashboard
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript functionality
├── auth.js                 # Authentication manager
├── auth-functions.js       # Authentication UI functions
├── dashboard.js            # Dashboard functionality
├── firebase-config.js      # Firebase configuration
├── support-faq.json        # Support FAQ data
├── products.json           # Product data
├── keys.json              # Game keys data
├── topups.json            # Top-up data
└── images/                # Image assets
```

## 🔧 Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Get your Firebase configuration

### 2. Configuration

Update `files/firebase-config.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own carts
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. Deploy

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Deploy: `firebase deploy`

## 🔐 Authentication Flow

### Registration Process
1. User fills registration form
2. Firebase creates user account
3. User profile created in Firestore
4. Welcome email sent (optional)
5. User redirected to dashboard

### Login Process
1. User enters credentials
2. Firebase validates authentication
3. User session established
4. Cart data synced from server
5. User redirected to dashboard

### Cart Synchronization
1. Local cart stored in localStorage
2. Server cart stored in Firestore
3. Automatic sync on login/logout
4. Conflict resolution (local takes priority)

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  displayName: "User Name",
  phone: "+1234567890",
  createdAt: timestamp,
  updatedAt: timestamp,
  role: "customer"
}
```

### Carts Collection
```javascript
{
  userId: "user-id",
  items: [
    {
      id: "product-id",
      name: "Product Name",
      price: 29.99,
      quantity: 1
    }
  ],
  updatedAt: timestamp
}
```

### Orders Collection
```javascript
{
  userId: "user-id",
  userEmail: "user@example.com",
  customer: {
    firstName: "John",
    lastName: "Doe",
    email: "user@example.com",
    phone: "+1234567890"
  },
  payment: {
    method: "paypal",
    // payment details
  },
  order: {
    items: [...],
    subtotal: 29.99,
    tax: 1.50,
    discount: 0,
    total: 31.49
  },
  status: "pending",
  createdAt: timestamp
}
```

## 🎨 UI Components

### Authentication Modals
- Login Modal
- Registration Modal
- Profile Management Modal
- Password Reset Modal
- Order History Modal

### Dashboard Cards
- Profile Information
- Quick Statistics
- Recent Orders
- Quick Actions
- Security Status

## 🔒 Security Features

- **Input Validation**: All forms validated client and server-side
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Firebase handles CSRF protection
- **Rate Limiting**: Firebase provides rate limiting
- **Secure Headers**: Firebase Hosting provides security headers

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Adaptive modals
- Touch-friendly interfaces
- Cross-browser compatibility

## 🚀 Performance Features

- **Lazy Loading**: Images and components load on demand
- **Caching**: Firebase provides automatic caching
- **CDN**: Firebase Hosting uses global CDN
- **Optimization**: Minified assets and optimized images

## 🔧 Customization

### Adding New Features
1. Create new HTML page or component
2. Add corresponding JavaScript functionality
3. Update navigation if needed
4. Add Firebase integration if required

### Styling
- Modify `styles.css` for global styles
- Add component-specific styles in respective files
- Use CSS custom properties for theming

### Authentication
- Extend `auth.js` for additional auth methods
- Modify `auth-functions.js` for UI changes
- Update Firebase security rules as needed

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**
   - Check Firebase configuration
   - Ensure scripts are loaded in correct order

2. **Authentication errors**
   - Verify Firebase Authentication is enabled
   - Check security rules

3. **Cart sync issues**
   - Clear localStorage and try again
   - Check network connectivity

4. **Order processing errors**
   - Verify Firestore permissions
   - Check order data structure

## 📞 Support

For technical support or questions:
- Check the live support system in the app
- Review Firebase documentation
- Contact development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using Firebase and modern web technologies** 