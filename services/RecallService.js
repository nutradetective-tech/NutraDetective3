// services/RecallService.js
// NutraDetective - FDA/USDA Recall News Feed System
// Version 3.0 - Merged FDA + USDA with Parallel Fetching
// Fetches latest recalls for news feed + smart scan matching

import AsyncStorage from '@react-native-async-storage/async-storage';
import USDRecallService from './USDRecallService';

class RecallService {
  /**
   * 🎯 NEW MAIN FUNCTION: Fetch Merged Feed (FDA + USDA)
   * Fetches both APIs in parallel for best performance
   * @returns {Array} - Combined array of FDA and USDA recalls
   */
  static async fetchRecallFeed() {
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📰 FETCHING MERGED RECALL FEED (FDA + USDA)');
    console.log('══════════════════════════════════════════════════════════');

    try {
      // Check if we have both cached (and not expired)
      const fdaCached = await this.getCachedFeed();
      const usdaCached = await USDRecallService.getCachedUSDAFeed();

      if (fdaCached !== null && usdaCached !== null) {
        console.log('✅ Using cached feeds');
        console.log('   FDA:', fdaCached.count, 'recalls (age:', fdaCached.age, 'min)');
        console.log('   USDA:', usdaCached.count, 'recalls (age:', usdaCached.age, 'min)');
        const merged = this.mergeAndSortFeeds(fdaCached.data, usdaCached.data);
        console.log('📊 Total merged recalls:', merged.length);
        console.log('══════════════════════════════════════════════════════════');
        return merged;
      }

      console.log('📡 Fetching fresh data from both APIs in parallel...');

      // 🚀 PARALLEL FETCH (both at the same time)
      const [fdaResult, usdaResult] = await Promise.allSettled([
        this.fetchFDAFeed(),
        USDRecallService.fetchUSDAFeed()
      ]);

      // Extract successful results
      const fdaRecalls = fdaResult.status === 'fulfilled' ? fdaResult.value : [];
      const usdaRecalls = usdaResult.status === 'fulfilled' ? usdaResult.value : [];

      // Log results
      console.log('');
      console.log('📊 Fetch Results:');
      console.log('   FDA:', fdaResult.status === 'fulfilled' ? `✅ ${fdaRecalls.length} recalls` : `❌ Failed`);
      console.log('   USDA:', usdaResult.status === 'fulfilled' ? `✅ ${usdaRecalls.length} recalls` : `❌ Failed`);

      // Merge and sort
      const merged = this.mergeAndSortFeeds(fdaRecalls, usdaRecalls);
      console.log('📊 Total merged recalls:', merged.length);
      console.log('══════════════════════════════════════════════════════════');

      return merged;

    } catch (error) {
      console.error('❌ Merged feed fetch error:', error.message);
      console.log('══════════════════════════════════════════════════════════');
      
      // Return any cached data we have (even if expired)
      const expiredFDA = await this.getCachedFeed(true);
      const expiredUSDA = await USDRecallService.getCachedUSDAFeed(true);
      return this.mergeAndSortFeeds(
        expiredFDA ? expiredFDA.data : [],
        expiredUSDA ? expiredUSDA.data : []
      );
    }
  }

  /**
   * 🔀 MERGE AND SORT FEEDS
   * Combines FDA and USDA recalls, sorts by date (newest first)
   * @param {Array} fdaRecalls - FDA recalls
   * @param {Array} usdaRecalls - USDA recalls
   * @returns {Array} - Merged and sorted recalls
   */
  static mergeAndSortFeeds(fdaRecalls, usdaRecalls) {
    const merged = [...fdaRecalls, ...usdaRecalls];

    // Sort by date (newest first)
    merged.sort((a, b) => {
      const dateA = this.parseRecallDate(a.recallDate);
      const dateB = this.parseRecallDate(b.recallDate);
      return dateB - dateA;
    });

    return merged;
  }

  /**
   * Parse recall date for sorting
   */
  static parseRecallDate(dateString) {
    if (!dateString || dateString === 'Date unknown') return new Date(0);
    
    // Handle YYYYMMDD format
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    return new Date(`${year}-${month}-${day}`);
  }

