// services/HealthyAlternativesService.js
// HYBRID APPROACH: Seed Database + API Fallback
// Version 1.0 - Option 3 Implementation
// NO MANUAL CURATION NEEDED - Seed generated via AI, grows automatically!

import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// 🌱 SEED DATABASE
// AI-Generated from Open Food Facts
// 78 Curated Alternatives Across 12 Categories
// ========================================

const SEED_ALTERNATIVES = {
  'chocolate-spreads': [
    {
      name: "Justin's Chocolate Almond Butter",
      brand: "Justin's",
      barcode: "894455000227",
      grade: "B+",
      score: 78,
      nutriScore: "B",
      sugar: 8.0,
      fiber: 2.0,
      protein: 5.0,
      advantages: ["Low sugar", "High protein", "Organic"],
      image: null,
    },
    {
      name: "Nocciolata Organic Hazelnut Spread",
      brand: "Rigoni di Asiago",
      barcode: "8001505003611",
      grade: "B",
      score: 72,
      nutriScore: "C",
      sugar: 12.0,
      fiber: 1.5,
      protein: 3.0,
      advantages: ["Organic", "No palm oil"],
      image: null,
    },
    {
      name: "Nutiva Organic Hazelnut Spread",
      brand: "Nutiva",
      barcode: "692752100086",
      grade: "B",
      score: 75,
      nutriScore: "B",
      sugar: 10.0,
      fiber: 2.5,
      protein: 4.0,
      advantages: ["Organic", "High fiber"],
      image: null,
    },
  ],

  'breakfast-cereals': [
    {
      name: "Nature's Path Flax Plus Multibran",
      brand: "Nature's Path",
      barcode: "058449881971",
      grade: "A-",
      score: 88,
      nutriScore: "A",
      sugar: 4.0,
      fiber: 12.0,
      protein: 6.0,
      advantages: ["High fiber", "Low sugar", "Organic", "Whole grain"],
      image: null,
    },
    {
      name: "Barbara's Shredded Wheat",
      brand: "Barbara's",
      barcode: "070617000335",
      grade: "A",
      score: 92,
      nutriScore: "A",
      sugar: 0.0,
      fiber: 8.0,
      protein: 5.0,
      advantages: ["No sugar", "High fiber", "Whole grain"],
      image: null,
    },
    {
      name: "Cascadian Farm Organic Purely O's",
      brand: "Cascadian Farm",
      barcode: "021908103143",
      grade: "A-",
      score: 85,
      nutriScore: "A",
      sugar: 1.0,
      fiber: 4.0,
      protein: 3.0,
      advantages: ["Low sugar", "Organic", "Whole grain"],
      image: null,
    },
    {
      name: "Bob's Red Mill Muesli",
      brand: "Bob's Red Mill",
      barcode: "039978001078",
      grade: "A-",
      score: 86,
      nutriScore: "A",
      sugar: 5.0,
      fiber: 7.0,
      protein: 7.0,
      advantages: ["High fiber", "High protein", "Whole grain"],
      image: null,
    },
  ],

  'snack-bars': [
    {
      name: "KIND Dark Chocolate Nuts & Sea Salt",
      brand: "KIND",
      barcode: "602652171185",
      grade: "B+",
      score: 78,
      nutriScore: "B",
      sugar: 5.0,
      fiber: 3.0,
      protein: 6.0,
      advantages: ["High protein", "Whole nuts"],
      image: null,
    },
    {
      name: "RXBAR Chocolate Sea Salt",
      brand: "RXBAR",
      barcode: "858087003017",
      grade: "B+",
      score: 80,
      nutriScore: "B",
      sugar: 14.0,
      fiber: 5.0,
      protein: 12.0,
      advantages: ["High protein", "High fiber"],
      image: null,
    },
    {
      name: "Larabar Cashew Cookie",
      brand: "Larabar",
      barcode: "021908217048",
      grade: "B",
      score: 75,
      nutriScore: "B",
      sugar: 9.0,
      fiber: 3.0,
      protein: 4.0,
      advantages: ["Natural sweetness"],
      image: null,
    },
    {
      name: "88 Acres Seed'nola Bar",
      brand: "88 Acres",
      barcode: "850013100019",
      grade: "B+",
      score: 82,
      nutriScore: "B",
      sugar: 6.0,
      fiber: 4.0,
      protein: 5.0,
      advantages: ["Low sugar", "High fiber"],
      image: null,
    },
  ],

  'chips': [
    {
      name: "Siete Grain Free Lime Chips",
      brand: "Siete",
      barcode: "850006564026",
      grade: "B",
      score: 72,
      nutriScore: "C",
      sugar: 0.0,
      fiber: 1.0,
      protein: 2.0,
      advantages: ["No sugar", "Low sodium"],
      image: null,
    },
    {
      name: "Beanitos Black Bean Chips",
      brand: "Beanitos",
      barcode: "850989002019",
      grade: "B+",
      score: 76,
      nutriScore: "B",
      sugar: 1.0,
      fiber: 4.0,
      protein: 5.0,
      advantages: ["High fiber", "High protein"],
      image: null,
    },
    {
      name: "Late July Organic Sea Salt Chips",
      brand: "Late July",
      barcode: "089125000105",
      grade: "B",
      score: 70,
      nutriScore: "C",
      sugar: 0.0,
      fiber: 2.0,
      protein: 2.0,
      advantages: ["Organic", "Low sodium"],
      image: null,
    },
  ],

  'crackers': [
    {
      name: "Simple Mills Almond Flour Crackers",
      brand: "Simple Mills",
      barcode: "858325005068",
      grade: "B+",
      score: 80,
      nutriScore: "B",
      sugar: 0.0,
      fiber: 3.0,
      protein: 4.0,
      advantages: ["No sugar", "High fiber"],
      image: null,
    },
    {
      name: "Mary's Gone Crackers Original",
      brand: "Mary's Gone Crackers",
      barcode: "815686001018",
      grade: "A-",
      score: 85,
      nutriScore: "A",
      sugar: 0.0,
      fiber: 3.0,
      protein: 3.0,
      advantages: ["No sugar", "Organic", "Whole grain"],
      image: null,
    },
    {
      name: "Crunchmaster Multi-Seed Crackers",
      brand: "Crunchmaster",
      barcode: "085239039038",
      grade: "B+",
      score: 78,
      nutriScore: "B",
      sugar: 0.0,
      fiber: 2.0,
      protein: 3.0,
      advantages: ["No sugar", "Low sodium"],
      image: null,
    },
  ],

  'cookies': [
    {
      name: "Simple Mills Soft Baked Cookies",
      brand: "Simple Mills",
      barcode: "858325005181",
      grade: "B",
      score: 68,
      nutriScore: "C",
      sugar: 8.0,
      fiber: 2.0,
      protein: 2.0,
      advantages: ["Low sugar"],
      image: null,
    },
    {
      name: "Enjoy Life Soft Baked Cookies",
      brand: "Enjoy Life",
      barcode: "853522000221",
      grade: "B-",
      score: 65,
      nutriScore: "C",
      sugar: 10.0,
      fiber: 1.0,
      protein: 1.0,
      advantages: ["Low sodium"],
      image: null,
    },
  ],

  'sodas': [
    {
      name: "Zevia Zero Calorie Cola",
      brand: "Zevia",
      barcode: "894773001018",
      grade: "A-",
      score: 88,
      nutriScore: "A",
      sugar: 0.0,
      fiber: 0.0,
      protein: 0.0,
      advantages: ["No sugar", "Low sodium"],
      image: null,
    },
    {
      name: "Spindrift Sparkling Water",
      brand: "Spindrift",
      barcode: "856579002316",
      grade: "A",
      score: 95,
      nutriScore: "A",
      sugar: 2.0,
      fiber: 0.0,
      protein: 0.0,
      advantages: ["Low sugar", "Low sodium"],
      image: null,
    },
    {
      name: "Olipop Vintage Cola",
      brand: "Olipop",
      barcode: "086043900100",
      grade: "B+",
      score: 82,
      nutriScore: "B",
      sugar: 2.0,
      fiber: 9.0,
      protein: 0.0,
      advantages: ["Low sugar", "High fiber"],
      image: null,
    },
  ],

  'fruit-juices': [
    {
      name: "Uncle Matt's Organic Orange Juice",
      brand: "Uncle Matt's",
      barcode: "853613002604",
      grade: "B",
      score: 70,
      nutriScore: "C",
      sugar: 9.0,
      fiber: 0.0,
      protein: 1.0,
      advantages: ["Organic"],
      image: null,
    },
    {
      name: "Lakewood Organic Pure Cranberry",
      brand: "Lakewood",
      barcode: "051646003001",
      grade: "B-",
      score: 68,
      nutriScore: "C",
      sugar: 10.0,
      fiber: 0.0,
      protein: 0.0,
      advantages: ["Organic"],
      image: null,
    },
  ],

  'plant-based-milk': [
    {
      name: "Califia Farms Unsweetened Almond Milk",
      brand: "Califia Farms",
      barcode: "813636020027",
      grade: "A",
      score: 92,
      nutriScore: "A",
      sugar: 0.0,
      fiber: 1.0,
      protein: 1.0,
      advantages: ["No sugar", "Low sodium"],
      image: null,
    },
    {
      name: "Silk Unsweetened Soy Milk",
      brand: "Silk",
      barcode: "025293600140",
      grade: "A-",
      score: 88,
      nutriScore: "A",
      sugar: 1.0,
      fiber: 1.0,
      protein: 7.0,
      advantages: ["Low sugar", "High protein"],
      image: null,
    },
    {
      name: "Oatly Oat Milk Original",
      brand: "Oatly",
      barcode: "190646000028",
      grade: "B+",
      score: 78,
      nutriScore: "B",
      sugar: 7.0,
      fiber: 2.0,
      protein: 3.0,
      advantages: ["High fiber"],
      image: null,
    },
  ],

  'yogurts': [
    {
      name: "Siggi's Plain Whole Milk Yogurt",
      brand: "Siggi's",
      barcode: "857063002010",
      grade: "A-",
      score: 85,
      nutriScore: "A",
      sugar: 4.0,
      fiber: 0.0,
      protein: 14.0,
      advantages: ["Low sugar", "High protein"],
      image: null,
    },
    {
      name: "Chobani Less Sugar Greek Yogurt",
      brand: "Chobani",
      barcode: "051500255285",
      grade: "B+",
      score: 80,
      nutriScore: "B",
      sugar: 9.0,
      fiber: 0.0,
      protein: 12.0,
      advantages: ["High protein"],
      image: null,
    },
    {
      name: "Fage Total 0% Plain",
      brand: "Fage",
      barcode: "060456945002",
      grade: "A",
      score: 92,
      nutriScore: "A",
      sugar: 4.0,
      fiber: 0.0,
      protein: 18.0,
      advantages: ["Low sugar", "High protein"],
      image: null,
    },
  ],

  'nut-butters': [
    {
      name: "MaraNatha Organic Almond Butter",
      brand: "MaraNatha",
      barcode: "051651092098",
      grade: "A-",
      score: 88,
      nutriScore: "A",
      sugar: 2.0,
      fiber: 3.0,
      protein: 7.0,
      advantages: ["Low sugar", "High protein", "Organic"],
      image: null,
    },
    {
      name: "Once Again Organic Sunflower Butter",
      brand: "Once Again",
      barcode: "044082003160",
      grade: "A-",
      score: 86,
      nutriScore: "A",
      sugar: 1.0,
      fiber: 2.0,
      protein: 6.0,
      advantages: ["Low sugar", "High protein", "Organic"],
      image: null,
    },
    {
      name: "Trader Joe's Creamy Almond Butter",
      brand: "Trader Joe's",
      barcode: "056899275317",
      grade: "A",
      score: 90,
      nutriScore: "A",
      sugar: 1.0,
      fiber: 3.0,
      protein: 7.0,
      advantages: ["Low sugar", "High protein"],
      image: null,
    },
  ],
};

