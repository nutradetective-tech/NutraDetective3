// services/PremiumService.js
// NutraDetective Premium Service - 3-Tier Subscription System
// Version 3.1 - WITH REVENUCAT INTEGRATION + TEST MODE FIX
// Free, Plus ($4.99), Pro ($9.99)

import AsyncStorage from '@react-native-async-storage/async-storage';
import RevenueCatService from './RevenueCatService';

// AsyncStorage Keys
const PREMIUM_KEY = 'premiumStatus';
const SCAN_COUNTER_KEY = 'scanCounter';
const TEST_MODE_KEY = 'testMode'; // NEW: Track if in test mode

// Subscription Tiers
const TIERS = {
  FREE: 'free',
  PLUS: 'plus',
  PRO: 'pro'
};

// Tier Limits
const TIER_LIMITS = {
  [TIERS.FREE]: {
    scansPerDay: 7,
    historyDays: 7,
    features: ['Basic A-F grading', 'Top 8 allergens', '7-day history']
  },
  [TIERS.PLUS]: {
    scansPerDay: 25,
    historyDays: 30,
    features: ['25 scans/day', 'ADHD additive alerts', '100+ allergen database', '30-day history', 'Alternative suggestions']
  },
  [TIERS.PRO]: {
    scansPerDay: -1, // -1 = unlimited
    historyDays: -1, // -1 = unlimited
    features: ['Unlimited scans', 'Family sharing (5 accounts)', 'Unlimited history', 'Priority support', 'Store leaderboards']
  }
};

/**
 * PremiumService - Manages 3-tier subscription system WITH RevenueCat
 * Free: 7 scans/day, 7-day history
 * Plus ($4.99/mo): 25 scans/day, 30-day history, ADHD alerts
 * Pro ($9.99/mo): Unlimited scans, unlimited history, family sharing
 */
class PremiumService {

  // ===== TEST MODE MANAGEMENT =====