  /**
   * 📰 FETCH FDA FEED ONLY
   * Gets the most recent 50 recalls from FDA
   * @returns {Array} - Array of FDA recall objects
   */
  static async fetchFDAFeed() {
    console.log('📡 Fetching FDA recalls...');

    try {
      // FDA Enforcement API
      const url = 'https://api.fda.gov/food/enforcement.json?limit=50&sort=report_date:desc';

      // Attempt 1-3 with 30-second timeout
      let lastError = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 FDA Attempt ${attempt} of 3...`);

          const response = await this.fetchWithTimeout(url, 30000); // 30 sec

          if (!response.ok) {
            console.error('❌ FDA API returned status:', response.status);
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();

          if (!data.results || data.results.length === 0) {
            console.log('⚠️  No FDA recalls found');
            return [];
          }

          console.log('✅ Retrieved', data.results.length, 'FDA recalls');

          // Transform FDA data
          const recalls = data.results.map((recall, index) => ({
            id: recall.recall_number || `fda-recall-${index}`,
            productName: recall.product_description || 'Unknown Product',
            brand: this.extractBrand(recall.product_description),
            reason: recall.reason_for_recall || 'Reason not specified',
            classification: recall.classification || 'Not specified',
            severity: this.getSeverityFromClassification(recall.classification),
            recallDate: recall.report_date || recall.recall_initiation_date || 'Date unknown',
            recallNumber: recall.recall_number || 'N/A',
            company: recall.recalling_firm || 'Unknown',
            distributionPattern: recall.distribution_pattern || 'Unknown',
            actionToTake: this.getActionFromClassification(recall.classification),
            details: recall.code_info || '',
            source: 'FDA',
            officialLink: 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts'
          }));

          // Cache FDA feed
          await this.cacheFeed(recalls);
          return recalls;

        } catch (error) {
          lastError = error;
          if (error.name === 'AbortError') {
            console.error(`⏱️  FDA timeout on attempt ${attempt}`);
          } else {
            console.error(`❌ FDA attempt ${attempt} failed:`, error.message);
          }

          // Wait before retry
          if (attempt < 3) {
            const delay = attempt * 2000; // 2s, 4s
            console.log(`⏳ Waiting ${delay/1000}s before retry...`);
            await this.delay(delay);
          }
        }
      }

      // All attempts failed
      console.error('❌ All FDA attempts failed');
      const expiredCache = await this.getCachedFeed(true);
      return expiredCache ? expiredCache.data : [];

    } catch (error) {
      console.error('❌ FDA fetch error:', error.message);
      const expiredCache = await this.getCachedFeed(true);
      return expiredCache ? expiredCache.data : [];
    }
  }

  /**
   * Fetch with timeout helper
   */
  static async fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Delay helper
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 🔍 SMART SCAN CHECK
   * Quickly checks if scanned product matches any recalls in merged feed
   * Uses cached feed (no API call = FAST)
   * @param {string} productName - Product name from scan
   * @param {string} brandName - Brand name from scan
   * @returns {object|null} - Matching recall or null
   */
  static async checkScannedProduct(productName, brandName) {
    try {
      // Get merged cached feed
      const cached = await this.getCachedFeed(true);
      const usdaCached = await USDRecallService.getCachedUSDAFeed(true);
      
      if (!cached && !usdaCached) {
        return null;
      }

      const feed = this.mergeAndSortFeeds(
        cached ? cached.data : [],
        usdaCached ? usdaCached.data : []
      );

      const searchName = (productName || '').toLowerCase();
      const searchBrand = (brandName || '').toLowerCase();

      // Quick fuzzy match
      for (const recall of feed) {
        const recallProduct = recall.productName.toLowerCase();
        const recallBrand = recall.brand.toLowerCase();

        // Check if product name contains any significant words from recall
        const productWords = searchName.split(' ').filter(w => w.length > 3);
        const recallWords = recallProduct.split(' ').filter(w => w.length > 3);

        const hasNameMatch = productWords.some(word => 
          recallWords.some(rWord => rWord.includes(word) || word.includes(rWord))
        );

        const hasBrandMatch = searchBrand && recallBrand && 
          (recallBrand.includes(searchBrand) || searchBrand.includes(recallBrand));

        // Match if both name and brand match, or strong name match
        if ((hasNameMatch && hasBrandMatch) || (hasNameMatch && productWords.length >= 2)) {
          console.log('🚨 RECALL MATCH FOUND DURING SCAN!');
          console.log('   Scanned:', productName, '/', brandName);
          console.log('   Recalled:', recall.productName, '(', recall.source, ')');
          return recall;
        }
      }

      return null;

    } catch (error) {
      console.error('Error checking scanned product:', error.message);
      return null;
    }
  }

  /**
   * Extract brand from product description
   */
  static extractBrand(description) {
    if (!description) return 'Unknown';
    
    const words = description.split(' ');
    const firstPart = description.split(/[,\(]/)[0];
    const brandCandidate = firstPart.split(' ').slice(0, 2).join(' ');
    
    return brandCandidate || words[0] || 'Unknown';
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
   * Cache FDA feed (1 hour cache)
   */
  static async cacheFeed(recalls) {
    try {
      const cacheKey = 'recall_feed_cache';
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: recalls,
        cachedAt: new Date().toISOString(),
        count: recalls.length
      }));
      console.log('💾 Cached', recalls.length, 'FDA recalls');
    } catch (error) {
      console.error('FDA cache write error:', error.message);
    }
  }

  /**
   * Get cached FDA feed (if not expired)
   * @param {boolean} allowExpired - Return expired cache if true
   */
  static async getCachedFeed(allowExpired = false) {
    try {
      const cacheKey = 'recall_feed_cache';
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
      const maxAge = 60 * 60 * 1000; // 1 hour

      if (!allowExpired && cacheAge > maxAge) {
        console.log('⚠️  FDA cache expired');
        return null;
      }

      const ageMinutes = Math.round(cacheAge / (60 * 1000));
      return {
        data: parsed.data,
        age: ageMinutes,
        count: parsed.count
      };

    } catch (error) {
      console.error('FDA cache read error:', error.message);
      return null;
    }
  }

  /**
   * Get last feed update time (merged)
   */
  static async getLastUpdateTime() {
    try {
      const fdaCached = await this.getCachedFeed(true);
      const usdaCached = await USDRecallService.getCachedUSDAFeed(true);
      
      if (!fdaCached && !usdaCached) return null;

      // Use the newer of the two caches
      const fdaAge = fdaCached ? fdaCached.age : Infinity;
      const usdaAge = usdaCached ? usdaCached.age : Infinity;
      const newestAge = Math.min(fdaAge, usdaAge);
      
      return {
        lastUpdate: new Date(Date.now() - (newestAge * 60 * 1000)),
        minutesAgo: newestAge,
        needsRefresh: newestAge > 60
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Force refresh merged feed (ignore cache)
   */
  static async refreshFeed() {
    console.log('🔄 Force refreshing merged recall feed...');
    await AsyncStorage.removeItem('recall_feed_cache');
    await USDRecallService.clearCache();
    return await this.fetchRecallFeed();
  }

  /**
   * Search recalls by keyword (merged feed)
   */
  static async searchRecalls(keyword) {
    const feed = await this.fetchRecallFeed();
    if (!keyword || keyword.trim() === '') return feed;

    const searchTerm = keyword.toLowerCase();
    return feed.filter(recall => 
      recall.productName.toLowerCase().includes(searchTerm) ||
      recall.brand.toLowerCase().includes(searchTerm) ||
      recall.reason.toLowerCase().includes(searchTerm) ||
      recall.company.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get recalls by severity (merged feed)
   */
  static async getRecallsBySeverity(severity) {
    const feed = await this.fetchRecallFeed();
    return feed.filter(recall => recall.severity === severity);
  }

  /**
   * Clear all caches (FDA + USDA)
   */
  static async clearCache() {
    try {
      await AsyncStorage.removeItem('recall_feed_cache');
      await USDRecallService.clearCache();
      console.log('✅ All recall caches cleared');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }
}

export default RecallService;