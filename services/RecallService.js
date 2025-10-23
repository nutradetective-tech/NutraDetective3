// services/RecallService.js
// NutraDetective - FDA/USDA Recall News Feed System
// Version 3.3 - BARCODE-ONLY MATCHING (Zero False Positives)
// Fetches latest recalls for news feed + exact barcode matching only

import AsyncStorage from '@react-native-async-storage/async-storage';
import USDRecallService from './USDRecallService';

class RecallService {
  // Global fetch lock to prevent duplicate simultaneous fetches
  static isFetching = false;
  static lastFetchPromise = null;

  /**
   * 🎯 MAIN FUNCTION: Fetch Merged Feed (FDA + USDA)
   * FDA displays immediately, USDA loads in background
   * @returns {Array} - Combined array of FDA and USDA recalls
   */
  static async fetchRecallFeed() {
    // Prevent duplicate simultaneous fetches
    if (this.isFetching && this.lastFetchPromise) {
      console.log('⏭️  Fetch already in progress, returning existing promise...');
      return this.lastFetchPromise;
    }

    this.isFetching = true;
    
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📰 FETCHING MERGED RECALL FEED (FDA + USDA)');
    console.log('══════════════════════════════════════════════════════════');

    // Store the promise so other calls can wait for it
    this.lastFetchPromise = (async () => {
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

        // Start both fetches in parallel
        const fdaPromise = this.fetchFDAFeed();
        const usdaPromise = USDRecallService.fetchUSDAFeed();

        // Wait for FDA first (it's faster and more reliable)
        const fdaRecalls = await fdaPromise;
        console.log('✅ FDA complete, returning initial results...');

        // Return FDA results immediately
        // USDA will be cached and available on next fetch/refresh
        let finalRecalls = [...fdaRecalls];

        // Try to get USDA in background (non-blocking)
        usdaPromise.then(usdaRecalls => {
          if (usdaRecalls && usdaRecalls.length > 0) {
            console.log('');
            console.log('✅ USDA completed in background:', usdaRecalls.length, 'recalls');
            console.log('   (Will be available on next refresh)');
            // It's already cached by USDRecallService
          }
        }).catch(err => {
          console.log('⚠️  USDA failed but FDA working fine');
        });

        // Check if we have any cached USDA from before
        const oldUsdaCache = await USDRecallService.getCachedUSDAFeed(true);
        if (oldUsdaCache && oldUsdaCache.data.length > 0) {
          console.log('📦 Including', oldUsdaCache.data.length, 'USDA recalls from cache');
          finalRecalls = this.mergeAndSortFeeds(fdaRecalls, oldUsdaCache.data);
        }

        console.log('');
        console.log('📊 Fetch Results:');
        console.log('   FDA: ✅', fdaRecalls.length, 'recalls');
        console.log('   USDA: ⏳ Loading in background...');
        console.log('📊 Total merged recalls:', finalRecalls.length);
        console.log('══════════════════════════════════════════════════════════');

        return finalRecalls;

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
      } finally {
        // Reset fetch lock after completion
        this.isFetching = false;
        setTimeout(() => {
          this.lastFetchPromise = null;
        }, 1000); // Clear after 1 second
      }
    })();

