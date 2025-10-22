// services/RecallService.js
// NutraDetective - USDA/FDA Recall Alerts System
// Version 1.0 - Basic Recall Checking (PHASE 1)
// Checks products against FDA and USDA recall databases

import AsyncStorage from '@react-native-async-storage/async-storage';

class RecallService {
  /**
   * Main function: Check if a product is recalled
   * @param {string} barcode - Product barcode (UPC-A or EAN-13)
   * @param {object} productInfo - Product name, brand, etc.
   * @returns {object|null} - Recall data if found, null if not recalled
   */
  static async checkProductRecall(barcode, productInfo = {}) {
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('🚨 RECALL CHECK STARTED');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📦 Product:', productInfo.name || 'Unknown');
    console.log('🔢 Barcode:', barcode);
    console.log('');

    try {
      // Check cache first (recalls update daily, so cache for 12 hours)
      const cached = await this.getCachedRecallCheck(barcode);
      if (cached !== null) {
        console.log('✅ Using cached recall check (age: ' + cached.age + ' hours)');
        return cached.data;
      }

      // Check both FDA and USDA in parallel for speed
      const [fdaRecall, usdaRecall] = await Promise.all([
        this.checkFDARecalls(barcode, productInfo),
        this.checkUSDARecalls(barcode, productInfo)
      ]);

      // Return the first recall found (FDA takes priority as it's broader)
      const recallData = fdaRecall || usdaRecall;

      // Cache the result (even if null, to avoid repeated API calls)
      await this.cacheRecallCheck(barcode, recallData);

      if (recallData) {
        console.log('');
        console.log('🚨🚨🚨 RECALL DETECTED! 🚨🚨🚨');
        console.log('══════════════════════════════════════════════════════════');
        console.log('Product:', recallData.productName);
        console.log('Reason:', recallData.reason);
        console.log('Date:', recallData.recallDate);
        console.log('Action:', recallData.actionToTake);
        console.log('══════════════════════════════════════════════════════════');
        console.log('');
      } else {
        console.log('✅ No recalls found - product is safe');
        console.log('══════════════════════════════════════════════════════════');
        console.log('');
      }

      return recallData;

    } catch (error) {
      console.error('❌ Recall check error:', error.message);
      console.log('══════════════════════════════════════════════════════════');
      console.log('');
      // Don't fail the product scan if recall check fails
      return null;
    }
  }

