// config/firebase.js
// Firebase Configuration for NutraDetective (Firebase Web SDK)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Web app configuration (for web/fallback)
const webConfig = {
  apiKey: "AIzaSyDjkGCKLiCu6C-lvt9lTO7b5DlfeFuHmgA",
  authDomain: "nutradetective-3df78.firebaseapp.com",
  projectId: "nutradetective-3df78",
  storageBucket: "nutradetective-3df78.firebasestorage.app",
  messagingSenderId: "818585731220",
  appId: "1:818585731220:web:8b1ea9d5f2a46cb584f481"
};

// Android app configuration (from Firebase Console)
const androidConfig = {
  apiKey: "AIzaSyDfWQ79c2ejePRleaSMemNth4dYPbqGXV8",
  authDomain: "nutradetective-3df78.firebaseapp.com",
  projectId: "nutradetective-3df78",
  storageBucket: "nutradetective-3df78.firebasestorage.app",
  messagingSenderId: "818585731220",
  appId: "1:818585731220:android:3b366101c8ac9dec84f481"
};

// Use Android config on Android, web config elsewhere
const firebaseConfig = Platform.OS === 'android' ? androidConfig : webConfig;

console.log('🔥 Initializing Firebase with config for platform:', Platform.OS);
console.log('📱 Using appId:', firebaseConfig.appId);

// Initialize Firebase (with duplicate check)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized (new)');
} else {
  app = getApp();
  console.log('✅ Firebase app already initialized (reusing)');
}

// Initialize services
export const storage = getStorage(app);

// Initialize Auth with duplicate check
let auth;
try {
  auth = getAuth(app);
  console.log('✅ Using existing Auth instance');
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Auth initialized with AsyncStorage persistence');
}

export { auth };
export const firestore = getFirestore(app);
export const storageBucket = firebaseConfig.storageBucket;

export default app;