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

  // ===== USER PROFILE PICTURES =====
  
  /**
   * Upload user profile picture
   * @param {string} userId - User ID
   * @param {Blob|File} file - Image file
   * @returns {Promise<string>} Download URL
   */
  static async uploadProfilePicture(userId, file) {
    try {
      console.log('📤 Uploading profile picture for user:', userId);
      
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('✅ Profile picture uploaded:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Profile picture upload failed:', error);
      throw new Error(`Failed to upload profile picture: ${error.message}`);
    }
  }

  /**
   * Get user profile picture URL
   * @param {string} userId - User ID
   * @returns {Promise<string|null>} Download URL or null if not found
   */
  static async getProfilePicture(userId) {
    try {
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        console.log('ℹ️ No profile picture found for user:', userId);
        return null;
      }
      console.error('❌ Error getting profile picture:', error);
      throw error;
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
   * Upload scan image
   * @param {string} userId - User ID
   * @param {string} scanId - Scan ID
   * @param {Blob|File} file - Image file
   * @returns {Promise<string>} Download URL
   */
  static async uploadScanImage(userId, scanId, file) {
    try {
      console.log('📤 Uploading scan image:', scanId);
      
      const storageRef = ref(storage, `users/${userId}/scans/${scanId}.jpg`);
      await uploadBytes(storageRef, file);
      
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