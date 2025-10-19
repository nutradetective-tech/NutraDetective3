// services/SupabaseStorageService.js
// Supabase Storage Service for NutraDetective
// WORKING FIX: Uses FormData for file upload (React Native compatible)

import { supabase, STORAGE_BUCKET } from '../config/supabase';

class SupabaseStorageService {

  // ===== CONNECTION TEST =====
  static async testConnection() {
    try {
      console.log('📷 Testing Supabase Storage connection...');

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

      // Create FormData (React Native compatible)
      console.log('📦 Creating FormData...');
      const formData = new FormData();
      
      // Add file to FormData
      // React Native automatically handles local file URIs
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      console.log('✅ FormData created');

      // Create unique filename
      const filename = `profile-${Date.now()}.jpg`;
      const filePath = `${userId}/${filename}`;

      console.log('📦 Uploading to path:', filePath);

      // Get Supabase auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Upload using fetch with FormData
      const uploadUrl = `https://yimmcoegsjxfyhbcblig.supabase.co/storage/v1/object/${STORAGE_BUCKET}/${filePath}`;
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
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
   * Delete user profile picture
   * @param {string} userId - User ID
   * @returns {Promise<boolean>}
   */
  static async deleteProfilePicture(userId) {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(userId);

      if (listError) throw listError;

      if (!files || files.length === 0) {
        console.log('ℹ️ No profile pictures to delete');
        return true;
      }

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
      const { data: files, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(userId);

      if (error || !files || files.length === 0) {
        return null;
      }

      const latestFile = files
        .filter(f => f.name.startsWith('profile-'))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      if (!latestFile) return null;

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