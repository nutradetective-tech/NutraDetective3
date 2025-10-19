// services/SupabaseStorageService.js
// Supabase Storage Service for NutraDetective

import { supabase, STORAGE_BUCKET } from '../config/supabase';
import * as FileSystem from 'expo-file-system';

class SupabaseStorageService {

  // ===== CONNECTION TEST =====
  static async testConnection() {
    try {
      console.log('🔷 Testing Supabase Storage connection...');

      // List buckets to verify connection
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('❌ Supabase Storage connection failed:', error);
        return false;
      }

      console.log('✅ Supabase Storage connected successfully!');
      console.log('📦 Available buckets:', data?.map(b => b.name).join(', '));
      
      return true;
    } catch (error) {
      console.error('❌ Supabase Storage connection error:', error);
      return false;
    }
  }

  // ===== USER PROFILE PICTURES =====

  /**
   * Upload user profile picture from React Native URI
   * @param {string} userId - User ID (Supabase user.id)
   * @param {string} imageUri - Local image URI from ImagePicker
   * @returns {Promise<string>} Public URL
   */
  static async uploadProfilePicture(userId, imageUri) {
    try {
      console.log('📤 Starting profile picture upload...');
      console.log('👤 User ID:', userId);
      console.log('🖼 Image URI:', imageUri);

      // Validate parameters
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId parameter');
      }
      if (!imageUri || typeof imageUri !== 'string') {
        throw new Error('Invalid imageUri parameter');
      }

      // Read file as base64
      console.log('📖 Reading file...');
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to blob
      const blob = this.base64ToBlob(base64, 'image/jpeg');
      console.log('✅ Converted to Blob, size:', blob.size, 'bytes');

      // Create unique filename
      const filename = `profile-${Date.now()}.jpg`;
      const filePath = `${userId}/${filename}`;

      console.log('📦 Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true, // Replace if exists
        });

      if (error) {
        console.error('❌ Upload error:', error);
        throw error;
      }

      console.log('✅ Upload complete!');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      console.log('🔗 Public URL:', publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('❌ Profile picture upload failed:', error);
      throw new Error(`Failed to upload profile picture: ${error.message}`);
    }
  }

  /**
   * Convert base64 string to Blob
   * @param {string} base64 - Base64 string
   * @param {string} contentType - MIME type
   * @returns {Blob}
   */
  static base64ToBlob(base64, contentType = '') {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  /**
   * Delete user profile picture
   * @param {string} userId - User ID
   * @returns {Promise<boolean>}
   */
  static async deleteProfilePicture(userId) {
    try {
      // List all files for user
      const { data: files, error: listError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(userId);

      if (listError) throw listError;

      if (!files || files.length === 0) {
        console.log('ℹ️ No profile pictures to delete');
        return true;
      }

      // Delete all profile pictures for this user
      const filePaths = files.map(file => `${userId}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove(filePaths);

      if (deleteError) throw deleteError;

      console.log('✅ Profile pictures deleted for user:', userId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting profile picture:', error);
      return false;
    }
  }

  /**
   * Get profile picture URL
   * @param {string} userId - User ID
   * @returns {Promise<string|null>} Public URL or null
   */
  static async getProfilePicture(userId) {
    try {
      // List files for user
      const { data: files, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(userId);

      if (error || !files || files.length === 0) {
        return null;
      }

      // Get the most recent profile picture
      const latestFile = files
        .filter(f => f.name.startsWith('profile-'))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      if (!latestFile) return null;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${userId}/${latestFile.name}`);

      return publicUrl;
    } catch (error) {
      console.error('❌ Error getting profile picture:', error);
      return null;
    }
  }
}

export default SupabaseStorageService;