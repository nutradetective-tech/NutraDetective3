// services/RecallService.js
// NutraDetective - USDA/FDA Recall News Feed System
// Version 2.0 - Feed-Based Approach (Not Per-Product)
// Fetches latest recalls for news feed + smart scan matching

import AsyncStorage from '@react-native-async-storage/async-storage';

class RecallService {
  /**
   * 📰 MAIN FUNCTION: Fetch Latest Recall Feed
   * Gets the most recent 50 recalls from FDA
   * @returns {Array} - Array of recall objects
   */
  static async fetchRecallFeed() {
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📰 FETCHING RECALL FEED');
    console.log('══════════════════════════════════════════════════════════');

    try {
      // Check cache first (recall feed updates hourly)
      const cached = await this.getCachedFeed();
      if (cached !== null) {
        console.log('✅ Using cached recall feed (age: ' + cached.age + ' minutes)');
        console.log('📊 Total recalls in feed:', cached.data.length);
        console.log('══════════════════════════════════════════════════════════');
        return cached.data;
      }

      console.log('📡 Fetching fresh recall data from FDA...');

      // FDA Enforcement API - Get latest food recalls
      // Sorted by report date (most recent first)
      // Limit to 50 for performance
      const url = 'https://api.fda.gov/food/enforcement.json?limit=50&sort=report_date:desc';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sec timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('❌ FDA API returned status:', response.status);
        console.log('══════════════════════════════════════════════════════════');
        return [];
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log('⚠️  No recalls found in FDA database');
        console.log('══════════════════════════════════════════════════════════');
        return [];
      }

      console.log('✅ Retrieved', data.results.length, 'recalls from FDA');

      // Transform FDA data into our format
      const recalls = data.results.map((recall, index) => ({
        id: recall.recall_number || `recall-${index}`,
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

      // Cache the feed
      await this.cacheFeed(recalls);

      console.log('✅ Recall feed processed and cached');
      console.log('══════════════════════════════════════════════════════════');

      return recalls;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('⏱️  FDA API timeout (10 sec)');
      } else {
        console.error('❌ Recall feed fetch error:', error.message);
      }
      console.log('══════════════════════════════════════════════════════════');
      
      // Return cached data even if expired, better than nothing
      const expiredCache = await this.getCachedFeed(true);
      return expiredCache ? expiredCache.data : [];
    }
  }

  /**
   * 🔍 SMART SCAN CHECK
   * Quickly checks if scanned product matches any recalls in feed
   * Uses cached feed (no API call = FAST)
   * @param {string} productName - Product name from scan
   * @param {string} brandName - Brand name from scan
   * @returns {object|null} - Matching recall or null
   */
  static async checkScannedProduct(productName, brandName) {
    try {
      // Get cached feed (don't fetch fresh, that's slow)
      const cached = await this.getCachedFeed(true); // Allow expired cache
      if (!cached || !cached.data) {
        return null; // No feed cached yet
      }

      const feed = cached.data;
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
          console.log('   Recalled:', recall.productName);
          return recall;
        }
      }

      return null; // No match

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
    
    // Try to extract brand from common patterns
    // "BRAND NAME Product Description"
    const words = description.split(' ');
    
    // Often brand is first 1-2 words before a comma or parenthesis
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
   * Cache recall feed (1 hour cache)
   */
  static async cacheFeed(recalls) {
    try {
      const cacheKey = 'recall_feed_cache';
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: recalls,
        cachedAt: new Date().toISOString(),
        count: recalls.length
      }));
      console.log('💾 Cached', recalls.length, 'recalls');
    } catch (error) {
      console.error('Cache write error:', error.message);
    }
  }

  /**
   * Get cached recall feed (if not expired)
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
        console.log('⚠️  Recall feed cache expired, fetching fresh data');
        return null;
      }

      const ageMinutes = Math.round(cacheAge / (60 * 1000));
      return {
        data: parsed.data,
        age: ageMinutes,
        count: parsed.count
      };

    } catch (error) {
      console.error('Cache read error:', error.message);
      return null;
    }
  }

  /**
   * Get last feed update time
   */
  static async getLastUpdateTime() {
    try {
      const cached = await this.getCachedFeed(true); // Allow expired
      if (!cached) return null;
      
      const cacheAge = cached.age;
      return {
        lastUpdate: new Date(Date.now() - (cacheAge * 60 * 1000)),
        minutesAgo: cacheAge,
        needsRefresh: cacheAge > 60
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Force refresh feed (ignore cache)
   */
  static async refreshFeed() {
    console.log('🔄 Force refreshing recall feed...');
    await AsyncStorage.removeItem('recall_feed_cache');
    return await this.fetchRecallFeed();
  }

  /**
   * Search recalls by keyword
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
   * Get recalls by severity
   */
  static async getRecallsBySeverity(severity) {
    const feed = await this.fetchRecallFeed();
    return feed.filter(recall => recall.severity === severity);
  }

  /**
   * Clear cache (useful for testing)
   */
  static async clearCache() {
    try {
      await AsyncStorage.removeItem('recall_feed_cache');
      console.log('✅ Recall feed cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default RecallService;