import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Key (same for iOS and Android)
const REVENUECAT_API_KEY = 'goog_VmVdYrvjIIRvUOzUjyMnrfLPGkj';

class RevenueCatService {
  static isInitialized = false;

  /**
   * Initialize RevenueCat SDK
   * Call this once when app starts
   */
  static async initialize(userId = null) {
    try {
      if (this.isInitialized) {
        console.log('💳 RevenueCat already initialized');
        return;
      }

      console.log('💳 Initializing RevenueCat...');
      
      // Configure SDK
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserID: userId, // Optional: pass Supabase user ID for tracking
      });

      this.isInitialized = true;
      console.log('✅ RevenueCat initialized successfully');

      // Set debug logs (disable in production)
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      // Get initial customer info
      const customerInfo = await this.getCustomerInfo();
      console.log('📊 Initial subscription status:', this.getSubscriptionStatus(customerInfo));

    } catch (error) {
      console.error('❌ RevenueCat initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get current customer information
   */
  static async getCustomerInfo() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  }

  /**
   * Get available subscription packages
   */
  static async getOfferings() {
    try {
      console.log('📦 Fetching available offerings...');
      const offerings = await Purchases.getOfferings();
      
      if (offerings.current !== null) {
        console.log('✅ Available packages:', offerings.current.availablePackages.length);
        return offerings.current;
      } else {
        console.log('⚠️ No offerings found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a subscription package
   */
  static async purchasePackage(packageToPurchase) {
    try {
      console.log('💰 Initiating purchase...');
      
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      console.log('✅ Purchase successful!');
      return {
        success: true,
        customerInfo,
        tier: this.getSubscriptionStatus(customerInfo).tier
      };
    } catch (error) {
      if (error.userCancelled) {
        console.log('ℹ️ User cancelled purchase');
        return { success: false, cancelled: true };
      } else {
        console.error('❌ Purchase failed:', error);
        return { success: false, error: error.message };
      }
    }
  }

  /**
   * Restore previous purchases
   */
  static async restorePurchases() {
    try {
      console.log('🔄 Restoring purchases...');
      
      const customerInfo = await Purchases.restorePurchases();
      const status = this.getSubscriptionStatus(customerInfo);
      
      if (status.tier !== 'free') {
        console.log('✅ Purchases restored! Tier:', status.tier);
        return { success: true, tier: status.tier };
      } else {
        console.log('ℹ️ No active subscriptions found');
        return { success: false, message: 'No active subscriptions found' };
      }
    } catch (error) {
      console.error('❌ Restore failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get subscription status from customer info
   * Returns: { tier: 'free'|'plus'|'pro', isActive: boolean, expirationDate: Date|null }
   */
  static getSubscriptionStatus(customerInfo) {
    if (!customerInfo) {
      return { tier: 'free', isActive: false, expirationDate: null };
    }

    // Check for Pro tier entitlements
    if (customerInfo.entitlements.active['pro']) {
      return {
        tier: 'pro',
        isActive: true,
        expirationDate: customerInfo.entitlements.active['pro'].expirationDate,
        productIdentifier: customerInfo.entitlements.active['pro'].productIdentifier
      };
    }

    // Check for Plus tier entitlements
    if (customerInfo.entitlements.active['plus']) {
      return {
        tier: 'plus',
        isActive: true,
        expirationDate: customerInfo.entitlements.active['plus'].expirationDate,
        productIdentifier: customerInfo.entitlements.active['plus'].productIdentifier
      };
    }

    // No active subscriptions
    return {
      tier: 'free',
      isActive: false,
      expirationDate: null
    };
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription() {
    try {
      const customerInfo = await this.getCustomerInfo();
      const status = this.getSubscriptionStatus(customerInfo);
      return status.isActive;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Get user's current tier
   */
  static async getCurrentTier() {
    try {
      const customerInfo = await this.getCustomerInfo();
      const status = this.getSubscriptionStatus(customerInfo);
      return status.tier;
    } catch (error) {
      console.error('Error getting tier:', error);
      return 'free';
    }
  }

  /**
   * Cancel subscription (iOS only - redirects to settings)
   * Android users cancel through Google Play Store
   */
  static async manageSubscription() {
    try {
      await Purchases.showManagementURL();
    } catch (error) {
      console.error('Error showing management URL:', error);
    }
  }

  /**
   * Set user identifier (for tracking)
   */
  static async setUserId(userId) {
    try {
      await Purchases.logIn(userId);
      console.log('✅ User ID set:', userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  /**
   * Log out user (clear purchase data)
   */
  static async logOut() {
    try {
      await Purchases.logOut();
      console.log('✅ User logged out from RevenueCat');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}

export default RevenueCatService;