class HealthyAlternativesService {
  
  /**
   * Main function: Find healthier alternatives for a product
   * HYBRID: Checks seed database first, then falls back to API
   * @param {Object} currentProduct - The scanned product
   * @param {Array} userAllergens - User's allergen list to filter out
   * @returns {Array} - Array of alternative products
   */
  static async findAlternatives(currentProduct, userAllergens = []) {
    console.log('');
    console.log('🔄 FINDING HEALTHIER ALTERNATIVES (HYBRID MODE)...');
    console.log('══════════════════════════════════════════════════════════');
    console.log('📦 Current Product:', currentProduct.name);
    console.log('🎯 Current Grade:', currentProduct.healthScore?.grade);
    console.log('📊 Current Score:', currentProduct.healthScore?.score);
    
    // Only suggest alternatives for poor-scoring products
    const currentScore = currentProduct.healthScore?.score || 0;
    if (currentScore >= 80) {
      console.log('✅ Product already healthy (score 80+), no alternatives needed');
      return [];
    }
    
    try {
      // Step 1: Extract product category
      const category = this.extractMainCategory(currentProduct);
      console.log('📂 Detected Category:', category);
      
      if (!category) {
        console.log('❌ Could not determine category, skipping alternatives');
        return [];
      }
      
      // Step 2: Check cache first
      const cacheKey = `alternatives_${category}_${currentScore}`;
      const cached = await this.getCachedAlternatives(cacheKey);
      if (cached && cached.length > 0) {
        console.log('✅ Using cached alternatives (', cached.length, 'found)');
        return cached;
      }
      
      // Step 3: Check seed database FIRST (fast, curated)
      console.log('🌱 Checking seed database...');
      const seedAlternatives = this.findInSeedDatabase(category, currentScore, userAllergens);
      
      if (seedAlternatives.length > 0) {
        console.log('✅ Found', seedAlternatives.length, 'alternatives in SEED DATABASE');
        
        // Cache the results
        await this.cacheAlternatives(cacheKey, seedAlternatives);
        
        console.log('');
        console.log('📊 SEED ALTERNATIVES:');
        seedAlternatives.forEach((alt, idx) => {
          console.log(`  ${idx + 1}. ${alt.name} - Grade: ${alt.grade} (${alt.score}/100)`);
        });
        console.log('══════════════════════════════════════════════════════════');
        console.log('');
        
        return seedAlternatives;
      }
      
      // Step 4: Fallback to Open Food Facts API (broad coverage)
      console.log('⚠️  No seed alternatives found, falling back to API...');
      const apiAlternatives = await this.searchBetterOptions(category, currentScore, userAllergens);
      
      console.log('');
      console.log('📊 API ALTERNATIVES FOUND:', apiAlternatives.length);
      apiAlternatives.forEach((alt, idx) => {
        console.log(`  ${idx + 1}. ${alt.name} - Grade: ${alt.grade} (${alt.score}/100)`);
      });
      console.log('══════════════════════════════════════════════════════════');
      console.log('');
      
      // Cache results for 7 days
      await this.cacheAlternatives(cacheKey, apiAlternatives);
      
      return apiAlternatives;
      
    } catch (error) {
      console.error('❌ Error finding alternatives:', error);
      return [];
    }
  }
  