  /**
   * Check if in test mode
   */
  static async isTestMode() {
    try {
      const testMode = await AsyncStorage.getItem(TEST_MODE_KEY);
      return testMode === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Enable test mode (bypasses RevenueCat)
   */
  static async enableTestMode() {
    try {
      await AsyncStorage.setItem(TEST_MODE_KEY, 'true');
      console.log('🧪 Test mode ENABLED - RevenueCat sync disabled');
    } catch (error) {
      console.error('❌ Error enabling test mode:', error);
    }
  }

  /**
   * Disable test mode (re-enables RevenueCat)
   */
  static async disableTestMode() {
    try {
      await AsyncStorage.removeItem(TEST_MODE_KEY);
      console.log('✅ Test mode DISABLED - RevenueCat sync enabled');
      // Immediately sync with RevenueCat
      await this.syncWithRevenueCat();
    } catch (error) {
      console.error('❌ Error disabling test mode:', error);
    }
  }

  // ===== REVENUCAT INTEGRATION =====

  /**
   * Initialize premium service and sync with RevenueCat
   */
  static async initialize() {
    try {
      console.log('💳 Initializing PremiumService with RevenueCat...');

      // Check if in test mode
      const inTestMode = await this.isTestMode();
      if (inTestMode) {
        console.log('🧪 In test mode - skipping RevenueCat sync');
        const tier = await this.getCachedTier();
        console.log('✅ PremiumService initialized (TEST MODE). Tier:', tier.toUpperCase());
        return tier;
      }

      // Sync with RevenueCat to get real subscription status
      const tier = await this.syncWithRevenueCat();

      console.log('✅ PremiumService initialized. Tier:', tier.toUpperCase());
      return tier;
    } catch (error) {
      console.error('❌ Error initializing PremiumService:', error);
      // Fall back to cached tier
      return await this.getCachedTier();
    }
  }

  /**
   * Sync with RevenueCat to get real subscription status
   */
  static async syncWithRevenueCat() {
    try {
      // Skip if in test mode
      const inTestMode = await this.isTestMode();
      if (inTestMode) {
        console.log('🧪 Test mode active - skipping RevenueCat sync');
        return await this.getCachedTier();
      }

      const customerInfo = await RevenueCatService.getCustomerInfo();
      const status = RevenueCatService.getSubscriptionStatus(customerInfo);

      // Update local tier based on RevenueCat
      const tier = status.tier;
      const expiresAt = status.expirationDate ? new Date(status.expirationDate).getTime() : null;

      await this.setTier(tier, expiresAt);

      console.log('🔄 Synced with RevenueCat:', tier.toUpperCase());
      return tier;
    } catch (error) {
      console.error('❌ RevenueCat sync failed:', error);
      return await this.getCachedTier();
    }
  }

  /**
   * Get cached tier from AsyncStorage (offline fallback)
   */
  static async getCachedTier() {
    try {
      const premiumData = await AsyncStorage.getItem(PREMIUM_KEY);
      if (!premiumData) return TIERS.FREE;

      const data = JSON.parse(premiumData);

      // Validate tier
      if (!Object.values(TIERS).includes(data.tier)) {
        return TIERS.FREE;
      }

      return data.tier;
    } catch (error) {
      console.error('❌ Error getting cached tier:', error);
      return TIERS.FREE;
    }
  }

  // ===== TIER MANAGEMENT =====

  /**
   * Get user's current subscription tier
   * Checks RevenueCat first (unless in test mode), falls back to cache
   * @returns {Promise<string>} 'free', 'plus', or 'pro'
   */
  static async getTier() {
    try {
      // Check if in test mode
      const inTestMode = await this.isTestMode();
      if (inTestMode) {
        // In test mode: just return cached tier, don't sync
        return await this.getCachedTier();
      }

      // Not in test mode: try to sync with RevenueCat
      const tier = await this.syncWithRevenueCat();
      return tier;
    } catch (error) {
      // Fall back to cached tier (offline)
      console.log('⚠️ Using cached tier (offline mode)');
      return await this.getCachedTier();
    }
  }

  /**
   * Set user's subscription tier
   * @param {string} tier - 'free', 'plus', or 'pro'
   * @param {number} expiresAt - Timestamp when subscription expires (optional)
   * @returns {Promise<boolean>}
   */
  static async setTier(tier, expiresAt = null) {
    try {
      if (!Object.values(TIERS).includes(tier)) {
        console.error('❌ Invalid tier:', tier);
        return false;
      }

      const data = {
        tier,
        expiresAt,
        updatedAt: new Date().getTime()
      };

      await AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
      console.log(`✅ Tier set to: ${tier.toUpperCase()}`);
      return true;
    } catch (error) {
      console.error('❌ Error setting tier:', error);
      return false;
    }
  }

  /**
   * Check if user has premium access (Plus or Pro)
   * @returns {Promise<boolean>}
   */
  static async isPremium() {
    const tier = await this.getTier();
    return tier === TIERS.PLUS || tier === TIERS.PRO;
  }

  /**
   * Check if user is on specific tier
   * @param {string} tierToCheck - 'free', 'plus', or 'pro'
   * @returns {Promise<boolean>}
   */
  static async isTier(tierToCheck) {
    const currentTier = await this.getTier();
    return currentTier === tierToCheck;
  }

  // ===== SCAN LIMITING =====

  /**
   * Get today's scan count
   * @returns {Promise<number>}
   */
  static async getTodayScans() {
    try {
      const counterData = await AsyncStorage.getItem(SCAN_COUNTER_KEY);
      if (!counterData) return 0;

      const data = JSON.parse(counterData);
      const today = new Date().toDateString();

      // Reset counter if it's a new day
      if (data.date !== today) {
        await this.resetScanCounter();
        return 0;
      }

      return data.count || 0;
    } catch (error) {
      console.error('❌ Error getting scan count:', error);
      return 0;
    }
  }

  /**
   * Increment today's scan count
   * @returns {Promise<number>} New scan count
   */
  static async incrementScanCounter() {
    try {
      const currentCount = await this.getTodayScans();
      const today = new Date().toDateString();

      const data = {
        count: currentCount + 1,
        date: today,
        lastScanAt: new Date().getTime()
      };

      await AsyncStorage.setItem(SCAN_COUNTER_KEY, JSON.stringify(data));
      console.log(`📊 Scan count incremented: ${data.count}`);
      return data.count;
    } catch (error) {
      console.error('❌ Error incrementing scan counter:', error);
      return 0;
    }
  }

  /**
   * Reset scan counter (called automatically at midnight)
   */
  static async resetScanCounter() {
    try {
      const today = new Date().toDateString();
      const data = {
        count: 0,
        date: today,
        resetAt: new Date().getTime()
      };
      await AsyncStorage.setItem(SCAN_COUNTER_KEY, JSON.stringify(data));
      console.log('🔄 Scan counter reset for new day');
    } catch (error) {
      console.error('❌ Error resetting scan counter:', error);
    }
  }

  /**
   * Check if user can scan based on their tier
   * @returns {Promise<{canScan: boolean, scansRemaining: number, tier: string, message: string}>}
   */
  static async canScan() {
    const tier = await this.getTier();
    const limits = TIER_LIMITS[tier];
    const todayScans = await this.getTodayScans();

    // Pro tier: Unlimited scans
    if (tier === TIERS.PRO) {
      return {
        canScan: true,
        scansRemaining: -1, // -1 = unlimited
        tier: TIERS.PRO,
        message: '✨ Unlimited scans (Pro)'
      };
    }

    // Plus tier: 25 scans/day
    if (tier === TIERS.PLUS) {
      const remaining = limits.scansPerDay - todayScans;

      if (remaining <= 0) {
        return {
          canScan: false,
          scansRemaining: 0,
          tier: TIERS.PLUS,
          message: 'Daily scan limit reached (25/25). Upgrade to Pro for unlimited scans!'
        };
      }

      return {
        canScan: true,
        scansRemaining: remaining,
        tier: TIERS.PLUS,
        message: `${remaining} scans remaining today (Plus)`
      };
    }

    // Free tier: 7 scans/day
    const remaining = limits.scansPerDay - todayScans;

    if (remaining <= 0) {
      return {
        canScan: false,
        scansRemaining: 0,
        tier: TIERS.FREE,
        message: 'Daily scan limit reached (7/7). Upgrade to Plus for 25 scans/day or Pro for unlimited!'
      };
    }

    // Warning when close to limit
    let message = `${remaining} scans remaining today`;
    if (remaining <= 2) {
      message += ' - Consider upgrading to Plus or Pro!';
    }

    return {
      canScan: true,
      scansRemaining: remaining,
      tier: TIERS.FREE,
      message
    };
  }

  // ===== HISTORY FILTERING =====

  /**
   * Filter scan history based on tier limits
   * Free: 7 days, Plus: 30 days, Pro: Unlimited
   * @param {Array} history - Full scan history array
   * @returns {Promise<Array>} Filtered history
   */
  static async filterHistory(history) {
    const tier = await this.getTier();
    const limits = TIER_LIMITS[tier];

    // Pro tier: Unlimited history
    if (limits.historyDays === -1) {
      return history;
    }

    // Filter by days limit
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - limits.historyDays);
    const cutoffTime = cutoffDate.getTime();

    const filtered = history.filter(scan => {
      const scanDate = new Date(scan.date).getTime();
      return scanDate >= cutoffTime;
    });

    console.log(`📊 History filtered: ${filtered.length}/${history.length} scans (${tier} - ${limits.historyDays} days)`);
    return filtered;
  }

  // ===== FEATURE ACCESS =====

  /**
   * Check if user has access to ADHD additive alerts (Plus/Pro only)
   * @returns {Promise<boolean>}
   */
  static async hasAdhdAlerts() {
    const tier = await this.getTier();
    return tier === TIERS.PLUS || tier === TIERS.PRO;
  }

  /**
   * Check if user has access to advanced allergen database (Plus/Pro only)
   * @returns {Promise<boolean>}
   */
  static async hasAdvancedAllergens() {
    const tier = await this.getTier();
    return tier === TIERS.PLUS || tier === TIERS.PRO;
  }

  /**
   * Check if user has access to family sharing (Pro only)
   * @returns {Promise<boolean>}
   */
  static async hasFamilySharing() {
    const tier = await this.getTier();
    return tier === TIERS.PRO;
  }

  /**
   * Get all features available to user's tier
   * @returns {Promise<Array<string>>}
   */
  static async getAvailableFeatures() {
    const tier = await this.getTier();
    return TIER_LIMITS[tier].features;
  }

  // ===== STATUS SUMMARY =====

  /**
   * Get complete premium status for UI display
   * @returns {Promise<object>}
   */
  static async getStatus() {
    const tier = await this.getTier();
    const todayScans = await this.getTodayScans();
    const scanCheck = await this.canScan();
    const limits = TIER_LIMITS[tier];

    return {
      // Tier info
      tier,
      tierName: tier.charAt(0).toUpperCase() + tier.slice(1),
      isPremium: tier === TIERS.PLUS || tier === TIERS.PRO,
      isPro: tier === TIERS.PRO,
      isPlus: tier === TIERS.PLUS,
      isFree: tier === TIERS.FREE,

      // Scan limits
      todayScans,
      scansRemaining: scanCheck.scansRemaining,
      scanLimit: limits.scansPerDay,
      canScan: scanCheck.canScan,
      message: scanCheck.message,

      // History limits
      historyDays: limits.historyDays,
      hasUnlimitedHistory: limits.historyDays === -1,

      // Feature access
      hasAdhdAlerts: tier === TIERS.PLUS || tier === TIERS.PRO,
      hasAdvancedAllergens: tier === TIERS.PLUS || tier === TIERS.PRO,
      hasFamilySharing: tier === TIERS.PRO,
      features: limits.features
    };
  }

  // ===== TESTING FUNCTIONS =====

  /**
   * FOR TESTING: Set tier to Free
   */
  static async setTestFree() {
    await this.enableTestMode(); // Enable test mode
    await this.setTier(TIERS.FREE);
    await this.resetScanCounter();
    console.log('🆓 Test tier set to FREE (7 scans/day, 7-day history)');
    return await this.getStatus();
  }

  /**
   * FOR TESTING: Set tier to Plus ($4.99/mo)
   */
  static async setTestPlus(daysValid = 30) {
    await this.enableTestMode(); // Enable test mode
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);
    await this.setTier(TIERS.PLUS, expiresAt.getTime());
    await this.resetScanCounter();
    console.log(`⭐ Test tier set to PLUS (25 scans/day, 30-day history, ${daysValid} days)`);
    return await this.getStatus();
  }