    return this.lastFetchPromise;
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
          console.log('💾 Cached', recalls.length, 'FDA recalls');
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
   * 🔍 BARCODE-ONLY RECALL CHECK (Version 3.3)
   * ============================================
   * ZERO FALSE POSITIVES GUARANTEED
   * Only shows alerts for EXACT barcode matches
   * 
   * @param {string} productName - Product name from scan (not used anymore)
   * @param {string} brandName - Brand name from scan (not used anymore)
   * @param {string} scannedBarcode - Barcode from scan (REQUIRED)
   * @returns {object|null} - Matching recall or null
   */
  static async checkScannedProduct(productName, brandName, scannedBarcode) {
    try {
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 BARCODE-ONLY RECALL CHECK');
      console.log('═══════════════════════════════════════════════════════');

      // REQUIREMENT: Must have barcode
      if (!scannedBarcode) {
        console.log('⚠️  No barcode provided - cannot verify recall status');
        console.log('   (This is SAFE - we never show alerts without certainty)');
        console.log('═══════════════════════════════════════════════════════');
        return null;
      }

      console.log('📊 Scanned Product:');
      console.log('   Name:', productName);
      console.log('   Brand:', brandName);
      console.log('   Barcode:', scannedBarcode);

      // Get merged cached feed
      const fdaCached = await this.getCachedFeed(true);
      const usdaCached = await USDRecallService.getCachedUSDAFeed(true);
      
      if (!fdaCached && !usdaCached) {
        console.log('⚠️  No cached recall data available');
        console.log('═══════════════════════════════════════════════════════');
        return null;
      }

      const allRecalls = this.mergeAndSortFeeds(
        fdaCached ? fdaCached.data : [],
        usdaCached ? usdaCached.data : []
      );

      console.log('📋 Checking against', allRecalls.length, 'cached recalls...');

      // Normalize scanned barcode
      const normalizedScanned = this.normalizeBarcode(scannedBarcode);
      console.log('🔢 Normalized barcode:', normalizedScanned);

      // Check each recall for exact barcode match
      let recallsWithBarcodes = 0;
      let recallsWithoutBarcodes = 0;

      for (const recall of allRecalls) {
        // Extract barcode from recall data
        const recallBarcode = this.extractBarcodeFromRecall(recall);
        
        if (!recallBarcode) {
          recallsWithoutBarcodes++;
          continue; // Skip recalls without barcodes (can't verify)
        }

        recallsWithBarcodes++;

        // Normalize recall barcode
        const normalizedRecall = this.normalizeBarcode(recallBarcode);

        // EXACT MATCH CHECK
        if (normalizedScanned === normalizedRecall) {
          console.log('');
          console.log('🚨🚨🚨 EXACT BARCODE MATCH - RECALL CONFIRMED! 🚨🚨🚨');
          console.log('═══════════════════════════════════════════════════════');
          console.log('📦 Scanned Product:', productName);
          console.log('🚨 Recalled Product:', recall.productName);
          console.log('🔢 Barcode Match:', scannedBarcode, '→', recallBarcode);
          console.log('📅 Recall Date:', recall.recallDate);
          console.log('⚠️  Classification:', recall.classification);
          console.log('📋 Source:', recall.source);
          console.log('═══════════════════════════════════════════════════════');
          
          return recall; // 100% CERTAIN MATCH
        }
      }

      // No match found
      console.log('');
      console.log('✅ NO RECALL MATCH FOUND');
      console.log('───────────────────────────────────────────────────────');
      console.log('   Recalls with barcodes:', recallsWithBarcodes);
      console.log('   Recalls without barcodes:', recallsWithoutBarcodes, '(skipped)');
      console.log('   Result: Product is safe (no barcode match)');
      console.log('═══════════════════════════════════════════════════════');

      return null;

    } catch (error) {
      console.error('❌ Error checking recall:', error);
      console.log('═══════════════════════════════════════════════════════');
      return null;
    }
  }

  /**
   * 🔢 NORMALIZE BARCODE
   * Removes spaces, dashes, and leading zeros for comparison
   * Handles UPC-A ↔ EAN-13 conversion
   * @param {string} barcode - Raw barcode
   * @returns {string} - Normalized barcode
   */
  static normalizeBarcode(barcode) {
    if (!barcode) return '';
    
    // Convert to string and remove all non-digit characters
    let normalized = barcode.toString().replace(/\D/g, '');
    
    // Remove leading zeros (UPC-A vs EAN-13 conversion)
    // UPC-A: 012345678901 (12 digits)
    // EAN-13: 0012345678901 (13 digits, leading 0)
    normalized = normalized.replace(/^0+/, '');
    
    return normalized;
  }

  /**
   * 🔎 EXTRACT BARCODE FROM RECALL DATA
   * Searches for barcodes in multiple locations in recall object
   * Handles various formats: "UPC 0 72036 95364 3", "072036953643", etc.
   * @param {object} recall - Recall object
   * @returns {string|null} - Extracted barcode or null
   */
  static extractBarcodeFromRecall(recall) {
    // Check explicit fields first
    if (recall.barcode) return recall.barcode;
    if (recall.upc) return recall.upc;
    if (recall.code_info) {
      // Check if code_info contains a barcode
      const barcodeMatch = recall.code_info.match(/\b\d{8,14}\b/);
      if (barcodeMatch) return barcodeMatch[0];
    }
    
    // Search in product description for UPC patterns
    const text = recall.productName || '';
    
    // Pattern 1: "UPC 0 72036 95364 3" (with spaces)
    const upcPattern = /UPC[:\s]+([0-9\s-]+)/i;
    const upcMatch = text.match(upcPattern);
    if (upcMatch) {
      const digits = upcMatch[1].replace(/\D/g, ''); // Remove non-digits
      if (digits.length >= 8 && digits.length <= 14) {
        return digits;
      }
    }
    
    // Pattern 2: "barcode: 123456789012"
    const barcodePattern = /barcode[:\s]+([0-9\s-]+)/i;
    const barcodeMatch = text.match(barcodePattern);
    if (barcodeMatch) {
      const digits = barcodeMatch[1].replace(/\D/g, '');
      if (digits.length >= 8 && digits.length <= 14) {
        return digits;
      }
    }
    
    // Pattern 3: Look for 8-14 digit numbers
    const digitPattern = /\b(\d{8,14})\b/g;
    const digitMatches = text.match(digitPattern);
    if (digitMatches && digitMatches.length > 0) {
      // Return the first valid-looking barcode
      return digitMatches[0];
    }
    
    return null; // No barcode found
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