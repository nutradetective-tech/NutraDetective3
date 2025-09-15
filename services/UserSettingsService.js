// services/UserSettingsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_SETTINGS = {
  userName: 'User',
  profileInitials: 'U',
  activeFilters: ['gluten-free', 'no-dyes', 'tree-nuts'], // Match your mockup
  scanGoal: 5,
  dashboardStats: ['totalScans', 'healthyPercent', 'streak'],
  theme: 'light',
  notifications: true,
};

class UserSettingsService {
  static async getSettings() {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
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