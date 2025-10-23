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

      // Try primary USDA endpoint (temporarily single attempt due to gov shutdown)
      const possibleUrls = [
        'https://www.fsis.usda.gov/fsis/api/recall/v/1'
      ];

      // Try each URL with single quick attempt
      for (const url of possibleUrls) {
        console.log(`🔗 Trying endpoint: ${url}`);
        
        for (let attempt = 1; attempt <= 1; attempt++) { // Single attempt during shutdown
          try {
            console.log(`🔄 Attempt ${attempt} of 1 (10s timeout)...`);

            const response = await this.fetchWithTimeout(url, 10000); // 10 sec timeout

            if (!response.ok) {
              console.error(`❌ USDA API returned status: ${response.status}`);
              throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Received response, parsing...');

            // Handle different possible response formats
            let recalls = [];
            if (Array.isArray(data)) {
              recalls = data;
            } else if (data.results && Array.isArray(data.results)) {
              recalls = data.results;
            } else if (data.data && Array.isArray(data.data)) {
              recalls = data.data;
            } else {
              console.log('⚠️  Unexpected response format:', Object.keys(data));
              throw new Error('Unexpected response format');
            }

            if (recalls.length === 0) {
              console.log('⚠️  No recalls found in USDA response');
              throw new Error('Empty response');
            }

            console.log('✅ Retrieved', recalls.length, 'recalls from USDA');

            // Transform USDA data into our standard format
            const transformedRecalls = recalls.slice(0, 50).map((recall, index) => ({
              id: recall.recallNumber || recall.recall_number || `usda-recall-${index}`,
              productName: recall.productName || recall.product_description || recall.product || 'Unknown Product',
              brand: this.extractBrand(recall.productName || recall.product_description || recall.product),
              reason: recall.recallReason || recall.reason_for_recall || recall.reason || 'Reason not specified',
              classification: recall.classification || this.mapUSDAClassification(recall.healthRisk || recall.health_risk),
              severity: this.getSeverityFromUSDAClass(recall.classification || recall.healthRisk || recall.health_risk),
              recallDate: this.formatUSDADate(recall.recallDate || recall.recall_date || recall.date),
              recallNumber: recall.recallNumber || recall.recall_number || 'N/A',
              company: recall.recallingFirm || recall.recalling_firm || recall.company || 'Unknown',
              distributionPattern: recall.distribution || recall.distribution_pattern || 'Unknown',
              actionToTake: this.getActionFromSeverity(this.getSeverityFromUSDAClass(recall.classification || recall.healthRisk || recall.health_risk)),
              details: recall.productDescription || recall.product_description || recall.code_info || '',
              source: 'USDA',
              officialLink: `https://www.fsis.usda.gov/recalls/${recall.recallNumber || recall.recall_number || ''}`
            }));

            // Cache the feed
            await this.cacheUSDAFeed(transformedRecalls);

            console.log('✅ USDA recall feed processed and cached');
            console.log('══════════════════════════════════════════════════════════');

            return transformedRecalls;

          } catch (error) {
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
        
        // If we get here, all 3 attempts for this URL failed, try next URL
        console.log(`❌ All attempts failed for ${url}, trying next endpoint...`);
      }

      // All URLs and attempts failed
      console.error('❌ All USDA endpoints and attempts failed');
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
   * Fetch with timeout helper - IMPROVED VERSION
   */
  static async fetchWithTimeout(url, timeout) {
    return new Promise(async (resolve, reject) => {
      // Set timeout
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timeout after ' + (timeout / 1000) + ' seconds'));
      }, timeout);

      try {
        console.log(`⏱️  Starting fetch with ${timeout/1000}s timeout...`);
        const startTime = Date.now();
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✓ Response received in ${elapsed}s`);
        
        clearTimeout(timeoutId);
        resolve(response);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
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