// services/USDRecallService.js
// NutraDetective - USDA FSIS Recall Service
// Fetches meat, poultry, and egg recalls from USDA
// Version 1.0 - Parallel with FDA, same format

import AsyncStorage from '@react-native-async-storage/async-storage';

class USDRecallService {
  /**
   * 🥩 FETCH USDA RECALLS
   * Gets latest meat/poultry/egg recalls from USDA FSIS
   * @returns {Array} - Array of recall objects in standard format
   */
  static async fetchUSDAFeed() {
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('🥩 FETCHING USDA FSIS RECALLS');
    console.log('══════════════════════════════════════════════════════════');

    try {
      // Check cache first (1-hour cache, same as FDA)
      const cached = await this.getCachedUSDAFeed();
      if (cached !== null) {
        console.log('✅ Using cached USDA feed (age: ' + cached.age + ' minutes)');
        console.log('📊 Total USDA recalls in feed:', cached.data.length);
        console.log('══════════════════════════════════════════════════════════');
        return cached.data;
      }

      console.log('📡 Fetching fresh USDA recall data...');

      // USDA FSIS Recall API
      // NOTE: This endpoint structure is based on USDA documentation
      // If this fails, the endpoint may need adjustment
      const url = 'https://www.fsis.usda.gov/api/recalls?limit=50&sort=recallDate:desc';

      // Attempt 1
      let lastError = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 Attempt ${attempt} of 3...`);

          const response = await this.fetchWithTimeout(url, 30000); // 30 sec timeout

          if (!response.ok) {
            console.error('❌ USDA API returned status:', response.status);
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();

          if (!data || !Array.isArray(data)) {
            console.log('⚠️  No recalls found in USDA response');
            return [];
          }

          console.log('✅ Retrieved', data.length, 'recalls from USDA');

          // Transform USDA data into our standard format
          const recalls = data.map((recall, index) => ({
            id: recall.recallNumber || `usda-recall-${index}`,
            productName: recall.productName || recall.product || 'Unknown Product',
            brand: this.extractBrand(recall.productName || recall.product),
            reason: recall.recallReason || recall.reason || 'Reason not specified',
            classification: recall.classification || this.mapUSDAClassification(recall.healthRisk),
            severity: this.getSeverityFromUSDAClass(recall.classification || recall.healthRisk),
            recallDate: this.formatUSDADate(recall.recallDate || recall.date),
            recallNumber: recall.recallNumber || 'N/A',
            company: recall.recallingFirm || recall.company || 'Unknown',
            distributionPattern: recall.distribution || 'Unknown',
            actionToTake: this.getActionFromSeverity(this.getSeverityFromUSDAClass(recall.classification || recall.healthRisk)),
            details: recall.productDescription || '',
            source: 'USDA',
            officialLink: `https://www.fsis.usda.gov/recalls/${recall.recallNumber || ''}`
          }));

          // Cache the feed
          await this.cacheUSDAFeed(recalls);

          console.log('✅ USDA recall feed processed and cached');
          console.log('══════════════════════════════════════════════════════════');

          return recalls;

        } catch (error) {
          lastError = error;
          if (error.name === 'AbortError') {
            console.error(`⏱️  USDA API timeout on attempt ${attempt} (30 sec)`);
          } else {
            console.error(`❌ USDA fetch attempt ${attempt} failed:`, error.message);
          }

          // Wait before retry (exponential backoff: 2s, 4s)
          if (attempt < 3) {
            const delay = attempt * 2000;
            console.log(`⏳ Waiting ${delay/1000}s before retry...`);
            await this.delay(delay);
          }
        }
      }

      // All 3 attempts failed
      console.error('❌ All USDA fetch attempts failed');
      console.log('══════════════════════════════════════════════════════════');
      
      // Return expired cache if available
      const expiredCache = await this.getCachedUSDAFeed(true);
      return expiredCache ? expiredCache.data : [];

    } catch (error) {
      console.error('❌ USDA recall feed fetch error:', error.message);
      console.log('══════════════════════════════════════════════════════════');
      
      const expiredCache = await this.getCachedUSDAFeed(true);
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
   * Delay helper for retry logic
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format USDA date (they may use different formats)
   */
  static formatUSDADate(dateString) {
    if (!dateString) return 'Date unknown';
    
    try {
      // USDA might use ISO format (2024-01-15) or other formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date unknown';
      
      // Convert to FDA format (YYYYMMDD) for consistency
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}${month}${day}`;
    } catch (error) {
      return 'Date unknown';
    }
  }

  /**
   * Map USDA health risk to FDA classification
   */
  static mapUSDAClassification(healthRisk) {
    if (!healthRisk) return 'Class II';
    
    const risk = healthRisk.toLowerCase();
    if (risk.includes('class i') || risk.includes('high')) {
      return 'Class I';
    } else if (risk.includes('class iii') || risk.includes('low')) {
      return 'Class III';
    } else {
      return 'Class II';
    }
  }

  /**
   * Get severity from USDA classification
   */
  static getSeverityFromUSDAClass(classification) {
    if (!classification) return 'high';
    
    const cls = String(classification).toLowerCase();
    if (cls.includes('class i') || cls.includes('high')) {
      return 'critical';
    } else if (cls.includes('class iii') || cls.includes('low')) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * Extract brand from product name
   */
  static extractBrand(productName) {
    if (!productName) return 'Unknown';
    
    // Try to extract brand (usually first 1-2 words)
    const words = productName.split(' ');
    const brandCandidate = words.slice(0, 2).join(' ');
    
    return brandCandidate || words[0] || 'Unknown';
  }

  /**
   * Get action instructions based on severity
   */
  static getActionFromSeverity(severity) {
    switch (severity) {
      case 'critical':
        return '🚨 URGENT: Do not consume! Dispose immediately. Serious health risk.';
      case 'high':
        return '⚠️ WARNING: Do not consume. Return to store for refund. May cause temporary health issues.';
      case 'medium':
        return 'ℹ️ NOTICE: Product may not meet standards. Return to store if concerned.';
      default:
        return 'Do not consume. Check with retailer or manufacturer.';
    }
  }

  /**
   * Cache USDA feed (1 hour cache)
   */
  static async cacheUSDAFeed(recalls) {
    try {
      const cacheKey = 'usda_recall_feed_cache';
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: recalls,
        cachedAt: new Date().toISOString(),
        count: recalls.length
      }));
      console.log('💾 Cached', recalls.length, 'USDA recalls');
    } catch (error) {
      console.error('USDA cache write error:', error.message);
    }
  }

  /**
   * Get cached USDA feed
   */
  static async getCachedUSDAFeed(allowExpired = false) {
    try {
      const cacheKey = 'usda_recall_feed_cache';
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
      const maxAge = 60 * 60 * 1000; // 1 hour

      if (!allowExpired && cacheAge > maxAge) {
        console.log('⚠️  USDA cache expired, fetching fresh data');
        return null;
      }

      const ageMinutes = Math.round(cacheAge / (60 * 1000));
      return {
        data: parsed.data,
        age: ageMinutes,
        count: parsed.count
      };

    } catch (error) {
      console.error('USDA cache read error:', error.message);
      return null;
    }
  }

  /**
   * Clear USDA cache
   */
  static async clearCache() {
    try {
      await AsyncStorage.removeItem('usda_recall_feed_cache');
      console.log('✅ USDA recall cache cleared');
    } catch (error) {
      console.error('Error clearing USDA cache:', error);
    }
  }
}

export default USDRecallService;