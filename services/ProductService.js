// services/ProductService.js
// NutraDetective - Evidence-Based Nutritional Scoring System
// Version 2.5 - Enhanced Harmful Additives Detection + Product Caching
// INCLUDES: Nutritionix Fix, Spoonacular API, Enhanced Scoring, Complete Harmful Detection, Product Cache

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdditiveInfo } from './additives-database';
import { HARMFUL_INGREDIENTS_DATABASE } from './harmful-ingredients-master';
import RecallService from './RecallService';

// ADHD-LINKED ADDITIVES DATABASE
// Based on Southampton Study (2007) and FDA research
const ADHD_LINKED_ADDITIVES = {
  // High Risk - Strong evidence linking to ADHD symptoms
  high: [
    {
      code: 'E102',
      name: 'Tartrazine (Yellow 5)',
      commonNames: ['yellow 5', 'tartrazine', 'fd&c yellow 5'],
      adhdEffects: ['Hyperactivity', 'Difficulty focusing', 'Impulsivity'],
    },
    {
      code: 'E110',
      name: 'Sunset Yellow FCF (Yellow 6)',
      commonNames: ['yellow 6', 'sunset yellow', 'fd&c yellow 6'],
      adhdEffects: ['Hyperactivity', 'Attention problems', 'Behavioral changes'],
    },
    {
      code: 'E129',
      name: 'Allura Red AC (Red 40)',
      commonNames: ['red 40', 'allura red', 'fd&c red 40'],
      adhdEffects: ['Hyperactivity in children', 'Sleep disturbances', 'Aggression'],
    },
    {
      code: 'E127',
      name: 'Erythrosine (Red 3)',
      commonNames: ['red 3', 'erythrosine', 'fd&c red 3'],
      adhdEffects: ['Hyperactivity', 'Thyroid issues', 'Behavioral problems'],
    },
    {
      code: 'E133',
      name: 'Brilliant Blue FCF (Blue 1)',
      commonNames: ['blue 1', 'brilliant blue', 'fd&c blue 1'],
      adhdEffects: ['Hyperactivity', 'Allergic reactions', 'Learning difficulties'],
    },
    {
      code: 'E132',
      name: 'Indigotine (Blue 2)',
      commonNames: ['blue 2', 'indigo carmine', 'fd&c blue 2'],
      adhdEffects: ['Hyperactivity', 'Brain tumors (animal studies)', 'Attention issues'],
    },
    {
      code: 'E104',
      name: 'Quinoline Yellow',
      commonNames: ['quinoline yellow', 'yellow 10'],
      adhdEffects: ['Hyperactivity', 'Skin rashes', 'Asthma'],
    },
  ],
  
  // Medium Risk - Some evidence of ADHD impact
  medium: [
    {
      code: 'E211',
      name: 'Sodium Benzoate',
      commonNames: ['sodium benzoate', 'benzoate of soda'],
      adhdEffects: ['Hyperactivity when combined with colors', 'Attention problems'],
    },
    {
      code: 'E320',
      name: 'BHA (Butylated Hydroxyanisole)',
      commonNames: ['bha', 'butylated hydroxyanisole'],
      adhdEffects: ['Hyperactivity', 'Hormonal disruption', 'Focus issues'],
    },
    {
      code: 'E321',
      name: 'BHT (Butylated Hydroxytoluene)',
      commonNames: ['bht', 'butylated hydroxytoluene'],
      adhdEffects: ['Hyperactivity', 'Behavioral changes', 'Sleep problems'],
    },
  ],
};

// Generic placeholder image for products without images
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjQwIiB5PSI1MCIgd2lkdGg9IjgiIGhlaWdodD0iODAiIGZpbGw9IiM5Q0EzQUYiLz4KPHJlY3QgeD0iNTIiIHk9IjUwIiB3aWR0aD0iNCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSI2MCIgeT0iNTAiIHdpZHRoPSI4IiBoZWlnaHQ9IjgwIiBmaWxsPSIjOUNBM0FGIi8+CjxyZWN0IHg9IjcyIiB5PSI1MCIgd2lkdGg9IjQiIGhlaWdodD0iODAiIGZpbGw9IiM5Q0EzQUYiLz4KPHJlY3QgeD0iODAiIHk9IjUwIiB3aWR0aD0iMTIiIGhlaWdodD0iODAiIGZpbGw9IiM5Q0EzQUYiLz4KPHJlY3QgeD0iOTYiIHk9IjUwIiB3aWR0aD0iNCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSIxMDQiIHk9IjUwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSIxMTYiIHk9IjUwIiB3aWR0aD0iNCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSIxMjQiIHk9IjUwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSIxMzYiIHk9IjUwIiB3aWR0aD0iNCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSIxNDQiIHk9IjUwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8cmVjdCB4PSIxNTYiIHk9IjUwIiB3aWR0aD0iNCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxMDAiIHk9IjE1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBpbWFnZSBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==';

class ProductService {
  // API Keys - Get these free from each service
  static API_KEYS = {
    USDA: '5QlF40l69GTeey5t3lPgc02BcWOthCTg6ZaAbZW9',
    NUTRITIONIX_ID: '393c1557',
    NUTRITIONIX_KEY: '6cefab30a7a318a0cfb93fa2263ec883',
    SPOONACULAR: '1f66fca067fe49bca59115e88fde84ac',
    EDAMAM_ID: '',
    EDAMAM_KEY: ''
  };

/**
   * 🔢 UNIVERSAL BARCODE NORMALIZER
   * Converts between UPC-A (12-digit) and EAN-13 (13-digit) formats
   * Returns array of barcode variations to try
   */
  static getBarcodeVariations(barcode) {
    const cleanBarcode = barcode.trim();
    const variations = [cleanBarcode]; // Always try original first
    
    console.log('🔢 Analyzing barcode format:', cleanBarcode);
    console.log('   Length:', cleanBarcode.length, 'digits');
    
    if (cleanBarcode.length === 12) {
      // UPC-A: Add leading zero to convert to EAN-13
      const ean13 = '0' + cleanBarcode;
      variations.push(ean13);
      console.log('   Format: UPC-A (12-digit)');
      console.log('   Will also try EAN-13:', ean13);
    } else if (cleanBarcode.length === 13) {
      // EAN-13: Remove leading zero if it exists to try UPC-A
      if (cleanBarcode.startsWith('0')) {
        const upcA = cleanBarcode.substring(1);
        variations.push(upcA);
        console.log('   Format: EAN-13 (13-digit)');
        console.log('   Will also try UPC-A:', upcA);
      } else {
        console.log('   Format: EAN-13 (13-digit, non-US)');
      }
    } else if (cleanBarcode.length === 8) {
      console.log('   Format: EAN-8 (8-digit)');
    } else {
      console.log('   ⚠️  Format: Unknown length');
    }
    
    console.log('   Total variations to try:', variations.length);
    return variations;
  }

  /**
   * 🔍 SMART API CALLER
   * Tries all barcode variations with a given API function
   * Returns first successful result
   */
  static async tryBarcodeVariations(apiFetchFunction, barcode, apiName) {
    const variations = this.getBarcodeVariations(barcode);
    
    for (let i = 0; i < variations.length; i++) {
      const currentBarcode = variations[i];
      console.log(`   🔄 ${apiName}: Trying variation ${i + 1}/${variations.length}: ${currentBarcode}`);
      
      try {
        const result = await apiFetchFunction(currentBarcode);
        if (result) {
          console.log(`   ✅ ${apiName}: SUCCESS with barcode format: ${currentBarcode}`);
          return result;
        } else {
          console.log(`   ❌ ${apiName}: Not found with ${currentBarcode}`);
        }
      } catch (error) {
        console.log(`   ⚠️  ${apiName}: Error with ${currentBarcode}:`, error.message);
      }
    }
    
    console.log(`   ❌ ${apiName}: Failed with all ${variations.length} barcode variations`);
    return null;
  }

