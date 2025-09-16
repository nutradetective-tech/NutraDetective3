export const DEFAULT_SETTINGS = {
  userName: 'User',
  profileInitials: 'U',
  activeFilters: ['gluten-free', 'no-dyes', 'tree-nuts'],
  scanGoal: 5,
  dashboardStats: ['totalScans', 'healthyPercent', 'streak'],
  theme: 'light',
  notifications: true,
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
};