// services/UserSettingsService.js
// Updated to support guest users and user modes
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingService from './OnboardingService';

const DEFAULT_SETTINGS = {
  userName: 'User',
  profileInitials: 'U',
  activeFilters: ['gluten-free', 'no-dyes', 'tree-nuts'], // Match your mockup
  scanGoal: 5,
  dashboardStats: ['totalScans', 'healthyPercent', 'streak'],
  theme: 'light',
  notifications: true,
  // NEW: Onboarding-related settings
  userMode: 'game', // 'game' or 'educational'
  isGuest: false,
};

class UserSettingsService {
  static async getSettings() {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        return JSON.parse(settings);
      }
      
      // If no settings exist, check if onboarding was completed
      const onboardingComplete = await OnboardingService.hasCompletedOnboarding();
      if (onboardingComplete) {
        // Load mode from onboarding
        const mode = await OnboardingService.getUserMode();
        const isGuest = await OnboardingService.isGuestUser();
        
        const newSettings = {
          ...DEFAULT_SETTINGS,
          userMode: mode,
          isGuest: isGuest,
        };
        
        // Save and return
        await this.saveSettings(newSettings);
        return newSettings;
      }
      
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.log('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings) {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
      return true;
    } catch (error) {
      console.log('Error saving settings:', error);
      return false;
    }
  }

  static async updateSetting(key, value) {
    const settings = await this.getSettings();
    settings[key] = value;
    return await this.saveSettings(settings);
  }

  static async updateUserName(newName) {
    const settings = await this.getSettings();
    settings.userName = newName.trim() || 'User';
    
    // Update initials for avatar
    const names = newName.trim().split(' ');
    if (names.length >= 2) {
      settings.profileInitials = (names[0][0] + names[1][0]).toUpperCase();
    } else if (names[0]) {
      settings.profileInitials = names[0][0].toUpperCase();
    } else {
      settings.profileInitials = 'U';
    }
    
    return await this.saveSettings(settings);
  }

  static async toggleFilter(filterId) {
    const settings = await this.getSettings();
    const currentFilters = settings.activeFilters || [];
    
    if (currentFilters.includes(filterId)) {
      settings.activeFilters = currentFilters.filter(id => id !== filterId);
    } else {
      settings.activeFilters = [...currentFilters, filterId];
    }
    
    return await this.saveSettings(settings);
  }

  static async updateDashboardStats(newStats) {
    const settings = await this.getSettings();
    settings.dashboardStats = newStats;
    return await this.saveSettings(settings);
  }

  static async updateScanGoal(goal) {
    const settings = await this.getSettings();
    settings.scanGoal = Math.max(1, Math.min(50, goal)); // Between 1-50
    return await this.saveSettings(settings);
  }

  // ===== NEW: USER MODE MANAGEMENT =====

  /**
   * Get current user mode (game or educational)
   */
  static async getUserMode() {
    try {
      const settings = await this.getSettings();
      return settings.userMode || 'game';
    } catch (error) {
      console.log('Error getting user mode:', error);
      return 'game';
    }
  }

  /**
   * Update user mode
   */
  static async updateUserMode(newMode) {
    try {
      if (newMode !== 'game' && newMode !== 'educational') {
        throw new Error('Invalid mode. Must be "game" or "educational"');
      }

      const settings = await this.getSettings();
      settings.userMode = newMode;
      
      // Also update in OnboardingService
      await OnboardingService.updateUserMode(newMode);
      
      await this.saveSettings(settings);
      console.log('✅ User mode updated to:', newMode);
      return true;
    } catch (error) {
      console.log('Error updating user mode:', error);
      return false;
    }
  }

  // ===== NEW: GUEST USER MANAGEMENT =====

  /**
   * Check if current user is a guest
   */
  static async isGuestUser() {
    try {
      const settings = await this.getSettings();
      return settings.isGuest === true;
    } catch (error) {
      console.log('Error checking guest status:', error);
      return false;
    }
  }

  /**
   * Update guest status
   */
  static async updateGuestStatus(isGuest) {
    try {
      const settings = await this.getSettings();
      settings.isGuest = isGuest;
      return await this.saveSettings(settings);
    } catch (error) {
      console.log('Error updating guest status:', error);
      return false;
    }
  }

  /**
   * Convert guest to authenticated user
   */
  static async convertGuestToAuth() {
    try {
      const settings = await this.getSettings();
      settings.isGuest = false;
      
      // Also update in OnboardingService
      // Note: OnboardingService.convertGuestToAuth() would be called
      // from the auth flow, this just updates the settings
      
      await this.saveSettings(settings);
      console.log('✅ Guest converted to authenticated user in settings');
      return true;
    } catch (error) {
      console.log('Error converting guest:', error);
      return false;
    }
  }

  // ===== EXISTING METHODS =====

  static async clearAllSettings() {
    try {
      await AsyncStorage.removeItem('userSettings');
      return true;
    } catch (error) {
      console.log('Error clearing settings:', error);
      return false;
    }
  }

  static async exportSettings() {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  static async importSettings(settingsJson) {
    try {
      const settings = JSON.parse(settingsJson);
      return await this.saveSettings(settings);
    } catch (error) {
      console.log('Error importing settings:', error);
      return false;
    }
  }
}

export default UserSettingsService;