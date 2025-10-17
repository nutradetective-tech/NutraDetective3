// config/firebase.js
// Firebase Configuration for NutraDetective (Firebase Web SDK)

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjkGCKLiCu6C-lvt9lTO7b5DlfeFuHmgA",
  authDomain: "nutradetective-3df78.firebaseapp.com",
  projectId: "nutradetective-3df78",
  storageBucket: "nutradetective-3df78.firebasestorage.app",
  messagingSenderId: "818585731220",
  appId: "1:818585731220:web:8b1ea9d5f2a46cb584f481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const storage = getStorage(app);

// Initialize Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const firestore = getFirestore(app);

// Export config for reference
export const storageBucket = firebaseConfig.storageBucket;

export default app;