  /**
   * Check FDA Food Enforcement Reports
   * Covers: packaged foods, beverages, dietary supplements
   */
  static async checkFDARecalls(barcode, productInfo) {
    console.log('📡 Checking FDA Enforcement API...');

    try {
      // FDA API endpoint - search by product code (UPC)
      // Free API, no key needed, JSON response
      const searchQuery = barcode.replace(/^0+/, ''); // Remove leading zeros
      const url = `https://api.fda.gov/food/enforcement.json?search=product_code:"${searchQuery}" OR upc:"${barcode}"&limit=5`;

      console.log('   URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log('   ❌ FDA API returned status:', response.status);
        return null;
      }

      const data = await response.json();

      // Check if any results
      if (!data.results || data.results.length === 0) {
        console.log('   ✅ No FDA recalls found');
        return null;
      }

      console.log('   ⚠️  Found', data.results.length, 'potential FDA recall(s)');

      // Get the most recent recall
      const recall = data.results[0];

      // Match by product name/brand (since barcode matching is imperfect)
      const productName = (productInfo.name || '').toLowerCase();
      const productBrand = (productInfo.brand || '').toLowerCase();
      const recallProduct = (recall.product_description || '').toLowerCase();

      const nameMatch = productName && recallProduct.includes(productName);
      const brandMatch = productBrand && recallProduct.includes(productBrand);

      if (!nameMatch && !brandMatch) {
        console.log('   ℹ️  Recall found but product name/brand doesn\'t match - likely false positive');
        console.log('   Scanned:', productName, '/', productBrand);
        console.log('   Recalled:', recallProduct);
        return null;
      }

      console.log('   🚨 MATCH CONFIRMED - This product is recalled!');

      // Extract recall information
      return {
        isRecalled: true,
        source: 'FDA',
        productName: recall.product_description || 'Unknown Product',
        reason: recall.reason_for_recall || 'Reason not specified',
        classification: recall.classification || 'Not specified',
        recallDate: recall.report_date || recall.recall_initiation_date || 'Date unknown',
        recallNumber: recall.recall_number || 'N/A',
        company: recall.recalling_firm || 'Unknown',
        distributionPattern: recall.distribution_pattern || 'Unknown',
        actionToTake: this.getActionFromClassification(recall.classification),
        severity: this.getSeverityFromClassification(recall.classification),
        details: recall.code_info || '',
        officialLink: `https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts`
      };

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('   ⏱️  FDA API timeout (5 sec)');
      } else {
        console.log('   ❌ FDA API error:', error.message);
      }
      return null;
    }
  }

  /**
   * Check USDA FSIS Recalls
   * Covers: meat, poultry, egg products
   */
  static async checkUSDARecalls(barcode, productInfo) {
    console.log('📡 Checking USDA FSIS API...');

    try {
      // USDA doesn't have a direct barcode API, so we search by product name
      // Their API is XML-based and less modern than FDA
      // For now, we'll use a simplified approach

      const productName = productInfo.name || '';
      const productBrand = productInfo.brand || '';

      if (!productName) {
        console.log('   ⚠️  No product name to search USDA - skipping');
        return null;
      }

      // USDA Food Safety API endpoint
      // This is a simplified check - full implementation would parse their XML feed
      const searchTerm = encodeURIComponent(productName);
      const url = `https://www.fsis.usda.gov/fsis-content/api/v1/recalls?search=${searchTerm}`;

      console.log('   URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log('   ❌ USDA API returned status:', response.status);
        // USDA API might not be available - this is OK, FDA covers most products
        return null;
      }

      const data = await response.json();

      if (!data || !data.results || data.results.length === 0) {
        console.log('   ✅ No USDA recalls found');
        return null;
      }

      console.log('   ⚠️  Found', data.results.length, 'potential USDA recall(s)');

      const recall = data.results[0];

      // Return structured recall data
      return {
        isRecalled: true,
        source: 'USDA',
        productName: recall.product || productName,
        reason: recall.reason || 'Contamination concern',
        classification: recall.class || 'Class I',
        recallDate: recall.date || 'Date unknown',
        recallNumber: recall.recall_number || 'N/A',
        company: recall.company || productBrand,
        distributionPattern: recall.distribution || 'Unknown',
        actionToTake: 'Do not consume. Return to store or discard immediately.',
        severity: 'critical',
        details: recall.description || '',
        officialLink: 'https://www.fsis.usda.gov/recalls'
      };

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('   ⏱️  USDA API timeout (5 sec)');
      } else {
        console.log('   ❌ USDA API error:', error.message);
      }
      return null;
    }
  }

  /**
   * Get action instructions based on FDA classification
   */
  static getActionFromClassification(classification) {
    switch (classification) {
      case 'Class I':
        return '🚨 URGENT: Do not consume! Dispose immediately. Serious health risk.';
      case 'Class II':
        return '⚠️ WARNING: Do not consume. Return to store for refund. May cause temporary health issues.';
      case 'Class III':
        return 'ℹ️ NOTICE: Product may not meet standards. Return to store if concerned.';
      default:
        return 'Do not consume. Check with retailer or manufacturer.';
    }
  }

  /**
   * Get severity level for UI
   */
  static getSeverityFromClassification(classification) {
    switch (classification) {
      case 'Class I':
        return 'critical';
      case 'Class II':
        return 'high';
      case 'Class III':
        return 'medium';
      default:
        return 'high';
    }
  }

  /**
   * Cache recall check result (12-hour cache)
   */
  static async cacheRecallCheck(barcode, recallData) {
    try {
      const cacheKey = `recall_check_${barcode}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: recallData,
        cachedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.log('Cache write error:', error.message);
    }
  }

  /**
   * Get cached recall check (if not expired)
   */
  static async getCachedRecallCheck(barcode) {
    try {
      const cacheKey = `recall_check_${barcode}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
      const maxAge = 12 * 60 * 60 * 1000; // 12 hours

      if (cacheAge > maxAge) {
        console.log('Recall cache expired, fetching fresh data');
        return null;
      }

      const ageHours = Math.round(cacheAge / (60 * 60 * 1000));
      return {
        data: parsed.data,
        age: ageHours
      };

    } catch (error) {
      console.log('Cache read error:', error.message);
      return null;
    }
  }

  /**
   * Clear recall cache (useful for testing)
   */
  static async clearCache(barcode = null) {
    try {
      if (barcode) {
        // Clear specific barcode
        await AsyncStorage.removeItem(`recall_check_${barcode}`);
        console.log('✅ Cleared recall cache for barcode:', barcode);
      } else {
        // Clear all recall caches
        const keys = await AsyncStorage.getAllKeys();
        const recallKeys = keys.filter(key => key.startsWith('recall_check_'));
        await AsyncStorage.multiRemove(recallKeys);
        console.log('✅ Cleared all recall caches (' + recallKeys.length + ' items)');
      }
    } catch (error) {
      console.error('Error clearing recall cache:', error);
    }
  }
}

export default RecallService;