// constants/config.js
// App-wide configuration constants

export const DEFAULT_SETTINGS = {
  userName: 'User',
  profileInitials: 'U',
  activeFilters: ['gluten-free', 'no-dyes', 'tree-nuts'],
  scanGoal: 5,
  dashboardStats: ['totalScans', 'healthyPercent', 'streak'],
  theme: 'light',
  notifications: true,
  // NEW: Onboarding-related settings
  userMode: 'game', // 'game' or 'educational'
  isGuest: false,
};

export const TEST_BARCODES = {
  nutella: '3017620422003',
  cocaCola: '5449000000996', // European, has complete data
  cheerios: '0163009013719',
  dietCoke: '049000006131',
};

export const API_CONFIG = {
  openFoodFacts: 'https://world.openfoodfacts.org/api/v0/product/',
  usdaKey: '5QlF40l69GTeey5t3lPgc02BcWOthCTg6ZaAbZW9',
  nutritionixId: '393c1557',
  nutritionixKey: '6cefab30a7a318a0cfb93fa2263ec883',
};

export const APP_CONFIG = {
  splashDuration: 2000,
  historyLimit: 50,
  maxNameLength: 20,
  minGoal: 1,
  maxGoal: 50,
  borderRadius: 24,
  bottomNavHeight: 70,
  // NEW: Onboarding configuration
  showOnboarding: true, // Set to false to skip onboarding for testing
  onboardingVersion: 1, // Increment to force re-onboarding
};

// NEW: Guest user limitations
export const GUEST_CONFIG = {
  maxScansPerDay: 5,
  enableCloudBackup: false,
  enableLeaderboards: false,
  enableFamilyAccounts: false,
  showUpgradePromptsAfterDays: 7,
};

// NEW: User modes
export const USER_MODES = {
  GAME: 'game',
  EDUCATIONAL: 'educational',
};

export default {
  DEFAULT_SETTINGS,
  TEST_BARCODES,
  API_CONFIG,
  APP_CONFIG,
  GUEST_CONFIG,
  USER_MODES,
};