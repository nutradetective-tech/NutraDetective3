// services/OnboardingService.js
// Core onboarding logic and state management for NutraDetective

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_ONBOARDING_STATE,
  STORAGE_KEYS,
  ONBOARDING_STEPS,
  MODES,
  AUTH_OPTIONS,
  GUEST_FEATURES,
  GUEST_UPGRADE_TRIGGERS,
  VALIDATION,
} from '../constants/onboarding';

class OnboardingService {
  // ===== ONBOARDING STATE MANAGEMENT =====

  /**
   * Check if user has completed onboarding
   */
  static async hasCompletedOnboarding() {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Get current onboarding state
   */
  static async getOnboardingState() {
    try {
      const stateJson = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_STATE);
      if (stateJson) {
        return JSON.parse(stateJson);
      }
      return { ...DEFAULT_ONBOARDING_STATE };
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      return { ...DEFAULT_ONBOARDING_STATE };
    }
  }

  /**
   * Save onboarding state
   */
  static async saveOnboardingState(state) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async completeOnboarding(finalState) {
    try {
      // Save final state
      await this.saveOnboardingState({
        ...finalState,
        completed: true,
        completedAt: new Date().toISOString(),
      });

      // Mark as completed
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');

      // Save user mode
      if (finalState.selectedMode) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_MODE, finalState.selectedMode);
      }

      // Save guest status
      await AsyncStorage.setItem(
        STORAGE_KEYS.IS_GUEST,
        finalState.isGuest ? 'true' : 'false'
      );