  /**
   * FOR TESTING: Set tier to Pro ($9.99/mo)
   */
  static async setTestPro(daysValid = 30) {
    await this.enableTestMode(); // Enable test mode
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);
    await this.setTier(TIERS.PRO, expiresAt.getTime());
    await this.resetScanCounter();
    console.log(`👑 Test tier set to PRO (unlimited scans, unlimited history, ${daysValid} days)`);
    return await this.getStatus();
  }

  /**
   * FOR TESTING: Add scans to counter (to test limits)
   */
  static async addTestScans(count) {
    try {
      const today = new Date().toDateString();
      const currentCount = await this.getTodayScans();

      const data = {
        count: currentCount + count,
        date: today,
        lastScanAt: new Date().getTime()
      };

      await AsyncStorage.setItem(SCAN_COUNTER_KEY, JSON.stringify(data));
      console.log(`📊 Added ${count} test scans (total: ${data.count})`);
      return data.count;
    } catch (error) {
      console.error('❌ Error adding test scans:', error);
      return 0;
    }
  }

  /**
   * FOR TESTING: Clear all premium data
   */
  static async clearAll() {
    try {
      await AsyncStorage.removeItem(PREMIUM_KEY);
      await AsyncStorage.removeItem(SCAN_COUNTER_KEY);
      await AsyncStorage.removeItem(TEST_MODE_KEY);
      console.log('🧹 All premium data cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return false;
    }
  }

  /**
   * FOR TESTING: Log current status to console
   */
  static async logStatus() {
    const status = await this.getStatus();
    const inTestMode = await this.isTestMode();
    
    console.log('╔═══════════════════════════════════════╗');
    console.log('📊 NUTRADETECTIVE PREMIUM STATUS');
    if (inTestMode) {
      console.log('🧪 TEST MODE ACTIVE');
    }
    console.log('╠═══════════════════════════════════════╣');
    console.log(`Tier: ${status.tierName.toUpperCase()}`);
    console.log(`Today's Scans: ${status.todayScans}${status.scanLimit === -1 ? ' (unlimited)' : `/${status.scanLimit}`}`);
    console.log(`Scans Remaining: ${status.scansRemaining === -1 ? 'Unlimited' : status.scansRemaining}`);
    console.log(`Can Scan: ${status.canScan ? '✅ YES' : '❌ NO'}`);
    console.log(`History Days: ${status.historyDays === -1 ? 'Unlimited' : `${status.historyDays} days`}`);
    console.log(`ADHD Alerts: ${status.hasAdhdAlerts ? '✅' : '❌'}`);
    console.log(`Advanced Allergens: ${status.hasAdvancedAllergens ? '✅' : '❌'}`);
    console.log(`Family Sharing: ${status.hasFamilySharing ? '✅' : '❌'}`);
    console.log('╠═══════════════════════════════════════╣');
    console.log(`Message: ${status.message}`);
    console.log('╚═══════════════════════════════════════╝');
    return status;
  }
}

// Export tier constants for use in other files
export { TIERS, TIER_LIMITS };
export default PremiumService;