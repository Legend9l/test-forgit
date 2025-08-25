// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "luxe-shop-xxxxx.firebaseapp.com",
  projectId: "luxe-shop-xxxxx",
  storageBucket: "luxe-shop-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Enable Firestore persistence
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed - multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported');
    }
  }); 