  /**
   * Main function called by App.js - maintains backward compatibility
   * ENHANCED: Now includes product images, detailed additives, and product caching
   */
  static async fetchProductByBarcode(barcode) {
    // 🔥 CHECK PRODUCT CACHE FIRST
    try {
      const cacheKey = `product_cache_${barcode}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
  const cached = JSON.parse(cachedData);
  const cacheAge = Date.now() - new Date(cached.cachedAt).getTime();
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  
  if (cacheAge < maxAge) {
    console.log('✅ Using cached product data (age: ' + Math.round(cacheAge / (24 * 60 * 60 * 1000)) + ' days)');
    
    // LOG CACHED SCORE
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📊 CACHED PRODUCT SCORE');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📦 Product:', cached.product.name);
    console.log('🎯 Grade:', cached.product.healthScore?.grade);
    console.log('📊 Score:', cached.product.healthScore?.score + '/100');
    console.log('📝 Status:', cached.product.healthScore?.status);
    console.log('⚠️  Warnings:', cached.product.healthScore?.warnings?.length || 0);
    console.log('══════════════════════════════════════════════════════════');
    console.log('');
    
    return cached.product;
  } else {
    console.log('⚠️ Cache expired, fetching fresh data');
  }
}
    } catch (error) {
      console.log('Cache read error:', error);
    }
    
    // Continue with normal API calls...
    const getEnglishText = (prod, field) => {
      return prod[`${field}_en`] || prod[`${field}_eng`] || prod[field] || '';
    };
    console.log('🔍 Searching for barcode:', barcode);
    console.log('📊 API Status - USDA Key:', this.API_KEYS.USDA ? 'Present' : 'Missing');
    let product = null;
    let source = '';
    let sourcesUsed = [];

    // Helper to merge nutriments without losing data
    const mergeNutriments = (existing, newData) => {
      if (!newData) return existing || {};
      const merged = { ...(existing || {}) };
      Object.keys(newData).forEach(key => {
        if ((merged[key] === undefined || merged[key] === null) && newData[key] !== undefined) {
          merged[key] = newData[key];
        }
      });
      return merged;
    };

    // Try Open Food Facts first (no API key needed) - WITH BARCODE VARIATIONS
    console.log('📡 Trying Open Food Facts...');
    
    const barcodeVariations = this.getBarcodeVariations(barcode);
    
    for (const currentBarcode of barcodeVariations) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      try {
        console.log(`   🔄 Trying barcode: ${currentBarcode}`);
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${currentBarcode}.json`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
          product = data.product;
          product.ingredients_text = getEnglishText(product, 'ingredients_text');
          source = 'Open Food Facts';
          sourcesUsed.push('Open Food Facts');
          console.log('✅ Found in Open Food Facts:', product.product_name);
          console.log('✅ Working barcode format:', currentBarcode);
          break; // Success! Stop trying other variations
        } else {
          console.log(`   ❌ Not found with barcode: ${currentBarcode}`);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.log(`   ⏱️ Timeout with barcode: ${currentBarcode}`);
        } else {
          console.error(`   ⚠️  Error with barcode ${currentBarcode}:`, error.message);
        }
      }
    }
    
    if (!product) {
      console.log('❌ Not found in Open Food Facts with any barcode variation');
    }

    // Check if we need more nutrition data
    const needsMoreData = !product || 
      !product.nutriments?.['sugars_100g'] === undefined ||
      !product.nutriments?.['sodium_100g'] === undefined ||
      !product.nutriments?.['energy-kcal_100g'] === undefined;

    // Try USDA for missing data
    if (needsMoreData && this.API_KEYS.USDA && this.API_KEYS.USDA !== 'DEMO_KEY') {
      try {
        console.log('📡 Trying USDA database...');
        const usdaProduct = await this.tryBarcodeVariations(
          (bc) => this.fetchFromUSDA(bc),
          barcode,
          'USDA'
        );
        if (usdaProduct) {
          if (!product) {
            product = usdaProduct;
            source = 'USDA';
          } else {
            product.product_name = product.product_name || usdaProduct.product_name;
            product.brands = product.brands || usdaProduct.brands;
            product.ingredients_text = product.ingredients_text || usdaProduct.ingredients_text;
            product.nutriments = mergeNutriments(product.nutriments, usdaProduct.nutriments);
          }
          sourcesUsed.push('USDA');
          console.log('✅ Data from USDA merged');
        } else {
          console.log('❌ Not found in USDA');
        }
      } catch (error) {
        console.error('USDA error:', error);
      }
    }

    // Try Nutritionix for missing data
    if (needsMoreData && this.API_KEYS.NUTRITIONIX_ID) {
      try {
        console.log('📡 Trying Nutritionix...');
        const nutritionixProduct = await this.tryBarcodeVariations(
          (bc) => this.fetchFromNutritionix(bc),
          barcode,
          'Nutritionix'
        );
        if (nutritionixProduct) {
          if (!product) {
            product = nutritionixProduct;
            source = 'Nutritionix';
          } else {
            product.product_name = product.product_name || nutritionixProduct.product_name;
            product.brands = product.brands || nutritionixProduct.brands;
            product.ingredients_text = product.ingredients_text || nutritionixProduct.ingredients_text;
            product.nutriments = mergeNutriments(product.nutriments, nutritionixProduct.nutriments);
            product.image_front_url = product.image_front_url || nutritionixProduct.image_front_url;
          }
          sourcesUsed.push('Nutritionix');
          console.log('✅ Data from Nutritionix merged');
        }
      } catch (error) {
        console.error('Nutritionix error:', error);
      }
    }

    // Try Spoonacular for missing data
    if (needsMoreData && this.API_KEYS.SPOONACULAR) {
      try {
        console.log('📡 Trying Spoonacular...');
        const spoonProduct = await this.tryBarcodeVariations(
          (bc) => this.fetchFromSpoonacular(bc),
          barcode,
          'Spoonacular'
        );
        if (spoonProduct) {
          if (!product) {
            product = spoonProduct;
            source = 'Spoonacular';
          } else {
            product.product_name = product.product_name || spoonProduct.product_name;
            product.brands = product.brands || spoonProduct.brands;
            product.ingredients_text = product.ingredients_text || spoonProduct.ingredients_text;
            product.nutriments = mergeNutriments(product.nutriments, spoonProduct.nutriments);
          }
          sourcesUsed.push('Spoonacular');
          console.log('✅ Data from Spoonacular merged');
        } else {
          console.log('❌ Not found in Spoonacular');
        }
      } catch (error) {
        console.error('Spoonacular error:', error);
      }
    }

    // Update source to show all APIs used
    if (sourcesUsed.length > 1) {
      source = sourcesUsed.join(' + ');
      console.log(`✅ Data aggregated from: ${source}`);
    }

    // Process the product if found
    if (product) {
  // CHECK IF WE HAVE SUFFICIENT DATA TO SCORE
      const hasIngredients = !!(
        product.ingredients_text && 
        product.ingredients_text.trim().length > 10
      );
      
      const hasNutritionData = !!(
        product.nutriments && 
        product.nutriments['sugars_100g'] !== undefined &&
        product.nutriments['sodium_100g'] !== undefined
      );
      
      // DETAILED DEBUG LOGGING
      console.log('');
      console.log('══════════════════════════════════════════════════════════');
      console.log('DEBUG: DATA SUFFICIENCY CHECK');
      console.log('══════════════════════════════════════════════════════════');
      console.log('Product Name:', product.product_name || 'UNKNOWN');
      console.log('Has Ingredients:', hasIngredients);
      console.log('Ingredients text:', product.ingredients_text || 'NONE');
      console.log('Ingredients length:', (product.ingredients_text || '').length);
      console.log('');
      console.log('Has Nutrition Data:', hasNutritionData);
      console.log('Sugar (sugars_100g):', product.nutriments?.['sugars_100g']);
      console.log('Sodium (sodium_100g):', product.nutriments?.['sodium_100g']);
      console.log('Energy (energy-kcal_100g):', product.nutriments?.['energy-kcal_100g']);
      console.log('');
      console.log('All nutriments keys:', Object.keys(product.nutriments || {}));
      console.log('══════════════════════════════════════════════════════════');
      console.log('');
      
      // If missing critical data, return with "insufficient data" status
      if (!hasIngredients || !hasNutritionData) {
        console.log('🚫 EARLY RETURN: Product has insufficient data for scoring');
        console.log('   Missing:', !hasIngredients ? 'INGREDIENTS' : 'NUTRITION DATA');
        console.log('   Will return grade "?" with insufficient data message');
        console.log('');
        
        return {
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          image: this.getProductImage(product),
          healthScore: {
            score: 0,
            grade: '?',
            status: 'Insufficient Data',
            warnings: [{
              title: 'Product Not Fully in Database',
              description: `Missing ${!hasIngredients ? 'ingredients list' : 'nutrition data'}. Cannot provide complete health analysis. (Source: ${source})`,
              severity: 'info'
            }]
          },
          missingData: true,
          source: source,
          rawData: product
        };
      }
      
      // We have enough data - calculate health score
      console.log('✅ Product has sufficient data - proceeding to scoring...');
      console.log('');
      
      const healthScore = this.calculateHealthScore(product);
      
      console.log('');
      console.log('✅ Scoring complete! Final grade:', healthScore.grade, 'Score:', healthScore.score);
      console.log('');
      
      // Process additives with detailed information
      console.log('Additives tags:', product.additives_tags);
      const detailedAdditives = this.processDetailedAdditives(product.additives_tags || []);
      
      // Get positive attributes
      const positiveAttributes = this.getPositiveAttributes(product);
      
      // Return in format expected by App.js WITH NEW ENHANCEMENTS
      const finalProduct = {
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        
        // Image data
        image: this.getProductImage(product),
        imageUrl: product.image_front_url || product.image_url || null,
        
        // Enhanced additives information
        additives: detailedAdditives.all,
        criticalAdditives: detailedAdditives.critical,
        concerningAdditives: detailedAdditives.concerning,
        minorAdditives: detailedAdditives.minor,
        
        // Positive attributes
        positiveAttributes: positiveAttributes,
        healthScore: healthScore,
        ingredients: product.ingredients_text || '',
        categories: product.categories || '',

        // Nutrition data
        nutrition: {
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
          sugar: product.nutriments?.['sugars_100g'] || 0,
          saturatedFat: product.nutriments?.['saturated-fat_100g'] || 0,
          sodium: product.nutriments?.['sodium_100g'] || 0,
          fiber: product.nutriments?.['fiber_100g'] || 0,
          protein: product.nutriments?.['proteins_100g'] || 0,
          carbs: product.nutriments?.['carbohydrates_100g'] || 0,
          fat: product.nutriments?.['fat_100g'] || 0
        },

        // Ingredients list
        ingredientsList: product.ingredients || [],

        // Allergens
        allergens: product.allergens_tags || [],
        allergensList: product.allergens || '',

        // Additional data
        servingSize: product.serving_size || '100g',
        novaGroup: product.nova_group || null,
        nutriscoreGrade: product.nutriscore_grade || null,
        barcode: barcode,
        
        // Color coding for UI
        healthColor: this.getHealthColor(healthScore.grade),
        cardBackgroundColor: this.getCardBackgroundColor(healthScore.grade),
        
        // Existing fields
        missingData: false,
        source: source,
        rawData: product
      };
      
      // 🚨 CHECK FOR RECALLS BEFORE RETURNING
      console.log('');
      console.log('🚨 Checking if product is recalled...');
      const recallData = await RecallService.checkProductRecall(barcode, {
        name: finalProduct.name,
        brand: finalProduct.brand
      });
      
      // Add recall data to product object
      if (recallData) {
        finalProduct.recall = recallData;
        console.log('🚨 RECALL DATA ADDED TO PRODUCT');
      } else {
        finalProduct.recall = null;
        console.log('✅ No recall - product is safe');
      }
      
      // 🔥 SAVE TO CACHE FOR NEXT TIME
      try {
        const cacheKey = `product_cache_${barcode}`;
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          product: finalProduct,
          cachedAt: new Date().toISOString()
        }));
        console.log('✅ Product cached for future scans');
      } catch (error) {
        console.log('Cache write error:', error);
      }
      
      return finalProduct;
    }
    
    console.log('❌ Product not found in any database');
    return null;
  }

  /**
   * Get product image with fallback
   */
  static getProductImage(product) {
    const imageUrl = product.image_front_url || 
                    product.image_url || 
                    product.image_front_small_url ||
                    product.image_small_url ||
                    product.image_thumb_url;
    
    return imageUrl || PLACEHOLDER_IMAGE;
  }

  /**
   * Process additives with detailed information
   */
  static processDetailedAdditives(additivesTags) {
    if (!additivesTags || additivesTags.length === 0) {
      return {
        all: [],
        critical: [],
        concerning: [],
        minor: []
      };
    }
    
    const processedAdditives = additivesTags.map((tag, index) => {
      let cleanTag = tag;
      if (tag.includes(':')) {
        cleanTag = tag.split(':')[1];
      }
      
      const additiveInfo = getAdditiveInfo(cleanTag);
      return {
        ...additiveInfo,
        originalTag: tag,
        index: index + 1,
      };
    }).sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2, unknown: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    return {
      all: processedAdditives,
      critical: processedAdditives.filter(a => a.severity === 'high'),
      concerning: processedAdditives.filter(a => a.severity === 'medium'),
      minor: processedAdditives.filter(a => a.severity === 'low')
    };
  }

  /**
   * Get positive attributes of the product
   */
  static getPositiveAttributes(product) {
    const attributes = [];
    const ingredients = (product.ingredients_text || '').toLowerCase();
    const labels = (product.labels || '').toLowerCase();
    
    if (labels.includes('organic') || ingredients.includes('organic')) {
      attributes.push('USDA Organic certified');
    }
    
    const sugars = product.nutriments?.sugars_100g || 0;
    if (sugars === 0) {
      attributes.push('No sugar');
    } else if (sugars < 5) {
      attributes.push('Low sugar');
    }
    
    const sodium = product.nutriments?.sodium_100g || 0;
    if (sodium < 0.3) {
      attributes.push('Low sodium');
    }
    
    const fiber = product.nutriments?.fiber_100g || 0;
    if (fiber > 6) {
      attributes.push('High fiber');
    } else if (fiber > 3) {
      attributes.push('Good source of fiber');
    }
    
    const protein = product.nutriments?.proteins_100g || 0;
    if (protein > 20) {
      attributes.push('High protein');
    } else if (protein > 10) {
      attributes.push('Good source of protein');
    }
    
    if (labels.includes('vegan')) {
      attributes.push('Vegan');
    } else if (labels.includes('vegetarian')) {
      attributes.push('Vegetarian');
    }
    
    if (labels.includes('non-gmo') || labels.includes('non gmo')) {
      attributes.push('Non-GMO Project Verified');
    }
    
    if (labels.includes('gluten-free') || labels.includes('gluten free')) {
      attributes.push('Certified Gluten-Free');
    }
    
    if (!product.additives_tags || product.additives_tags.length === 0) {
      attributes.push('No artificial additives');
    }
    
    if (ingredients.includes('whole grain') || ingredients.includes('whole wheat')) {
      attributes.push('Contains whole grains');
    }
    
    const calories = product.nutriments?.['energy-kcal_100g'] || 0;
    if (calories === 0) {
      attributes.push('Zero calories');
    } else if (calories < 40) {
      attributes.push('Low calorie');
    }
    
    return attributes;
  }

  /**
   * Get color for UI based on grade
   */
  static getHealthColor(grade) {
    const colors = {
      'A': '#10B981',
      'A-': '#34D399',
      'B+': '#84CC16',
      'B': '#A3E635',
      'B-': '#BEF264',
      'C+': '#F59E0B',
      'C': '#FBBF24',
      'C-': '#FCD34D',
      'D+': '#F97316',
      'D': '#FB923C',
      'D-': '#FDBA74',
      'F': '#EF4444'
    };
    return colors[grade] || '#6B7280';
  }

  /**
   * Get background color for product card
   */
  static getCardBackgroundColor(grade) {
    const colors = {
      'A': '#DCFCE7',
      'A-': '#D1FAE5',
      'B+': '#ECFCCB',
      'B': '#F0FDF4',
      'B-': '#F7FEE7',
      'C+': '#FEF3C7',
      'C': '#FEF9C3',
      'C-': '#FEFCE8',
      'D+': '#FED7AA',
      'D': '#FFEDD5',
      'D-': '#FEF2E8',
      'F': '#FEE2E2'
    };
    return colors[grade] || '#F3F4F6';
  }

  /**
   * USDA FoodData Central API
   */
  static async fetchFromUSDA(barcode) {
    console.log('🔄 USDA API call with key:', this.API_KEYS.USDA.substring(0, 10) + '...');
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${barcode}&api_key=${this.API_KEYS.USDA}`
    );
    
    console.log('USDA Response status:', response.status);
    if (response.status === 403) {
      console.error('❌ USDA API Key is invalid or expired!');
      throw new Error('Invalid USDA API key');
    }
    
    const data = await response.json();
    console.log('USDA found', data.foods?.length || 0, 'products');
    
    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0];
      
      const nutrients = {};
      if (food.foodNutrients) {
        food.foodNutrients.forEach(nutrient => {
          switch(nutrient.nutrientName) {
            case 'Sugars, total including NLEA':
            case 'Total Sugars':
              nutrients['sugars_100g'] = nutrient.value;
              break;
            case 'Sodium, Na':
              nutrients['sodium_100g'] = nutrient.value / 10;
              break;
            case 'Fatty acids, total saturated':
              nutrients['saturated-fat_100g'] = nutrient.value;
              break;
            case 'Fiber, total dietary':
              nutrients['fiber_100g'] = nutrient.value;
              break;
            case 'Protein':
              nutrients['proteins_100g'] = nutrient.value;
              break;
            case 'Energy':
              nutrients['energy-kcal_100g'] = nutrient.value;
              break;
          }
        });
      }

      return {
        product_name: food.description,
        brands: food.brandOwner || food.brandName || 'Generic',
        nutriments: nutrients,
        ingredients_text: food.ingredients || '',
        categories: food.foodCategory || ''
      };
    }
    return null;
  }

  /**
   * Nutritionix API
   */
  static async fetchFromNutritionix(barcode) {
    try {
      const response = await fetch(
        `https://trackapi.nutritionix.com/v2/search/item?upc=${barcode}`,
        {
          headers: {
            'x-app-id': this.API_KEYS.NUTRITIONIX_ID,
            'x-app-key': this.API_KEYS.NUTRITIONIX_KEY
          }
        }
      );
      
      if (!response.ok) {
        console.log('Nutritionix response not OK:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (!data || !data.foods || data.foods.length === 0) {
        console.log('❌ Not found in Nutritionix');
        return null;
      }
      
      const food = data.foods[0];
      
      if (!food.serving_weight_grams || food.serving_weight_grams === 0) {
        console.log('Missing serving weight in Nutritionix data');
        return null;
      }
      
      const servingWeight = food.serving_weight_grams || 100;
      
      return {
        product_name: food.food_name || 'Unknown Product',
        brands: food.brand_name || 'Unknown Brand',
        nutriments: {
          'sugars_100g': food.nf_sugars ? (food.nf_sugars / servingWeight) * 100 : 0,
          'sodium_100g': food.nf_sodium ? (food.nf_sodium / servingWeight) * 100 / 1000 : 0,
          'saturated-fat_100g': food.nf_saturated_fat ? (food.nf_saturated_fat / servingWeight) * 100 : 0,
          'fiber_100g': food.nf_dietary_fiber ? (food.nf_dietary_fiber / servingWeight) * 100 : 0,
          'proteins_100g': food.nf_protein ? (food.nf_protein / servingWeight) * 100 : 0,
          'energy-kcal_100g': food.nf_calories ? (food.nf_calories / servingWeight) * 100 : 0,
          'carbohydrates_100g': food.nf_total_carbohydrate ? (food.nf_total_carbohydrate / servingWeight) * 100 : 0,
          'fat_100g': food.nf_total_fat ? (food.nf_total_fat / servingWeight) * 100 : 0
        },
        ingredients_text: food.nf_ingredient_statement || '',
        categories: '',
        image_front_url: food.photo ? food.photo.thumb : null
      };
    } catch (error) {
      console.error('Nutritionix API error:', error);
      return null;
    }
  }

  /**
   * Spoonacular API
   */
  static async fetchFromSpoonacular(barcode) {
    const apiKey = '1f66fca067fe49bca59115e88fde84ac';
    const url = `https://api.spoonacular.com/food/products/upc/${barcode}?apiKey=${apiKey}`;
    
    try {
      console.log('🔍 Fetching from Spoonacular for barcode:', barcode);
      const response = await fetch(url);
      
      console.log('📡 Spoonacular response status:', response.status);
      
      if (!response.ok) {
        console.log('❌ Spoonacular response not OK:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      console.log('🔴 COMPLETE SPOONACULAR RAW DATA:');
      console.log(JSON.stringify(data, null, 2));
      
      if (!data || !data.title) {
        console.log('❌ Invalid Spoonacular data structure');
        return null;
      }

      const ingredientsText = data.ingredientList || '';
      const ingredientsLower = ingredientsText.toLowerCase();
      
      const detectedAdditives = [];
      const additivePatterns = [
        /\be\d{3}[a-z]?\b/gi,
        /\b(lecithin|vanillin|maltodextrin|dextrose|xanthan|guar|carrageenan|citric acid|ascorbic acid|tocopherol|caramel color|annatto)\b/gi,
        /\b(artificial|imitation|synthetic)\s+\w+/gi,
        /\b(sodium benzoate|potassium sorbate|bha|bht|tbhq|sodium nitrite)\b/gi,
        /\b(aspartame|sucralose|saccharin|acesulfame|stevia|sorbitol|xylitol)\b/gi,
        /\b(msg|monosodium glutamate|disodium inosinate|disodium guanylate|autolyzed yeast)\b/gi
      ];
      
      additivePatterns.forEach(pattern => {
        const matches = ingredientsText.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!detectedAdditives.includes(match.toLowerCase())) {
              detectedAdditives.push(match.toLowerCase());
            }
          });
        }
      });

      let novaLevel = 1;
      
      if (ingredientsLower.includes('artificial') || 
          ingredientsLower.includes('modified') ||
          ingredientsLower.includes('hydrogenated') ||
          detectedAdditives.length > 5) {
        novaLevel = 4;
      } else if (detectedAdditives.length > 2 || 
                 ingredientsLower.includes('preservative')) {
        novaLevel = 3;
      } else if (data.ingredientCount > 5) {
        novaLevel = 2;
      }

      if (ingredientsLower.includes('carbonated') && ingredientsLower.includes('sugar') && 
          (ingredientsLower.includes('caramel') || ingredientsLower.includes('phosphoric'))) {
        novaLevel = 4;
      }

      if (ingredientsLower.includes('natural flavour') || ingredientsLower.includes('natural flavor')) {
        if (!detectedAdditives.includes('natural flavoring')) {
          detectedAdditives.push('natural flavoring');
        }
      }

      const nutrition = data.nutrition || {};
      const nutrients = nutrition.nutrients || [];
      
      let sugarValue = 0;
      if (nutrition.sugar) {
        sugarValue = parseFloat(nutrition.sugar.replace(/[^0-9.]/g, ''));
      } else if (nutrients.length > 0) {
        const sugarNutrient = nutrients.find(n => 
          n.name.toLowerCase().includes('sugar') && 
          !n.name.toLowerCase().includes('added')
        );
        if (sugarNutrient) {
          sugarValue = sugarNutrient.amount || 0;
        }
      }
      
      const formattedProduct = {
        product_name: data.title,
        brands: data.brand || 'Unknown Brand',
        
        nutriments: {
          'calories': Math.round((nutrition.calories || 0) * 10) / 10,
          'fat_100g': Math.round(parseFloat(nutrition.fat?.replace('g', '') || 0) * 10) / 10,
          'saturated-fat_100g': Math.round(parseFloat(nutrition.saturatedFat?.replace('g', '') || 0) * 10) / 10,
          'carbohydrates_100g': Math.round(parseFloat(nutrition.carbs?.replace('g', '') || 0) * 10) / 10,
          'sugars_100g': Math.round(sugarValue * 10) / 10,
          'fiber_100g': Math.round(parseFloat(nutrition.fiber?.replace('g', '') || 0) * 10) / 10,
          'proteins_100g': Math.round(parseFloat(nutrition.protein?.replace('g', '') || 0) * 10) / 10,
          'sodium_100g': Math.round(parseFloat(nutrition.sodium?.replace('mg', '') || 0) / 1000 * 10) / 10,
          'energy-kcal_100g': Math.round((nutrition.calories || 0) * 10) / 10
        },
        
        ingredients_text: ingredientsText
          .split(',')
          .map(ing => {
            return ing.trim()
              .toLowerCase()
              .replace(/\b\w/g, char => char.toUpperCase());
          })
          .join(', '),
        
        additives_tags: detectedAdditives.map(add => `en:${add.replace(/\s+/g, '-')}`),
        nova_group: novaLevel,
        image_front_url: data.image || null,
        source: 'spoonacular'
      };

      return formattedProduct;
      
    } catch (error) {
      console.error('❌ Spoonacular fetch error:', error);
      return null;
    }
  }

  /**

   * Check user allergens - FIXED VERSION
   */
  static checkUserAllergens(product, userFilters) {
    const warnings = [];
    const ingredients = (product.ingredients_text || '').toLowerCase();
    const labels = (product.labels || '').toLowerCase();

    const allergenMap = {
      'gluten-free': {
        keywords: ['wheat flour', 'barley', 'rye', 'malt', 'wheat bread', 'semolina', 'spelt', 'kamut', 'triticale'],
        excludeKeywords: ['gluten-free', 'gluten free', 'cassava flour', 'coconut flour', 'almond flour', 'rice flour', 'corn flour', 'tapioca flour', 'chickpea flour', 'oat flour'],
        checkLabels: ['no-gluten', 'gluten-free', 'certified-gluten-free'],
        warning: 'Contains Gluten'
      },
      'dairy-free': {
        keywords: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'whey', 'casein', 'lactose'],
        excludeKeywords: ['coconut milk', 'almond milk', 'oat milk', 'soy milk', 'rice milk', 'cashew milk'],
        checkLabels: ['dairy-free', 'vegan'],
        warning: 'Contains Dairy'
      },
      'tree-nuts': {
        keywords: ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut'],
        excludeKeywords: ['coconut'],
        checkLabels: ['tree-nut-free'],
        warning: 'Contains Tree Nuts'
      },
      'peanuts': {
        keywords: ['peanut', 'groundnut', 'arachis'],
        excludeKeywords: [],
        checkLabels: ['peanut-free'],
        warning: 'Contains Peanuts'
      },
      'soy-free': {
        keywords: ['soy', 'soya', 'soybeans', 'tofu', 'tempeh', 'miso'],
        excludeKeywords: [],
        checkLabels: ['soy-free'],
        warning: 'Contains Soy'
      },
      'eggs': {
        keywords: ['egg', 'albumin', 'mayonnaise', 'meringue'],
        excludeKeywords: [],
        checkLabels: ['egg-free', 'vegan'],
        warning: 'Contains Eggs'
      },
      'shellfish': {
        keywords: ['shrimp', 'crab', 'lobster', 'shellfish', 'prawn', 'crawfish'],
        excludeKeywords: [],
        checkLabels: ['shellfish-free'],
        warning: 'Contains Shellfish'
      },
      'fish': {
        keywords: ['fish', 'salmon', 'tuna', 'cod', 'anchovy', 'sardine', 'trout'],
        excludeKeywords: [],
        checkLabels: ['fish-free'],
        warning: 'Contains Fish'
      },
      'no-dyes': {
        keywords: ['red 40', 'yellow 5', 'yellow 6', 'blue 1', 'red 3', 'e129', 'e102', 'e110', 'e133', 'e127',
                   'artificial color', 'fd&c', 'food coloring', 'food dye'],
        excludeKeywords: [],
        checkLabels: [],
        warning: 'Contains Artificial Dyes'
      },
      'low-sugar': {
        keywords: ['high fructose corn syrup', 'corn syrup', 'dextrose', 'maltose', 'sucrose'],
        excludeKeywords: [],
        checkLabels: [],
        warning: 'High Sugar Content',
        checkNutrients: true,
        nutrientThreshold: 10
      },
      'low-sodium': {
        keywords: ['salt', 'sodium'],
        excludeKeywords: [],
        checkLabels: [],
        warning: 'High Sodium Content',
        checkNutrients: true,
        nutrientThreshold: 400
      },
      'no-msg': {
        keywords: ['msg', 'monosodium glutamate', 'e621', 'glutamate', 'yeast extract'],
        excludeKeywords: [],
        checkLabels: [],
        warning: 'Contains MSG'
      }
    };

    userFilters.forEach(filter => {
      const filterData = allergenMap[filter];
      if (!filterData) return;

      // STEP 1: Check if product has certification labels (MOST RELIABLE)
      if (filterData.checkLabels && filterData.checkLabels.length > 0) {
        const hasCertification = filterData.checkLabels.some(label => labels.includes(label));
        if (hasCertification) {
          console.log(`✅ ${filter}: Product certified safe (${filterData.checkLabels.join(', ')})`);
          return;
        }
      }

      let found = false;

      // STEP 2: Check ingredients for allergen keywords
      if (filterData.keywords) {
        // First, check if any EXCLUDE keywords are present
        if (filterData.excludeKeywords && filterData.excludeKeywords.length > 0) {
          const hasExclude = filterData.excludeKeywords.some(keyword => ingredients.includes(keyword));
          if (hasExclude) {
            console.log(`✅ ${filter}: Excluded by safe ingredient`);
            return;
          }
        }

        // Now check for allergen keywords
        found = filterData.keywords.some(keyword => ingredients.includes(keyword));
      }

      // STEP 3: Check nutrient thresholds
      if (filterData.checkNutrients && product.nutriments) {
        if (filter === 'low-sugar' && product.nutriments['sugars_100g'] > filterData.nutrientThreshold) {
          found = true;
        }
        if (filter === 'low-sodium' && product.nutriments['sodium_100g'] > filterData.nutrientThreshold) {
          found = true;
        }
      }

      // STEP 4: Add warning if allergen found
      if (found) {
        warnings.push({
          title: `⚠️ ${filterData.warning}`,
          severity: 'high'
        });
        console.log(`⚠️ ${filter}: Allergen detected - ${filterData.warning}`);
      }
    });

    return warnings;
  }

  /**
   * Determine if product is liquid
   */
  static isProductLiquid(product) {
    const liquidCategories = [
      'beverages', 'drinks', 'sodas', 'juices', 'waters', 'milk', 
      'plant-based-milk', 'coffee', 'tea', 'energy-drinks', 'sports-drinks',
      'alcoholic-beverages', 'beers', 'wines', 'spirits', 'yogurts'
    ];
    
    const categories = (product.categories || '').toLowerCase();
    const productName = (product.product_name || '').toLowerCase();
    
    for (const liquidCat of liquidCategories) {
      if (categories.includes(liquidCat)) {
        return true;
      }
    }
    
    const liquidIndicators = ['drink', 'juice', 'water', 'milk', 'cola', 'soda', 'beverage', 'yogurt', 'yoghurt'];
    for (const indicator of liquidIndicators) {
      if (productName.includes(indicator)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Determine NOVA processing level
   */
  static getNOVALevel(product) {
    if (product.nova_group) {
      return parseInt(product.nova_group);
    }
    
    const ingredients = (product.ingredients_text || '').toLowerCase();
    const ingredientsList = product.ingredients || [];
    const ingredientCount = ingredientsList.length || 0;
    
    const hasENumbers = /\bE\d{3}\b/i.test(ingredients);
    
    const ultraProcessedMarkers = [
      'artificial flavor', 'natural flavor', 'modified starch', 'high fructose corn syrup',
      'corn syrup', 'hydrogenated', 'partially hydrogenated', 'maltodextrin',
      'dextrose', 'emulsifier', 'stabilizer', 'color', 'colour', 'preservative',
      'antioxidant', 'aspartame', 'sucralose', 'acesulfame', 'saccharin'
    ];
    
    let hasUltraProcessedMarkers = false;
    for (const marker of ultraProcessedMarkers) {
      if (ingredients.includes(marker)) {
        hasUltraProcessedMarkers = true;
        break;
      }
    }
    
    if (ingredientCount > 5 && (hasUltraProcessedMarkers || hasENumbers)) {
      return 4;
    } else if (ingredientCount >= 3 && ingredientCount <= 5) {
      return 3;
    } else if (ingredientCount === 2) {
      return 2;
    } else {
      return 1;
    }
  }

  /**
   * Check harmful additives
   */
  static checkHarmfulAdditives(product) {
    const ingredientsOriginal = product.ingredients_text || '';
    const ingredients = ingredientsOriginal.toLowerCase().replace(/[,;]/g, ' ');
    
    const productName = (product.product_name || '').toLowerCase();
    const fullText = `${ingredients} ${productName}`;
    
    let totalPenalty = 0;
    const warnings = [];
    const foundIngredients = new Set();
    
    console.log('🔍 Checking ingredients for harmful additives...');
    console.log('📝 Original ingredients:', ingredientsOriginal);
    console.log('📝 Normalized for checking:', ingredients);
    
    for (const category in HARMFUL_INGREDIENTS_DATABASE) {
      const items = HARMFUL_INGREDIENTS_DATABASE[category];
      
      for (const key in items) {
        const item = items[key];
        const itemKey = `${category}-${key}`;
        
        if (foundIngredients.has(itemKey)) continue;
        
        const termsToCheck = [key];
        if (item.aliases && item.aliases.length > 0) {
          termsToCheck.push(...item.aliases);
        }
        
        let found = false;
        let matchedTerm = '';
        
        for (const term of termsToCheck) {
          if (this.checkIngredientMatch(ingredients, term)) {
            found = true;
            matchedTerm = term;
            break;
          }
        }
        
        if (found) {
          foundIngredients.add(itemKey);
          totalPenalty += item.penalty;
          
          warnings.push({
            title: item.name,
            description: item.concern,
            severity: this.getSeverityLevel(item.penalty),
            category: category.replace(/([A-Z])/g, ' $1').trim()
          });
          
          console.log(`⚠️ Found harmful ingredient: ${item.name} (matched: "${matchedTerm}")`);
        }
      }
    }
    
    const eNumberPattern = /\b[eE]\s*\d{3}[a-zA-Z]?\b/g;
    const eNumbers = ingredients.match(eNumberPattern) || [];
    
    for (const eNumber of eNumbers) {
      const normalized = eNumber.toLowerCase().replace(/\s/g, '');
      const eInfo = getAdditiveInfo(`en:${normalized}`);
      
      if (eInfo && eInfo.severity === 'high' && !foundIngredients.has(`e-${normalized}`)) {
        foundIngredients.add(`e-${normalized}`);
        
        const ePenalty = eInfo.severity === 'high' ? 8 : 
                         eInfo.severity === 'medium' ? 5 : 2;
        totalPenalty += ePenalty;
        
        warnings.push({
          title: `${eInfo.name} (${eInfo.code})`,
          description: eInfo.healthImpact || eInfo.description,
          severity: eInfo.severity,
          category: 'E-Number Additive'
        });
        
        console.log(`⚠️ Found E-number: ${eInfo.code} - ${eInfo.name}`);
      }
    }
    
    const cornSyrupVariations = [
      'corn syrup', 'corn-syrup', 'corn syrup solids', 'glucose syrup',
      'glucose-fructose', 'glucose fructose', 'maize syrup'
    ];
    
    for (const variant of cornSyrupVariations) {
      if (ingredients.includes(variant) && !foundIngredients.has('corn-syrup-special')) {
        foundIngredients.add('corn-syrup-special');
        
        const alreadyHasCornSyrup = warnings.some(w => 
          w.title.toLowerCase().includes('corn syrup') || 
          w.title.toLowerCase().includes('hfcs')
        );
        
        if (!alreadyHasCornSyrup) {
          totalPenalty += 8;
          warnings.push({
            title: 'Corn Syrup',
            description: 'High glycemic index, often from GMO corn, linked to obesity',
            severity: 'medium',
            category: 'Sugar/Syrup'
          });
          console.log(`⚠️ Found corn syrup variant: "${variant}"`);
        }
      }
    }
    
    const phosphateVariations = [
      'phosphate', 'phosphoric acid', 'trisodium phosphate', 'sodium phosphate',
      'disodium phosphate', 'monocalcium phosphate', 'calcium phosphate'
    ];
    
    for (const phosphate of phosphateVariations) {
      if (ingredients.includes(phosphate) && !foundIngredients.has(`phosphate-${phosphate}`)) {
        foundIngredients.add(`phosphate-${phosphate}`);
        
        const alreadyHasPhosphate = warnings.some(w => 
          w.title.toLowerCase().includes('phosphate')
        );
        
        if (!alreadyHasPhosphate) {
          totalPenalty += 6;
          warnings.push({
            title: 'Phosphate Additive',
            description: 'May interfere with calcium absorption, linked to kidney issues',
            severity: 'medium',
            category: 'Mineral Additive'
          });
          console.log(`⚠️ Found phosphate: "${phosphate}"`);
        }
      }
    }
    
    warnings.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
    });
    
    console.log(`📊 Total harmful ingredients found: ${warnings.length}`);
    console.log(`📊 Total penalty points: ${totalPenalty}`);
    
    return { 
      penalty: totalPenalty, 
      warnings: warnings
    };
  }

/**
   * Detect ADHD-linked additives in product
   * Returns array of concerning additives for ADHD
   * VERSION 1.0.9 - Enhanced debug logging
   */
  static detectAdhdAdditives(product) {
    const detectedAdditives = [];
    
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('🧠 ADHD DETECTION STARTED');
    console.log('═══════════════════════════════════════════');
    console.log('📦 Product:', product.name || 'Unknown');
    
    // Get ingredients text
    const ingredientsText = (product.ingredients_text || product.ingredients || '').toLowerCase();
    console.log('📋 Ingredients text length:', ingredientsText.length);
    console.log('📋 First 200 chars:', ingredientsText.substring(0, 200));
    
    // Get processed additives from product
    const processedAdditives = product.criticalAdditives || [];
    const concerningAdditives = product.concerningAdditives || [];
    const allAdditives = [...processedAdditives, ...concerningAdditives];
    console.log('📊 Processed additives count:', allAdditives.length);
    if (allAdditives.length > 0) {
      console.log('📊 Processed additives:', allAdditives.map(a => a.code || a.name).join(', '));
    }
    
    // Check warnings array (where additives often appear)
    const warnings = product.healthScore?.warnings || product.warnings || [];
    console.log('⚠️  Warnings array count:', warnings.length);
    if (warnings.length > 0) {
      console.log('⚠️  Warning titles:', warnings.map(w => w.title).join(' | '));
    }
    
    console.log('');
    console.log('🔍 CHECKING HIGH-RISK ADDITIVES (7 total)');
    console.log('─────────────────────────────────────────');
    
    // Check high-risk additives
    for (const additive of ADHD_LINKED_ADDITIVES.high) {
      let found = false;
      let matchedBy = '';
      let matchedTerm = '';
      
      console.log(`\n  Checking: ${additive.name} (${additive.code})`);
      console.log(`  Common names: ${additive.commonNames.join(', ')}`);
      
      // Method 1: Check by E-number code in processed additives
      const foundByCode = allAdditives.find(a => 
        a.code && a.code.toLowerCase() === additive.code.toLowerCase()
      );
      
      if (foundByCode) {
        found = true;
        matchedBy = 'E-number in processed additives';
        matchedTerm = foundByCode.code;
        console.log(`  ✅ MATCH: ${matchedBy} (${matchedTerm})`);
        
        detectedAdditives.push({
          ...foundByCode,
          adhdEffects: additive.adhdEffects,
          severity: 'high',
        });
        continue;
      } else {
        console.log(`  ❌ Not found in processed additives`);
      }
      
      // Method 2: Check warnings array for common names
      for (const warning of warnings) {
        const warningTitle = (warning.title || '').toLowerCase();
        const warningDesc = (warning.description || '').toLowerCase();
        const warningText = `${warningTitle} ${warningDesc}`;
        
        // Check if any common name appears in the warning
        for (const commonName of additive.commonNames) {
          if (warningText.includes(commonName.toLowerCase())) {
            found = true;
            matchedBy = 'warning text';
            matchedTerm = commonName;
            console.log(`  ✅ MATCH: Found "${commonName}" in warning: "${warning.title}"`);
            break;
          }
        }
        
        if (found) break;
      }
      
      if (found && matchedBy === 'warning text') {
        detectedAdditives.push({
          code: additive.code,
          name: additive.name,
          severity: 'high',
          category: 'color',
          description: `Synthetic color additive`,
          healthImpact: `Studies link to ADHD symptoms in children`,
          adhdEffects: additive.adhdEffects,
        });
        continue;
      } else if (!found) {
        console.log(`  ❌ Not found in warnings`);
      }
      
      // Method 3: Check by common names in ingredients text
      for (const commonName of additive.commonNames) {
        if (ingredientsText.includes(commonName.toLowerCase())) {
          found = true;
          matchedBy = 'ingredients text';
          matchedTerm = commonName;
          console.log(`  ✅ MATCH: Found "${commonName}" in ingredients text`);
          
          detectedAdditives.push({
            code: additive.code,
            name: additive.name,
            severity: 'high',
            category: 'color',
            description: `Synthetic color additive`,
            healthImpact: `Studies link to ADHD symptoms in children`,
            adhdEffects: additive.adhdEffects,
          });
          break;
        }
      }
      
      if (!found) {
        console.log(`  ❌ Not found in ingredients text`);
      }
    }
    
    console.log('');
    console.log('🔍 CHECKING MEDIUM-RISK ADDITIVES (3 total)');
    console.log('─────────────────────────────────────────');
    
    // Check medium-risk additives (same logic)
    for (const additive of ADHD_LINKED_ADDITIVES.medium) {
      let found = false;
      let matchedBy = '';
      let matchedTerm = '';
      
      console.log(`\n  Checking: ${additive.name} (${additive.code})`);
      console.log(`  Common names: ${additive.commonNames.join(', ')}`);
      
      // Method 1: Check by E-number code
      const foundByCode = allAdditives.find(a => 
        a.code && a.code.toLowerCase() === additive.code.toLowerCase()
      );
      
      if (foundByCode) {
        found = true;
        matchedBy = 'E-number in processed additives';
        matchedTerm = foundByCode.code;
        console.log(`  ✅ MATCH: ${matchedBy} (${matchedTerm})`);
        
        detectedAdditives.push({
          ...foundByCode,
          adhdEffects: additive.adhdEffects,
          severity: 'medium',
        });
        continue;
      } else {
        console.log(`  ❌ Not found in processed additives`);
      }
      
      // Method 2: Check warnings array
      for (const warning of warnings) {
        const warningTitle = (warning.title || '').toLowerCase();
        const warningDesc = (warning.description || '').toLowerCase();
        const warningText = `${warningTitle} ${warningDesc}`;
        
        for (const commonName of additive.commonNames) {
          if (warningText.includes(commonName.toLowerCase())) {
            found = true;
            matchedBy = 'warning text';
            matchedTerm = commonName;
            console.log(`  ✅ MATCH: Found "${commonName}" in warning: "${warning.title}"`);
            break;
          }
        }
        
        if (found) break;
      }
      
      if (found && matchedBy === 'warning text') {
        detectedAdditives.push({
          code: additive.code,
          name: additive.name,
          severity: 'medium',
          category: 'preservative',
          description: `Preservative/antioxidant`,
          healthImpact: `Some studies link to ADHD symptoms`,
          adhdEffects: additive.addhEffects,
        });
        continue;
      } else if (!found) {
        console.log(`  ❌ Not found in warnings`);
      }
      
      // Method 3: Check ingredients text
      for (const commonName of additive.commonNames) {
        if (ingredientsText.includes(commonName.toLowerCase())) {
          found = true;
          matchedBy = 'ingredients text';
          matchedTerm = commonName;
          console.log(`  ✅ MATCH: Found "${commonName}" in ingredients text`);
          
          detectedAdditives.push({
            code: additive.code,
            name: additive.name,
            severity: 'medium',
            category: 'preservative',
            description: `Preservative/antioxidant`,
            healthImpact: `Some studies link to ADHD symptoms`,
            adhdEffects: additive.adhdEffects,
          });
          break;
        }
      }
      
      if (!found) {
        console.log(`  ❌ Not found in ingredients text`);
      }
    }
    
    // Remove duplicates
    const uniqueAdditives = detectedAdditives.filter((additive, index, self) =>
      index === self.findIndex((a) => a.code === additive.code)
    );
    
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`🧠 ADHD DETECTION COMPLETE`);
    console.log(`📊 Found ${uniqueAdditives.length} ADHD-linked additives`);
    if (uniqueAdditives.length > 0) {
      console.log('📋 Detected additives:');
      uniqueAdditives.forEach(a => {
        console.log(`   - ${a.name} (${a.code}) - ${a.severity} risk`);
      });
    } else {
      console.log('✅ No ADHD-linked additives detected');
    }
    console.log('═══════════════════════════════════════════');
    console.log('');
    
    return uniqueAdditives;
  }

  /**
   * Smart ingredient matching
   */
  static checkIngredientMatch(ingredients, searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (ingredients.includes(term)) {
      return true;
    }
    
    const wordBoundaryPattern = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'i');
    if (wordBoundaryPattern.test(ingredients)) {
      return true;
    }
    
    const variations = [
      term.replace(/ /g, '-'),
      term.replace(/-/g, ' '),
      term.replace(/ /g, ''),
    ];
    
    for (const variant of variations) {
      if (ingredients.includes(variant)) {
        return true;
      }
    }
    
    const modifiedVersions = [
      `modified ${term}`,
      `${term} extract`,
      `${term} powder`,
      `natural ${term}`,
      `artificial ${term}`,
      `${term} flavoring`,
      `${term} flavor`
    ];
    
    for (const modified of modifiedVersions) {
      if (ingredients.includes(modified)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Escape regex characters
   */
  static escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get severity level
   */
  static getSeverityLevel(penalty) {
    if (penalty >= 15) return 'critical';
    if (penalty >= 8) return 'high';
    if (penalty >= 5) return 'medium';
    if (penalty >= 3) return 'low';
    return 'info';
  }

/**
   * Main scoring algorithm - WITH COMPLETE LOGGING
   */
  static calculateHealthScore(product) {
    // ========================================
    // 📊 START SCORING LOG
    // ========================================
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📊 PRODUCT HEALTH SCORING - COMPLETE BREAKDOWN');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📦 Product:', product.product_name || 'Unknown');
    console.log('🏷️  Brand:', product.brands || 'Unknown');
    console.log('🔢 Barcode:', product.code || 'N/A');
    console.log('');
    
    let score = 100;
    const warnings = [];
    
    const nutriments = product.nutriments || {};
    
    const isLiquid = this.isProductLiquid(product);
    const unit = isLiquid ? '100ml' : '100g';
    
    console.log('📊 NUTRITION DATA (per', unit + '):');
    console.log('──────────────────────────────────────────────────────────');
    
    const sugar = nutriments['sugars_100g'] || 0;
    const saturatedFat = nutriments['saturated-fat_100g'] || 0;
    const sodium = nutriments['sodium_100g'] || 0;
    const fiber = nutriments['fiber_100g'] || 0;
    const proteins = nutriments['proteins_100g'] || 0;
    const energy = nutriments['energy-kcal_100g'] || 0;
    const carbs = nutriments['carbohydrates_100g'] || 0;
    const fat = nutriments['fat_100g'] || 0;
    
    console.log('  Energy:         ', energy.toFixed(1), 'kcal');
    console.log('  Carbohydrates:  ', carbs.toFixed(1), 'g');
    console.log('  - Sugar:        ', sugar.toFixed(1), 'g', sugar > 10 ? '⚠️ HIGH' : '');
    console.log('  Fat:            ', fat.toFixed(1), 'g');
    console.log('  - Saturated:    ', saturatedFat.toFixed(1), 'g', saturatedFat > 5 ? '⚠️ HIGH' : '');
    console.log('  Protein:        ', proteins.toFixed(1), 'g', proteins > 10 ? '✅ GOOD' : '');
    console.log('  Fiber:          ', fiber.toFixed(1), 'g', fiber > 3 ? '✅ GOOD' : '');
    console.log('  Sodium:         ', sodium.toFixed(0), 'mg', sodium > 400 ? '⚠️ HIGH' : '');
    console.log('  Product Type:   ', isLiquid ? 'LIQUID' : 'SOLID');
    console.log('');
    
    // Safety override check
    let isSafetyOverride = false;
    if (sugar > 30 || saturatedFat > 10) {
      console.log('🚨 SAFETY OVERRIDE TRIGGERED:');
      console.log('   Sugar:', sugar.toFixed(1), 'g', sugar > 30 ? '(EXTREME)' : '');
      console.log('   Sat Fat:', saturatedFat.toFixed(1), 'g', saturatedFat > 10 ? '(EXTREME)' : '');
      console.log('   Score will be capped at 30 (D- grade)');
      console.log('');
      isSafetyOverride = true;
    }

    const ingredients = (product.ingredients_text || '').toLowerCase();
    const ingredientsList = product.ingredients || [];
    
    // Check if low-calorie product (different scoring)
    const isLowCalorieProduct = energy < 10;
    if (isLowCalorieProduct && ingredientsList.length < 10 && sodium < 500) {
      console.log('🔍 SPECIAL CASE: Low-calorie condiment/seasoning detected');
      console.log('   Using simplified scoring algorithm');
      console.log('');
      
      score = 85;
      console.log('📊 SCORING BREAKDOWN:');
      console.log('──────────────────────────────────────────────────────────');
      console.log('  Starting Score:     85 (low-calorie base)');
      
      if (sodium > 1000) {
        score -= 20;
        console.log('  Sodium Penalty:    -20 (high sodium for condiment)');
        warnings.push({
          title: 'High Sodium for Condiment',
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'medium'
        });
      }
      
      if (ingredients.includes('organic')) {
        score += 10;
        console.log('  Organic Bonus:     +10');
      }
      
      const additiveCheck = this.checkHarmfulAdditives(product);
      score -= additiveCheck.penalty;
      console.log('  Additive Penalty:  -' + additiveCheck.penalty, '(' + additiveCheck.warnings.length + ' harmful ingredients)');
      warnings.push(...additiveCheck.warnings);
      
      score = Math.max(0, Math.min(100, score));
      console.log('──────────────────────────────────────────────────────────');
      console.log('  FINAL SCORE:       ', score);
      console.log('');
      
      let grade, status;
      if (score >= 90) {
        grade = 'A';
        status = 'Excellent Choice';
      } else if (score >= 80) {
        grade = 'A-';
        status = 'Very Good Choice';
      } else if (score >= 75) {
        grade = 'B+';
        status = 'Good Choice';
      } else if (score >= 70) {
        grade = 'B';
        status = 'Moderate - Some Concerns';
      } else if (score >= 65) {
        grade = 'B-';
        status = 'Moderate - Multiple Concerns';
      } else if (score >= 60) {
        grade = 'C+';
        status = 'Poor - Several Issues';
      } else if (score >= 55) {
        grade = 'C';
        status = 'Poor - Many Concerns';
      } else if (score >= 50) {
        grade = 'C-';
        status = 'Poor - Significant Issues';
      } else if (score >= 45) {
        grade = 'D+';
        status = 'Avoid - Unhealthy';
      } else if (score >= 40) {
        grade = 'D';
        status = 'Avoid - Very Unhealthy';
      } else if (score >= 30) {
        grade = 'D-';
        status = 'Avoid - Multiple Health Risks';
      } else {
        grade = 'F';
        status = 'Avoid - Serious Health Concerns';
      }
      
      console.log('🎯 FINAL GRADE:       ', grade);
      console.log('📝 STATUS:            ', status);
      console.log('⚠️  WARNINGS:          ', warnings.length);
      console.log('══════════════════════════════════════════════════════════');
      console.log('');
      
      return {
        score: Math.round(score),
        grade: grade,
        status: status,
        warnings: warnings
      };
    }
    
    // ========================================
    // 🔢 MAIN SCORING ALGORITHM
    // ========================================
    
    console.log('🧮 SCORE CALCULATION:');
    console.log('──────────────────────────────────────────────────────────');
    
    // Starting score
    if (product.nutriscore_grade) {
      const nutriScoreMap = {
        'a': 100, 'b': 85, 'c': 70, 'd': 55, 'e': 40
      };
      const grade = product.nutriscore_grade.toLowerCase();
      if (nutriScoreMap[grade] !== undefined) {
        score = nutriScoreMap[grade];
        console.log('  Base Score (Nutri-Score', grade.toUpperCase() + '):  ', score);
      }
    } else {
      console.log('  Base Score (default):     100');
    }
    
    console.log('');
    console.log('📉 PENALTIES:');
    console.log('──────────────────────────────────────────────────────────');
    
    // NOVA Level penalty
    const novaLevel = this.getNOVALevel(product);
    console.log('  NOVA Processing Level:    ', novaLevel);
    if (novaLevel === 4) {
      score -= 20;
      console.log('  NOVA Penalty:            -20 (ultra-processed)');
      warnings.push({
        title: 'Ultra-Processed Food',
        description: 'Linked to 29% increased mortality risk (BMJ 2019)',
        severity: 'high'
      });
    } else if (novaLevel === 3) {
      score -= 10;
      console.log('  NOVA Penalty:            -10 (processed)');
      warnings.push({
        title: 'Processed Food',
        description: 'Contains added ingredients for flavor and preservation',
        severity: 'medium'
      });
    } else if (novaLevel === 2) {
      score -= 5;
      console.log('  NOVA Penalty:             -5 (processed ingredients)');
    } else {
      console.log('  NOVA Penalty:              0 (unprocessed)');
    }
    
    // Sugar penalties
    console.log('');
    console.log('  Sugar Analysis:');
    if (isLiquid) {
      if (sugar > 10) {
        score -= 35;
        console.log('    Penalty:               -35 (EXTREME sugar for liquid)');
        warnings.push({
          title: `Extreme Sugar Content`,
          description: `${sugar.toFixed(1)}g per ${unit} - exceeds WHO daily limit in one serving!`,
          severity: 'critical'
        });
      } else if (sugar > 8) {
        score -= 25;
        console.log('    Penalty:               -25 (very high sugar)');
        warnings.push({
          title: `Very High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - UK sugar tax tier 2`,
          severity: 'high'
        });
      } else if (sugar > 5) {
        score -= 15;
        console.log('    Penalty:               -15 (high sugar)');
        warnings.push({
          title: `High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - UK sugar tax tier 1`,
          severity: 'medium'
        });
      } else if (sugar > 2.5) {
        score -= 5;
        console.log('    Penalty:                -5 (moderate sugar)');
        warnings.push({
          title: `Moderate Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit}`,
          severity: 'low'
        });
      } else {
        console.log('    Penalty:                 0 (acceptable sugar)');
      }
    } else {
      if (sugar > 22.5) {
        score -= 40;
        console.log('    Penalty:               -40 (EXTREME sugar)');
        warnings.push({
          title: `Extreme Sugar Content`,
          description: `${sugar.toFixed(1)}g per ${unit} - major health risk!`,
          severity: 'critical'
        });
      } else if (sugar > 15) {
        score -= 30;
        console.log('    Penalty:               -30 (very high sugar)');
        warnings.push({
          title: `Very High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - exceeds UK "high sugar" threshold`,
          severity: 'high'
        });
      } else if (sugar > 10) {
        score -= 20;
        console.log('    Penalty:               -20 (high sugar)');
        warnings.push({
          title: `High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - exceeds WHO recommendation`,
          severity: 'medium'
        });
      } else if (sugar > 5) {
        score -= 10;
        console.log('    Penalty:               -10 (moderate sugar)');
        warnings.push({
          title: `Moderate Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit}`,
          severity: 'low'
        });
      } else {
        console.log('    Penalty:                 0 (acceptable sugar)');
      }
    }
    
    // Sodium penalties
    console.log('');
    console.log('  Sodium Analysis:');
    if (isLiquid) {
      if (sodium > 200) {
        score -= 20;
        console.log('    Penalty:               -20 (very high sodium for liquid)');
        warnings.push({
          title: `Very High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - significant health concern`,
          severity: 'high'
        });
      } else if (sodium > 140) {
        score -= 10;
        console.log('    Penalty:               -10 (high sodium)');
        warnings.push({
          title: `High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'medium'
        });
      } else if (sodium > 40) {
        score -= 5;
        console.log('    Penalty:                -5 (moderate sodium)');
        warnings.push({
          title: `Moderate Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'low'
        });
      } else {
        console.log('    Penalty:                 0 (acceptable sodium)');
      }
    } else {
      if (sodium > 1000) {
        score -= 35;
        console.log('    Penalty:               -35 (EXTREME sodium)');
        warnings.push({
          title: `Extreme Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - major cardiovascular risk!`,
          severity: 'critical'
        });
      } else if (sodium > 600) {
        score -= 25;
        console.log('    Penalty:               -25 (very high sodium)');
        warnings.push({
          title: `Very High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - exceeds EU threshold`,
          severity: 'high'
        });
      } else if (sodium > 400) {
        score -= 15;
        console.log('    Penalty:               -15 (high sodium)');
        warnings.push({
          title: `High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - FDA "high sodium"`,
          severity: 'medium'
        });
      } else if (sodium > 140) {
        score -= 5;
        console.log('    Penalty:                -5 (moderate sodium)');
        warnings.push({
          title: `Moderate Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'low'
        });
      } else {
        console.log('    Penalty:                 0 (acceptable sodium)');
      }
    }
    
    // Saturated fat penalties
    console.log('');
    console.log('  Saturated Fat Analysis:');
    if (!isLiquid && saturatedFat > 0) {
      if (saturatedFat > 10) {
        score -= 35;
        console.log('    Penalty:               -35 (EXTREME saturated fat)');
        warnings.push({
          title: `Extreme Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit} - major cardiovascular risk!`,
          severity: 'critical'
        });
      } else if (saturatedFat > 5) {
        score -= 25;
        console.log('    Penalty:               -25 (very high saturated fat)');
        warnings.push({
          title: `Very High Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit} - exceeds 25% daily value`,
          severity: 'high'
        });
      } else if (saturatedFat > 3) {
        score -= 15;
        console.log('    Penalty:               -15 (high saturated fat)');
        warnings.push({
          title: `High Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit} - EU "high saturated fat"`,
          severity: 'medium'
        });
      } else if (saturatedFat > 1.5) {
        score -= 5;
        console.log('    Penalty:                -5 (moderate saturated fat)');
        warnings.push({
          title: `Moderate Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit}`,
          severity: 'low'
        });
      } else {
        console.log('    Penalty:                 0 (acceptable saturated fat)');
      }
    } else {
      console.log('    Penalty:                 0 (liquid or no saturated fat)');
    }
    
    // Harmful additives
    console.log('');
    console.log('  Checking Harmful Additives...');
    const additiveCheck = this.checkHarmfulAdditives(product);
    score -= additiveCheck.penalty;
    console.log('    Additives Found:        ', additiveCheck.warnings.length);
    console.log('    Additive Penalty:      -' + additiveCheck.penalty);
    warnings.push(...additiveCheck.warnings);
    
    // Bonuses
    console.log('');
    console.log('📈 BONUSES:');
    console.log('──────────────────────────────────────────────────────────');
    let bonusPoints = 0;
    
    if (fiber > 6) {
      bonusPoints += 8;
      console.log('  Fiber (high):             +8');
    } else if (fiber > 3) {
      bonusPoints += 4;
      console.log('  Fiber (good):             +4');
    } else {
      console.log('  Fiber:                     0');
    }
    
    if (proteins > 10) {
      bonusPoints += 7;
      console.log('  Protein (high):           +7');
    } else if (proteins > 5) {
      bonusPoints += 3;
      console.log('  Protein (good):           +3');
    } else {
      console.log('  Protein:                   0');
    }
    
    if (ingredients.includes('whole grain') || ingredients.includes('whole wheat')) {
      bonusPoints += 5;
      console.log('  Whole Grains:             +5');
    }
    
    if (ingredients.includes('organic')) {
      bonusPoints += 3;
      console.log('  Organic:                  +3');
    }
    
    bonusPoints = Math.min(bonusPoints, 20);
    console.log('──────────────────────────────────────────────────────────');
    console.log('  Total Bonuses:           +' + bonusPoints, '(capped at 20)');
    
    score += bonusPoints;
    
    // Cap score at 0-100
    score = Math.max(0, Math.min(100, score));
    
    console.log('');
    console.log('══════════════════════════════════════════════════════════');
    console.log('  RAW CALCULATED SCORE:    ', score);
    
    // Determine grade
    let grade, status;
    if (score >= 90) {
      grade = 'A';
      status = 'Excellent Choice';
    } else if (score >= 80) {
      grade = 'A-';
      status = 'Very Good Choice';
    } else if (score >= 75) {
      grade = 'B+';
      status = 'Good Choice';
    } else if (score >= 70) {
      grade = 'B';
      status = 'Moderate - Some Concerns';
    } else if (score >= 65) {
      grade = 'B-';
      status = 'Moderate - Multiple Concerns';
    } else if (score >= 60) {
      grade = 'C+';
      status = 'Poor - Several Issues';
    } else if (score >= 55) {
      grade = 'C';
      status = 'Poor - Many Concerns';
    } else if (score >= 50) {
      grade = 'C-';
      status = 'Poor - Significant Issues';
    } else if (score >= 45) {
      grade = 'D+';
      status = 'Avoid - Unhealthy';
    } else if (score >= 40) {
      grade = 'D';
      status = 'Avoid - Very Unhealthy';
    } else if (score >= 30) {
      grade = 'D-';
      status = 'Avoid - Multiple Health Risks';
    } else {
      grade = 'F';
      status = 'Avoid - Serious Health Concerns';
    }
    
    // Apply safety override if needed
    if (isSafetyOverride && score > 30) {
      console.log('');
      console.log('🚨 SAFETY OVERRIDE APPLIED:');
      console.log('   Original Score:', score);
      console.log('   Capped Score:   30 (D-)');
      console.log('   Reason: Extreme sugar (' + sugar.toFixed(1) + 'g) or saturated fat (' + saturatedFat.toFixed(1) + 'g)');
      
      score = 30;
      grade = 'D-';
      status = 'Avoid - Multiple Health Risks';
    }

    console.log('');
    console.log('🎯 FINAL RESULTS:');
    console.log('──────────────────────────────────────────────────────────');
    console.log('  FINAL SCORE:             ', score);
    console.log('  FINAL GRADE:             ', grade);
    console.log('  STATUS:                  ', status);
    console.log('  WARNINGS COUNT:          ', warnings.length);
    if (warnings.length > 0) {
      console.log('  WARNING BREAKDOWN:');
      const criticalCount = warnings.filter(w => w.severity === 'critical').length;
      const highCount = warnings.filter(w => w.severity === 'high').length;
      const mediumCount = warnings.filter(w => w.severity === 'medium').length;
      const lowCount = warnings.filter(w => w.severity === 'low').length;
      if (criticalCount > 0) console.log('    Critical:              ', criticalCount);
      if (highCount > 0) console.log('    High:                  ', highCount);
      if (mediumCount > 0) console.log('    Medium:                ', mediumCount);
      if (lowCount > 0) console.log('    Low:                   ', lowCount);
    }
    console.log('══════════════════════════════════════════════════════════');
    console.log('');

    return {
      score: Math.round(score),
      grade: grade,
      status: status,
      warnings: warnings.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
      })
    };
  }
}

export default ProductService;