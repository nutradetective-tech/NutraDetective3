// services/PremiumService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = 'premiumStatus';
const SCAN_COUNTER_KEY = 'scanCounter';

/**
 * PremiumService - Manages premium subscription status and limits
 */
class PremiumService {
  
  /**
   * Check if user is a premium (Guardian) subscriber
   * @returns {Promise<boolean>}
   */
  static async isPremium() {
    try {
      const premiumData = await AsyncStorage.getItem(PREMIUM_KEY);
      if (!premiumData) return false;
      
      const data = JSON.parse(premiumData);
      
      // Check if subscription is still active
      if (data.expiresAt) {
        const now = new Date().getTime();
        if (now > data.expiresAt) {
          // Subscription expired
          await this.setPremium(false);
          return false;
        }
      }
      
      return data.isPremium === true;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Set premium status (for testing or after successful payment)
   * @param {boolean} isPremium 
   * @param {number} expiresAt - Timestamp when subscription expires (optional)
   */
  static async setPremium(isPremium, expiresAt = null) {
    try {
      const data = {
        isPremium,
        expiresAt,
        updatedAt: new Date().getTime()
      };
      await AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error setting premium status:', error);
      return false;
    }
  }

  /**
   * Get today's scan count for free users
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
      console.error('Error getting scan count:', error);
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
        date: today
      };
      
      await AsyncStorage.setItem(SCAN_COUNTER_KEY, JSON.stringify(data));
      return data.count;
    } catch (error) {
      console.error('Error incrementing scan counter:', error);
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
        date: today
      };
      await AsyncStorage.setItem(SCAN_COUNTER_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error resetting scan counter:', error);
    }
  }

  /**
   * Check if user can scan (for free users with daily limit)
   * @returns {Promise<{canScan: boolean, scansRemaining: number, message: string}>}
   */
  static async canScan() {
    const isPremium = await this.isPremium();
    
    // Premium users have unlimited scans
    if (isPremium) {
      return {
        canScan: true,
        scansRemaining: -1, // -1 means unlimited
        message: 'Unlimited scans'
      };
    }
    
    // Free users have 7 scans per day
    const FREE_DAILY_LIMIT = 7;
    const todayScans = await this.getTodayScans();
    const remaining = FREE_DAILY_LIMIT - todayScans;
    
    if (remaining <= 0) {
      return {
        canScan: false,
        scansRemaining: 0,
        message: 'Daily scan limit reached. Upgrade to Guardian for unlimited scans!'
      };
    }
    
    return {
      canScan: true,
      scansRemaining: remaining,
      message: `${remaining} scans remaining today`
    };
  }

  /**
   * Filter scan history based on premium status
   * Free users: Only last 30 days
   * Premium users: All history
   * @param {Array} history - Full scan history array
   * @returns {Promise<Array>} Filtered history
   */
  static async filterHistory(history) {
    const isPremium = await this.isPremium();
    
    // Premium users see all history
    if (isPremium) {
      return history;
    }
    
    // Free users only see last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffTime = thirtyDaysAgo.getTime();
    
    return history.filter(scan => {
      const scanDate = new Date(scan.date).getTime();
      return scanDate >= cutoffTime;
    });
  }

  /**
   * Get premium status summary for UI display
   * @returns {Promise<object>}
   */
  static async getPremiumStatus() {
    const isPremium = await this.isPremium();
    const todayScans = await this.getTodayScans();
    const scanLimit = await this.canScan();
    
    return {
      isPremium,
      tier: isPremium ? 'Guardian' : 'Seeker',
      todayScans,
      scansRemaining: scanLimit.scansRemaining,
      canScan: scanLimit.canScan,
      message: scanLimit.message
    };
  }

  /**
   * FOR TESTING: Activate premium for 30 days
   */
  static async activateTestPremium() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    await this.setPremium(true, thirtyDaysFromNow.getTime());
    console.log('✅ Test premium activated for 30 days');
    return true;
  }

  /**
   * FOR TESTING: Deactivate premium
   */
  static async deactivateTestPremium() {
    await this.setPremium(false);
    console.log('❌ Premium deactivated');
    return true;
  }
}

export default PremiumService;