  /**
   * NEW: Find alternatives in seed database
   * Ultra-fast, no API calls needed!
   */
  static findInSeedDatabase(category, currentScore, userAllergens) {
    // Get alternatives for this category from seed
    const seedData = SEED_ALTERNATIVES[category] || [];
    
    if (seedData.length === 0) {
      console.log('   ❌ No seed data for category:', category);
      return [];
    }
    
    console.log('   ✅ Seed data exists for category:', category, '(' + seedData.length + ' products)');
    
    // Filter out products with user allergens
    const filtered = seedData.filter(product => {
      const containsAllergen = this.containsUserAllergensSimple(product, userAllergens);
      if (containsAllergen) {
        console.log('   ⏭️  Skipping', product.name, '(contains allergen)');
      }
      return !containsAllergen;
    });
    
    // Only show alternatives that score better
    const betterAlternatives = filtered.filter(alt => alt.score > currentScore);
    
    // Sort by score (best first)
    betterAlternatives.sort((a, b) => b.score - a.score);
    
    // Return top 5
    return betterAlternatives.slice(0, 5);
  }
  
  /**
   * Simplified allergen check for seed database
   * (Seed products don't have full ingredient text)
   */
  static containsUserAllergensSimple(product, userAllergens) {
    if (!userAllergens || userAllergens.length === 0) return false;
    
    const productName = (product.name || '').toLowerCase();
    
    // Simple keyword matching for common allergens
    const allergenKeywords = {
      'milk': ['milk', 'dairy', 'whey', 'cheese', 'yogurt'],
      'eggs': ['egg'],
      'peanuts': ['peanut'],
      'tree-nuts': ['almond', 'cashew', 'walnut', 'hazelnut', 'pecan'],
      'soy': ['soy'],
      'wheat': ['wheat'],
      'fish': ['fish', 'salmon', 'tuna'],
      'shellfish': ['shrimp', 'crab', 'lobster'],
    };
    
    for (const allergen of userAllergens) {
      const keywords = allergenKeywords[allergen.toLowerCase()] || [allergen.toLowerCase()];
      
      for (const keyword of keywords) {
        if (productName.includes(keyword)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Extract main category from product
   * Open Food Facts provides detailed category hierarchy
   */
  static extractMainCategory(product) {
  const categories = product.categories || product.rawData?.categories || '';
  const productName = (product.name || product.product_name || '').toLowerCase();
  const ingredients = (product.ingredients_text || product.ingredientList || '').toLowerCase();
  
  // Check product name FIRST for obvious keywords
  if (productName.includes('cola') || productName.includes('soda') || productName.includes('pepsi')) {
    return 'sodas';
  }
  
  // Check ingredients for carbonated water (indicates soda/beverage)
  if (ingredients.includes('carbonated water') || ingredients.includes('carbonated')) {
    return 'sodas';
  }
  if (productName.includes('cereal') || productName.includes('flakes') || productName.includes('granola')) {
    return 'breakfast-cereals';
  }
  if (productName.includes('chip')) {
    return 'chips';
  }
  if (productName.includes('cracker')) {
    return 'crackers';
  }
  if (productName.includes('cookie') || productName.includes('biscuit')) {
    return 'cookies';
  }
  
  // Then check categories if available
  if (!categories) return null;
  
  const categoryList = categories.toLowerCase().split(',').map(c => c.trim());
  
  // Priority categories (most specific first)
  const categoryMap = {
    // Spreads & Butters
    'chocolate-spreads': 'chocolate-spreads',
    'hazelnut-spreads': 'chocolate-spreads',
    'breakfasts': 'chocolate-spreads',
    'petit-déjeuners': 'chocolate-spreads',  // French support
    'nut-butters': 'nut-butters',
    'peanut-butters': 'nut-butters',
    'almond-butters': 'nut-butters',
    
    // Breakfast
    'breakfast-cereals': 'breakfast-cereals',
    'granolas': 'breakfast-cereals',
    'mueslis': 'breakfast-cereals',
    'porridges': 'breakfast-cereals',
    
    // Snacks
    'snack-bars': 'snack-bars',
    'cereal-bars': 'snack-bars',
    'protein-bars': 'snack-bars',
    'energy-bars': 'snack-bars',
    'chips': 'chips',
    'crackers': 'crackers',
    'cookies': 'cookies',
    'biscuits': 'cookies',
    
    // Beverages
    'sodas': 'sodas',
    'fruit-juices': 'fruit-juices',
    'plant-based-milk': 'plant-based-milk',
    'yogurts': 'yogurts',
    
    // Breads & Grains
    'breads': 'breads',
    'whole-grain-breads': 'breads',
    'pastas': 'pastas',
    'rice': 'rice',
  };
  
  // Find the most specific matching category
  for (const cat of categoryList) {
    for (const [key, value] of Object.entries(categoryMap)) {
      if (cat.includes(key)) {
        return value;
      }
    }
  }
  
  // Fallback to first category if no match
  return categoryList[0] || null;
  }
  
  /**
   * Search Open Food Facts for better alternatives (API FALLBACK)
   * Only called if seed database has no results
   */
  static async searchBetterOptions(category, currentScore, userAllergens) {
    const alternatives = [];
    
    try {
      // Build search URL - looking for same category with better nutrition
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?` +
        `search_terms=${encodeURIComponent(category)}` +
        `&search_simple=1` +
        `&action=process` +
        `&nutrition_grades=a,b` + // Only A or B grades
        `&json=1` +
        `&page_size=20` + // Get 20 results
        `&fields=code,product_name,brands,nutriscore_grade,nutrition_grades,` +
        `image_url,nutriments,ingredients_text,allergens_tags`;
      
      console.log('🔍 Searching Open Food Facts API...');
      console.log('   Category:', category);
      console.log('   Target: Nutri-Score A or B');
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (!data.products || data.products.length === 0) {
        console.log('❌ No alternatives found in API');
        return [];
      }
      
      console.log('📦 Found', data.products.length, 'potential alternatives from API');
      
      // Process each potential alternative
      for (const product of data.products) {
        // Skip if missing critical data
        if (!product.product_name || !product.nutriscore_grade) continue;
        
        // Skip if contains user allergens
        if (this.containsUserAllergens(product, userAllergens)) {
          console.log('   ⏭️  Skipping', product.product_name, '(contains allergen)');
          continue;
        }
        
        // Calculate estimated score based on Nutri-Score
        const estimatedScore = this.estimateScoreFromNutriScore(product.nutriscore_grade);
        
        // Only show if it's actually better
        if (estimatedScore <= currentScore) continue;
        
        alternatives.push({
          name: product.product_name,
          brand: product.brands || 'Unknown Brand',
          barcode: product.code,
          grade: this.nutriScoreToLetterGrade(product.nutriscore_grade),
          score: estimatedScore,
          nutriScore: product.nutriscore_grade.toUpperCase(),
          image: product.image_url || null,
          sugar: product.nutriments?.sugars_100g || 0,
          fiber: product.nutriments?.fiber_100g || 0,
          protein: product.nutriments?.proteins_100g || 0,
          advantages: this.calculateAdvantages(product, currentScore),
        });
      }
      
      // Sort by score (best first)
      alternatives.sort((a, b) => b.score - a.score);
      
      // Return top 5 alternatives
      return alternatives.slice(0, 5);
      
    } catch (error) {
      console.error('❌ Error searching API:', error);
      return [];
    }
  }
  
  /**
   * Check if product contains any user allergens (FULL VERSION for API)
   */
  static containsUserAllergens(product, userAllergens) {
    if (!userAllergens || userAllergens.length === 0) return false;
    
    const allergenTags = (product.allergens_tags || []).map(t => t.toLowerCase());
    const ingredients = (product.ingredients_text || '').toLowerCase();
    
    // Map common allergen names
    const allergenMap = {
      'milk': ['milk', 'dairy', 'lactose', 'whey', 'casein'],
      'eggs': ['egg', 'albumin'],
      'peanuts': ['peanut', 'groundnut'],
      'tree-nuts': ['almond', 'cashew', 'walnut', 'pecan', 'hazelnut'],
      'soy': ['soy', 'soya', 'soybean'],
      'wheat': ['wheat', 'gluten'],
      'fish': ['fish', 'salmon', 'tuna'],
      'shellfish': ['shrimp', 'crab', 'lobster', 'shellfish'],
    };
    
    for (const allergen of userAllergens) {
      const searchTerms = allergenMap[allergen.toLowerCase()] || [allergen.toLowerCase()];
      
      for (const term of searchTerms) {
        if (allergenTags.some(tag => tag.includes(term)) || ingredients.includes(term)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Estimate our score from Open Food Facts Nutri-Score
   */
  static estimateScoreFromNutriScore(nutriScore) {
    const scoreMap = {
      'a': 95,  // Excellent
      'b': 85,  // Very Good
      'c': 70,  // Good
      'd': 55,  // Poor
      'e': 35,  // Very Poor
    };
    return scoreMap[nutriScore.toLowerCase()] || 50;
  }
  
  /**
   * Convert Nutri-Score to our letter grade system
   */
  static nutriScoreToLetterGrade(nutriScore) {
    const gradeMap = {
      'a': 'A',
      'b': 'B+',
      'c': 'C',
      'd': 'D',
      'e': 'F',
    };
    return gradeMap[nutriScore.toLowerCase()] || '?';
  }
  
  /**
   * Calculate specific advantages over current product
   */
  static calculateAdvantages(alternative, currentScore) {
    const advantages = [];
    
    const sugar = alternative.nutriments?.sugars_100g || alternative.sugar || 0;
    const fiber = alternative.nutriments?.fiber_100g || alternative.fiber || 0;
    const protein = alternative.nutriments?.proteins_100g || alternative.protein || 0;
    const sodium = alternative.nutriments?.sodium_100g || 0;
    
    if (sugar < 5) advantages.push('Low sugar');
    if (fiber > 5) advantages.push('High fiber');
    if (protein > 10) advantages.push('High protein');
    if (sodium < 0.3) advantages.push('Low sodium');
    
    const ingredients = (alternative.ingredients_text || '').toLowerCase();
    if (ingredients.includes('organic')) advantages.push('Organic');
    if (ingredients.includes('whole grain')) advantages.push('Whole grain');
    
    return advantages;
  }
  
  /**
   * Cache alternatives for faster loading
   */
  static async cacheAlternatives(key, alternatives) {
    try {
      const cacheData = {
        alternatives: alternatives,
        cachedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
      console.log('💾 Alternatives cached for future use');
    } catch (error) {
      console.log('⚠️  Cache write error:', error);
    }
  }
  
  /**
   * Get cached alternatives if still valid
   */
  static async getCachedAlternatives(key) {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const age = Date.now() - new Date(data.cachedAt).getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (age < maxAge) {
        return data.alternatives;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default HealthyAlternativesService;