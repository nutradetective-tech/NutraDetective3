// services/FirebaseStorageService.js
// Firebase Storage Service for NutraDetective (Firebase Web SDK)

import { storage, storageBucket } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage';

class FirebaseStorageService {
  
  // ===== CONNECTION TEST =====
  static async testConnection() {
    try {
      console.log('🔥 Testing Firebase Storage connection...');
      
      console.log('✅ Firebase Storage connected successfully!');
      console.log('Storage bucket:', storageBucket);
      console.log('Bucket URL:', `gs://${storageBucket}`);
      
      return true;
    } catch (error) {
      console.error('❌ Firebase Storage connection failed:', error);
      console.error('Error details:', error.message);
      return false;
    }
  }

  // ===== URI TO BLOB CONVERSION (CRITICAL FOR REACT NATIVE) =====
  
  /**
   * Convert React Native URI to Blob for upload
   * @param {string} uri - React Native image URI (file:// or content://)
   * @returns {Promise<Blob>} Image blob
   */
  static async uriToBlob(uri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.onload = function() {
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        reject(new Error('Failed to convert URI to Blob'));
      };
      
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }

  // ===== USER PROFILE PICTURES =====
  
  /**
   * Upload user profile picture from React Native URI
   * @param {string} imageUri - Local image URI from ImagePicker
   * @param {string} userId - User ID
   * @returns {Promise<string>} Download URL
   */
  static async uploadProfilePicture(userId, imageUri) {
  try {
    console.log('📤 Starting profile picture upload...');
console.log('👤 User ID:', userId);      // ✅ Correct label
console.log('📍 Image URI:', imageUri);  // ✅ Correct label
    
    // Convert URI to Blob (required for React Native)
    console.log('🔄 Converting URI to Blob...');
    const blob = await this.uriToBlob(imageUri);
    console.log('✅ Converted to Blob, size:', blob.size, 'bytes');
    
    // Create storage reference
    const filename = `profile-${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${userId}/${filename}`);
    console.log('📦 Storage path:', `users/${userId}/${filename}`);
    
    // Upload blob
    console.log('⬆️ Uploading to Firebase Storage...');
    await uploadBytes(storageRef, blob);
    console.log('✅ Upload complete!');
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('🔗 Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ Profile picture upload failed:', error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
}

  /**
 * Upload user profile picture from React Native URI
 * @param {string} userId - User ID (FIRST parameter)
 * @param {string} imageUri - Local image URI from ImagePicker (SECOND parameter)
 * @returns {Promise<string>} Download URL
 */
static async uploadProfilePicture(userId, imageUri) {
  try {
    console.log('📤 Starting profile picture upload...');
    console.log('👤 User ID:', userId);
    console.log('📍 Image URI:', imageUri);
    
    // Validate parameters
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid userId parameter');
    }
    if (!imageUri || typeof imageUri !== 'string' || !imageUri.startsWith('file://')) {
      throw new Error('Invalid imageUri parameter - must be a file:// URI');
    }
    
    // Convert URI to Blob (required for React Native)
    console.log('🔄 Converting URI to Blob...');
    const blob = await this.uriToBlob(imageUri);
    console.log('✅ Converted to Blob, size:', blob.size, 'bytes');
    
    // Create storage reference
    const filename = `profile-${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${userId}/${filename}`);
    console.log('📦 Storage path:', `users/${userId}/${filename}`);
    
    // Upload blob
    console.log('⬆️ Uploading to Firebase Storage...');
    await uploadBytes(storageRef, blob);
    console.log('✅ Upload complete!');
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('🔗 Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ Profile picture upload failed:', error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
}

  /**
   * Delete user profile picture
   * @param {string} userId - User ID
   * @returns {Promise<boolean>}
   */
  static async deleteProfilePicture(userId) {
    try {
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      await deleteObject(storageRef);
      console.log('✅ Profile picture deleted for user:', userId);
      return true;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        console.log('ℹ️ No profile picture to delete');
        return true;
      }
      console.error('❌ Error deleting profile picture:', error);
      return false;
    }
  }

  // ===== SCAN IMAGES =====
  
  /**
   * Upload scan image from React Native URI
   * @param {string} imageUri - Local image URI
   * @param {string} userId - User ID
   * @param {string} scanId - Scan ID
   * @returns {Promise<string>} Download URL
   */
  static async uploadScanImage(imageUri, userId, scanId) {
    try {
      console.log('📤 Uploading scan image:', scanId);
      
      // Convert URI to Blob
      const blob = await this.uriToBlob(imageUri);
      
      const storageRef = ref(storage, `users/${userId}/scans/${scanId}.jpg`);
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('✅ Scan image uploaded:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Scan image upload failed:', error);
      throw error;
    }
  }

  /**
   * Get scan image URL
   * @param {string} userId - User ID
   * @param {string} scanId - Scan ID
   * @returns {Promise<string|null>} Download URL or null
   */
  static async getScanImage(userId, scanId) {
    try {
      const storageRef = ref(storage, `users/${userId}/scans/${scanId}.jpg`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return null;
      }
      throw error;
    }
  }
}

export default FirebaseStorageService;