      console.log('✅ Onboarding completed successfully!');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }

  /**
   * Reset onboarding (for testing)
   */
  static async resetOnboarding() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ONBOARDING_STATE,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        STORAGE_KEYS.USER_MODE,
        STORAGE_KEYS.IS_GUEST,
        STORAGE_KEYS.GUEST_USER_ID,
      ]);
      console.log('🔄 Onboarding reset successfully');
      return true;
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      return false;
    }
  }

  // ===== GUEST USER MANAGEMENT =====

  /**
   * Check if current user is a guest
   */
  static async isGuestUser() {
    try {
      const isGuest = await AsyncStorage.getItem(STORAGE_KEYS.IS_GUEST);
      return isGuest === 'true';
    } catch (error) {
      console.error('Error checking guest status:', error);
      return false;
    }
  }

  /**
   * Initialize guest user
   */
  static async initializeGuestUser() {
    try {
      // Generate unique guest ID
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.IS_GUEST, 'true'],
        [STORAGE_KEYS.GUEST_USER_ID, guestId],
      ]);

      console.log('✅ Guest user initialized:', guestId);
      
      return {
        userId: guestId,
        isGuest: true,
        email: null,
      };
    } catch (error) {
      console.error('Error initializing guest user:', error);
      return null;
    }
  }

  /**
   * Get guest user ID
   */
  static async getGuestUserId() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.GUEST_USER_ID);
    } catch (error) {
      console.error('Error getting guest user ID:', error);
      return null;
    }
  }

  /**
   * Convert guest to authenticated user
   */
  static async convertGuestToAuth(userId, email) {
    try {
      // Get current guest data
      const guestId = await this.getGuestUserId();
      
      console.log('🔄 Converting guest to authenticated user...');
      console.log('Guest ID:', guestId);
      console.log('New User ID:', userId);

      // Update user status
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.IS_GUEST, 'false'],
        [STORAGE_KEYS.GUEST_USER_ID, ''], // Clear guest ID
      ]);

      console.log('✅ Successfully converted guest to authenticated user');
      
      return {
        userId,
        email,
        isGuest: false,
        previousGuestId: guestId,
      };
    } catch (error) {
      console.error('Error converting guest to auth:', error);
      return null;
    }
  }

  /**
   * Check if guest user can perform action
   */
  static async canGuestPerformAction(action) {
    const isGuest = await this.isGuestUser();
    if (!isGuest) {
      return { allowed: true };
    }

    // Check action against guest limitations
    switch (action) {
      case 'cloud_backup':
        return {
          allowed: false,
          reason: 'Guest users cannot use cloud backup',
          upgradeRequired: true,
        };
      
      case 'leaderboards':
        return {
          allowed: false,
          reason: 'Connect your account to access leaderboards',
          upgradeRequired: true,
        };
      
      case 'family_accounts':
        return {
          allowed: false,
          reason: 'Family accounts require authentication',
          upgradeRequired: true,
        };
      
      default:
        return { allowed: true };
    }
  }

  // ===== GUEST UPGRADE PROMPTS =====

  /**
   * Check if we should show upgrade prompt
   */
  static async shouldShowUpgradePrompt(trigger) {
    try {
      const isGuest = await this.isGuestUser();
      if (!isGuest) return false;

      // Get prompt history
      const promptCount = await AsyncStorage.getItem(
        `${STORAGE_KEYS.GUEST_UPGRADE_PROMPT_COUNT}_${trigger}`
      );
      const lastPromptDate = await AsyncStorage.getItem(
        `${STORAGE_KEYS.GUEST_LAST_PROMPT_DATE}_${trigger}`
      );

      // Don't show same prompt more than 3 times
      if (promptCount && parseInt(promptCount) >= 3) {
        return false;
      }

      // Don't show same prompt twice in 24 hours
      if (lastPromptDate) {
        const lastDate = new Date(lastPromptDate);
        const now = new Date();
        const hoursSince = (now - lastDate) / (1000 * 60 * 60);
        if (hoursSince < 24) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking upgrade prompt:', error);
      return false;
    }
  }

  /**
   * Record that upgrade prompt was shown
   */
  static async recordUpgradePrompt(trigger) {
    try {
      const countKey = `${STORAGE_KEYS.GUEST_UPGRADE_PROMPT_COUNT}_${trigger}`;
      const dateKey = `${STORAGE_KEYS.GUEST_LAST_PROMPT_DATE}_${trigger}`;

      // Increment count
      const currentCount = await AsyncStorage.getItem(countKey);
      const newCount = currentCount ? parseInt(currentCount) + 1 : 1;

      await AsyncStorage.multiSet([
        [countKey, newCount.toString()],
        [dateKey, new Date().toISOString()],
      ]);

      console.log(`📊 Upgrade prompt recorded: ${trigger} (${newCount} times)`);
    } catch (error) {
      console.error('Error recording upgrade prompt:', error);
    }
  }

  // ===== MODE MANAGEMENT =====

  /**
   * Get user's selected mode
   */
  static async getUserMode() {
    try {
      const mode = await AsyncStorage.getItem(STORAGE_KEYS.USER_MODE);
      return mode || MODES.GAME; // Default to Game Mode
    } catch (error) {
      console.error('Error getting user mode:', error);
      return MODES.GAME;
    }
  }

  /**
   * Update user mode
   */
  static async updateUserMode(newMode) {
    try {
      if (!Object.values(MODES).includes(newMode)) {
        throw new Error('Invalid mode');
      }

      await AsyncStorage.setItem(STORAGE_KEYS.USER_MODE, newMode);
      console.log('✅ User mode updated:', newMode);
      return true;
    } catch (error) {
      console.error('Error updating user mode:', error);
      return false;
    }
  }

  // ===== VALIDATION =====

  /**
   * Validate user name
   */
  static validateName(name) {
    if (!name || !name.trim()) {
      return {
        valid: false,
        error: 'Name is required',
      };
    }

    const trimmedName = name.trim();

    // Check length
    if (trimmedName.length < VALIDATION.NAME.minLength) {
      return {
        valid: false,
        error: VALIDATION.NAME.errorMessages.tooShort,
      };
    }

    if (trimmedName.length > VALIDATION.NAME.maxLength) {
      return {
        valid: false,
        error: VALIDATION.NAME.errorMessages.tooLong,
      };
    }

    // Check pattern
    if (!VALIDATION.NAME.pattern.test(trimmedName)) {
      return {
        valid: false,
        error: VALIDATION.NAME.errorMessages.invalid,
      };
    }

    return {
      valid: true,
      name: trimmedName,
    };
  }

  // ===== PROGRESS TRACKING =====

  /**
   * Update current step
   */
  static async updateCurrentStep(step) {
    try {
      const state = await this.getOnboardingState();
      state.currentStep = step;
      await this.saveOnboardingState(state);
      return true;
    } catch (error) {
      console.error('Error updating current step:', error);
      return false;
    }
  }

  /**
   * Save user name
   */
  static async saveUserName(name) {
    try {
      const validation = this.validateName(name);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const state = await this.getOnboardingState();
      state.userName = validation.name;
      await this.saveOnboardingState(state);

      console.log('✅ User name saved:', validation.name);
      return { success: true, name: validation.name };
    } catch (error) {
      console.error('Error saving user name:', error);
      return { success: false, error: 'Failed to save name' };
    }
  }

  /**
   * Save selected mode
   */
  static async saveSelectedMode(mode) {
    try {
      if (!Object.values(MODES).includes(mode)) {
        return { success: false, error: 'Invalid mode' };
      }

      const state = await this.getOnboardingState();
      state.selectedMode = mode;
      await this.saveOnboardingState(state);

      console.log('✅ Mode selected:', mode);
      return { success: true, mode };
    } catch (error) {
      console.error('Error saving mode:', error);
      return { success: false, error: 'Failed to save mode' };
    }
  }

  /**
   * Complete authentication step
   */
  static async completeAuthStep(authType, userId = null, email = null) {
    try {
      const state = await this.getOnboardingState();
      
      if (authType === AUTH_OPTIONS.GUEST) {
        // Initialize as guest
        state.isGuest = true;
        const guestUser = await this.initializeGuestUser();
        
        if (!guestUser) {
          return { success: false, error: 'Failed to initialize guest user' };
        }
      } else {
        // Authenticated user
        state.isGuest = false;
        state.userId = userId;
        state.email = email;
      }

      // Mark onboarding as complete
      await this.completeOnboarding(state);

      console.log('✅ Auth step completed:', authType);
      return { success: true, authType, isGuest: state.isGuest };
    } catch (error) {
      console.error('Error completing auth step:', error);
      return { success: false, error: 'Failed to complete authentication' };
    }
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Get complete user info
   */
  static async getUserInfo() {
    try {
      const isGuest = await this.isGuestUser();
      const mode = await this.getUserMode();
      const completed = await this.hasCompletedOnboarding();

      if (isGuest) {
        const guestId = await this.getGuestUserId();
        return {
          isGuest: true,
          userId: guestId,
          email: null,
          mode,
          onboardingCompleted: completed,
        };
      } else {
        // Would get from Supabase auth in production
        return {
          isGuest: false,
          userId: null,
          email: null,
          mode,
          onboardingCompleted: completed,
        };
      }
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  /**
   * Export onboarding data (for debugging)
   */
  static async exportData() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      const data = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        data[key] = value;
      }

      console.log('📊 Onboarding data exported:', data);
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }
}

export default OnboardingService;