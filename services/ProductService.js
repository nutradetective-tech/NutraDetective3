// services/ProductService.js
// NutraDetective - Evidence-Based Nutritional Scoring System
// Version 2.2 - Multi-API Support with Fallbacks
// ENHANCED WITH DEBUG LOGGING - Your original code intact

class ProductService {
  // API Keys - Get these free from each service
  static API_KEYS = {
    USDA: '5QlF40l69GTeey5t3lPgc02BcWOthCTg6ZaAbZW9', // Get from https://fdc.nal.usda.gov/api-key-signup.html
    NUTRITIONIX_ID: '393c1557', // Get from nutritionix.com/business/api
    NUTRITIONIX_KEY: '6cefab30a7a318a0cfb93fa2263ec883',
    EDAMAM_ID: '', // Get from developer.edamam.com
    EDAMAM_KEY: ''
  };

  /**
   * Main function called by App.js - maintains backward compatibility
   */
  static async fetchProductByBarcode(barcode) {
    console.log('🔍 Searching for barcode:', barcode);
    console.log('📊 API Status - USDA Key:', this.API_KEYS.USDA ? 'Present' : 'Missing');
    let product = null;
    let source = '';

    try {
      // Try Open Food Facts first (no API key needed)
      console.log('📡 Trying Open Food Facts...');
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();
      console.log('Open Food Facts response status:', data.status);
      
      if (data.status === 1 && data.product) {
        product = data.product;
        source = 'Open Food Facts';
        console.log('✅ Found in Open Food Facts:', product.product_name);
      } else {
        console.log('❌ Not found in Open Food Facts');
      }
    } catch (error) {
      console.error('Open Food Facts error:', error);
    }

    // If not found and USDA key exists, try USDA
    if (!product && this.API_KEYS.USDA && this.API_KEYS.USDA !== 'DEMO_KEY') {
      try {
        console.log('📡 Trying USDA database...');
        product = await this.fetchFromUSDA(barcode);
        if (product) {
          source = 'USDA';
          console.log('✅ Found in USDA:', product.product_name);
        } else {
          console.log('❌ Not found in USDA');
        }
      } catch (error) {
        console.error('USDA error:', error);
      }
    }

    // If not found and Nutritionix keys exist, try Nutritionix
    if (!product && this.API_KEYS.NUTRITIONIX_ID) {
      try {
        console.log('📡 Trying Nutritionix...');
        product = await this.fetchFromNutritionix(barcode);
        if (product) {
          source = 'Nutritionix';
          console.log('✅ Found in Nutritionix');
        }
      } catch (error) {
        console.error('Nutritionix error:', error);
      }
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
      
      // Log what we have for debugging
      console.log('📋 Product data check:', {
        name: product.product_name,
        hasIngredients,
        hasNutritionData,
        source: source
      });
      
      // If missing critical data, return with "insufficient data" status
      if (!hasIngredients || !hasNutritionData) {
        console.log('⚠️ Insufficient data for scoring');
        return {
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
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
      console.log('📊 Calculating health score...');
      const healthScore = this.calculateHealthScore(product);
      console.log('✅ Final grade:', healthScore.grade, 'Score:', healthScore.score);
      
      // Return in format expected by App.js
      return {
        name: product.product_name || 'Unknown Product',
        brand: product.brands || 'Unknown Brand',
        healthScore: healthScore,
        missingData: false,
        source: source,
        rawData: product
      };
    }
    
    console.log('❌ Product not found in any database');
    return null;
  }

  /**
   * NEW: USDA FoodData Central API
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
      
      // Convert USDA format to Open Food Facts format
      const nutrients = {};
      if (food.foodNutrients) {
        food.foodNutrients.forEach(nutrient => {
          switch(nutrient.nutrientName) {
            case 'Sugars, total including NLEA':
            case 'Total Sugars':
              nutrients['sugars_100g'] = nutrient.value;
              break;
            case 'Sodium, Na':
              nutrients['sodium_100g'] = nutrient.value / 10; // Convert mg to per 100g
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
   * NEW: Nutritionix API
   */
  static async fetchFromNutritionix(barcode) {
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/search/item?upc=${barcode}`,
      {
        headers: {
          'x-app-id': this.API_KEYS.NUTRITIONIX_ID,
          'x-app-key': this.API_KEYS.NUTRITIONIX_KEY
        }
      }
    );
    const data = await response.json();
    
    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0];
      
      // Convert Nutritionix format to Open Food Facts format
      return {
        product_name: food.food_name,
        brands: food.brand_name,
        nutriments: {
          'sugars_100g': (food.nf_sugars / food.serving_weight_grams) * 100,
          'sodium_100g': (food.nf_sodium / food.serving_weight_grams) * 100 / 1000,
          'saturated-fat_100g': (food.nf_saturated_fat / food.serving_weight_grams) * 100,
          'fiber_100g': (food.nf_dietary_fiber / food.serving_weight_grams) * 100,
          'proteins_100g': (food.nf_protein / food.serving_weight_grams) * 100,
          'energy-kcal_100g': (food.nf_calories / food.serving_weight_grams) * 100
        },
        ingredients_text: food.nf_ingredient_statement || '',
        categories: ''
      };
    }
    return null;
  }

  // ALL YOUR EXISTING FUNCTIONS BELOW - COMPLETELY UNCHANGED
  
  /**
   * Determine if product is liquid based on categories
   */
  static isProductLiquid(product) {
    const liquidCategories = [
      'beverages', 'drinks', 'sodas', 'juices', 'waters', 'milk', 
      'plant-based-milk', 'coffee', 'tea', 'energy-drinks', 'sports-drinks',
      'alcoholic-beverages', 'beers', 'wines', 'spirits', 'yogurts'
    ];
    
    const categories = (product.categories || '').toLowerCase();
    const productName = (product.product_name || '').toLowerCase();
    
    // Check categories
    for (const liquidCat of liquidCategories) {
      if (categories.includes(liquidCat)) {
        return true;
      }
    }
    
    // Check product name for liquid indicators
    const liquidIndicators = ['drink', 'juice', 'water', 'milk', 'cola', 'soda', 'beverage', 'yogurt', 'yoghurt'];
    for (const indicator of liquidIndicators) {
      if (productName.includes(indicator)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Determine NOVA processing level (1-4)
   */
  static getNOVALevel(product) {
    // If NOVA group is provided by Open Food Facts
    if (product.nova_group) {
      return parseInt(product.nova_group);
    }
    
    // Otherwise, estimate based on ingredients
    const ingredients = (product.ingredients_text || '').toLowerCase();
    const ingredientsList = product.ingredients || [];
    const ingredientCount = ingredientsList.length || 0;
    
    // Check for additives (E-numbers)
    const hasENumbers = /\bE\d{3}\b/i.test(ingredients);
    
    // Ultra-processed indicators
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
    
    // Determine NOVA level based on ingredients
    if (ingredientCount > 5 && (hasUltraProcessedMarkers || hasENumbers)) {
      return 4; // Ultra-processed
    } else if (ingredientCount >= 3 && ingredientCount <= 5) {
      return 3; // Processed
    } else if (ingredientCount === 2) {
      return 2; // Processed culinary ingredients
    } else {
      return 1; // Unprocessed or minimally processed
    }
  }

  /**
   * Check for harmful additives and return penalties
   */
  static checkHarmfulAdditives(product) {
    const ingredients = (product.ingredients_text || '').toLowerCase();
    let totalPenalty = 0;
    const warnings = [];

    // Artificial Colors (Southampton Study linked to hyperactivity)
    const harmfulColors = {
      'red 40': { penalty: 10, name: 'Red 40', concern: 'Linked to hyperactivity in children' },
      'e129': { penalty: 10, name: 'Red 40 (E129)', concern: 'Linked to hyperactivity in children' },
      'yellow 5': { penalty: 10, name: 'Yellow 5', concern: 'Can cause allergic reactions' },
      'e102': { penalty: 10, name: 'Tartrazine (E102)', concern: 'Can cause allergic reactions' },
      'yellow 6': { penalty: 10, name: 'Yellow 6', concern: 'Linked to hyperactivity' },
      'e110': { penalty: 10, name: 'Sunset Yellow (E110)', concern: 'Linked to hyperactivity' },
      'blue 1': { penalty: 8, name: 'Blue 1', concern: 'May cause behavioral changes' },
      'e133': { penalty: 8, name: 'Brilliant Blue (E133)', concern: 'May cause behavioral changes' },
      'red 3': { penalty: 12, name: 'Red 3', concern: 'Thyroid tumors in animals' },
      'e127': { penalty: 12, name: 'Erythrosine (E127)', concern: 'Thyroid tumors in animals' }
    };

    // Artificial Sweeteners
    const artificialSweeteners = {
      'aspartame': { penalty: 8, name: 'Aspartame', concern: 'WHO "possibly carcinogenic" (2023)' },
      'e951': { penalty: 8, name: 'Aspartame (E951)', concern: 'WHO "possibly carcinogenic" (2023)' },
      'saccharin': { penalty: 6, name: 'Saccharin', concern: 'Potential bladder cancer risk' },
      'e954': { penalty: 6, name: 'Saccharin (E954)', concern: 'Potential bladder cancer risk' },
      'sucralose': { penalty: 5, name: 'Sucralose', concern: 'May disrupt gut microbiome' },
      'e955': { penalty: 5, name: 'Sucralose (E955)', concern: 'May disrupt gut microbiome' },
      'acesulfame k': { penalty: 5, name: 'Acesulfame K', concern: 'Potential carcinogen in high doses' },
      'e950': { penalty: 5, name: 'Acesulfame K (E950)', concern: 'Potential carcinogen in high doses' }
    };

    // Preservatives
    const harmfulPreservatives = {
      'sodium nitrite': { penalty: 15, name: 'Sodium Nitrite', concern: 'Forms carcinogenic nitrosamines' },
      'e250': { penalty: 15, name: 'Sodium Nitrite (E250)', concern: 'Forms carcinogenic nitrosamines' },
      'bha': { penalty: 10, name: 'BHA', concern: 'Possible carcinogen' },
      'e320': { penalty: 10, name: 'BHA (E320)', concern: 'Possible carcinogen' },
      'bht': { penalty: 10, name: 'BHT', concern: 'Potential carcinogen' },
      'e321': { penalty: 10, name: 'BHT (E321)', concern: 'Potential carcinogen' },
      'tbhq': { penalty: 8, name: 'TBHQ', concern: 'May suppress immune system' },
      'sodium benzoate': { penalty: 6, name: 'Sodium Benzoate', concern: 'Forms benzene with vitamin C' },
      'e211': { penalty: 6, name: 'Sodium Benzoate (E211)', concern: 'Forms benzene with vitamin C' }
    };

    // Other harmful ingredients
    const otherHarmful = {
      'partially hydrogenated': { penalty: 25, name: 'Trans Fats', concern: 'FDA banned - causes heart disease' },
      'high fructose corn syrup': { penalty: 10, name: 'HFCS', concern: 'Linked to obesity and diabetes' },
      'msg': { penalty: 8, name: 'MSG', concern: 'May cause reactions in sensitive people' },
      'monosodium glutamate': { penalty: 8, name: 'MSG', concern: 'May cause reactions in sensitive people' },
      'e621': { penalty: 8, name: 'MSG (E621)', concern: 'May cause reactions in sensitive people' },
      'carrageenan': { penalty: 8, name: 'Carrageenan', concern: 'May cause intestinal inflammation' },
      'e407': { penalty: 8, name: 'Carrageenan (E407)', concern: 'May cause intestinal inflammation' },
      'palm oil': { penalty: 5, name: 'Palm Oil', concern: 'High in saturated fat, environmental concerns' }
    };

    // Check all harmful additives
    const allHarmful = { ...harmfulColors, ...artificialSweeteners, ...harmfulPreservatives, ...otherHarmful };
    
    for (const [ingredient, info] of Object.entries(allHarmful)) {
      if (ingredients.includes(ingredient)) {
        totalPenalty += info.penalty;
        warnings.push({
          title: info.name,
          description: info.concern,
          severity: info.penalty >= 15 ? 'high' : info.penalty >= 8 ? 'medium' : 'low'
        });
      }
    }

    // Check for caramel coloring (4-MEI)
    if (ingredients.includes('caramel color') || ingredients.includes('caramel colour')) {
      totalPenalty += 5;
      warnings.push({
        title: 'Caramel Color',
        description: 'May contain 4-MEI, a potential carcinogen',
        severity: 'low'
      });
    }

    // Check for phosphoric acid
    if (ingredients.includes('phosphoric acid')) {
      totalPenalty += 5;
      warnings.push({
        title: 'Phosphoric Acid',
        description: 'Can interfere with calcium absorption',
        severity: 'low'
      });
    }

    return { penalty: totalPenalty, warnings };
  }

  /**
   * Main scoring algorithm - Evidence-based nutritional assessment
   * KEEPING YOUR ENTIRE ALGORITHM UNCHANGED
   */
  static calculateHealthScore(product) {
    console.log('🧮 Starting health score calculation...');
    // Start with perfect score
    let score = 100;
    const warnings = [];
    
    // Get nutritional values per 100g/100ml
    const nutriments = product.nutriments || {};
    
    // Determine if liquid or solid
    const isLiquid = this.isProductLiquid(product);
    const unit = isLiquid ? '100ml' : '100g';
    
    // Extract nutritional values
    const sugar = nutriments['sugars_100g'] || 0;
    const saturatedFat = nutriments['saturated-fat_100g'] || 0;
    const sodium = nutriments['sodium_100g'] || 0;
    const fiber = nutriments['fiber_100g'] || 0;
    const proteins = nutriments['proteins_100g'] || 0;
    const energy = nutriments['energy-kcal_100g'] || 0;
    
    console.log('Nutrition per', unit, ':', { sugar, sodium, saturatedFat, fiber, energy });
    
    // Get ingredients info
    const ingredients = (product.ingredients_text || '').toLowerCase();
    const ingredientsList = product.ingredients || [];
    
    // SPECIAL HANDLING FOR LOW-CALORIE CONDIMENTS
    const isLowCalorieProduct = energy < 10;
    if (isLowCalorieProduct && ingredientsList.length < 10 && sodium < 500) {
      // Simple condiment - start with good base score
      score = 85;
      
      // Only apply sodium penalty if actually high
      if (sodium > 1000) {
        score -= 20;
        warnings.push({
          title: 'High Sodium for Condiment',
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'medium'
        });
      }
      
      // Bonus for organic
      if (ingredients.includes('organic')) {
        score += 10;
      }
      
      // Still check for harmful additives
      const additiveCheck = this.checkHarmfulAdditives(product);
      score -= additiveCheck.penalty;
      warnings.push(...additiveCheck.warnings);
      
      // Calculate final grade and return early for condiments
      score = Math.max(0, Math.min(100, score));
      
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
      
      return {
        score: Math.round(score),
        grade: grade,
        status: status,
        warnings: warnings
      };
    }
    
    // REGULAR SCORING FOR NON-CONDIMENT PRODUCTS
    
    // 1. USE NUTRI-SCORE AS BASE IF AVAILABLE
    if (product.nutriscore_grade) {
      const nutriScoreMap = {
        'a': 100, 'b': 85, 'c': 70, 'd': 55, 'e': 40
      };
      const grade = product.nutriscore_grade.toLowerCase();
      if (nutriScoreMap[grade] !== undefined) {
        score = nutriScoreMap[grade];
      }
    }
    
    // 2. NOVA PROCESSING LEVEL PENALTY
    const novaLevel = this.getNOVALevel(product);
    if (novaLevel === 4) {
      score -= 20;
      warnings.push({
        title: 'Ultra-Processed Food',
        description: 'Linked to 29% increased mortality risk (BMJ 2019)',
        severity: 'high'
      });
    } else if (novaLevel === 3) {
      score -= 10;
      warnings.push({
        title: 'Processed Food',
        description: 'Contains added ingredients for flavor and preservation',
        severity: 'medium'
      });
    } else if (novaLevel === 2) {
      score -= 5;
    }
    
    // 3. SUGAR PENALTIES (Different thresholds for liquids vs solids)
    if (isLiquid) {
      // Liquid sugar thresholds (per 100ml)
      if (sugar > 10) {
        score -= 35;
        warnings.push({
          title: `Extreme Sugar Content`,
          description: `${sugar.toFixed(1)}g per ${unit} - exceeds WHO daily limit in one serving!`,
          severity: 'critical'
        });
      } else if (sugar > 8) {
        score -= 25;
        warnings.push({
          title: `Very High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - UK sugar tax tier 2`,
          severity: 'high'
        });
      } else if (sugar > 5) {
        score -= 15;
        warnings.push({
          title: `High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - UK sugar tax tier 1`,
          severity: 'medium'
        });
      } else if (sugar > 2.5) {
        score -= 5;
        warnings.push({
          title: `Moderate Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit}`,
          severity: 'low'
        });
      }
    } else {
      // Solid sugar thresholds (per 100g)
      if (sugar > 22.5) {
        score -= 40;
        warnings.push({
          title: `Extreme Sugar Content`,
          description: `${sugar.toFixed(1)}g per ${unit} - major health risk!`,
          severity: 'critical'
        });
      } else if (sugar > 15) {
        score -= 30;
        warnings.push({
          title: `Very High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - exceeds UK "high sugar" threshold`,
          severity: 'high'
        });
      } else if (sugar > 10) {
        score -= 20;
        warnings.push({
          title: `High Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit} - exceeds WHO recommendation`,
          severity: 'medium'
        });
      } else if (sugar > 5) {
        score -= 10;
        warnings.push({
          title: `Moderate Sugar`,
          description: `${sugar.toFixed(1)}g per ${unit}`,
          severity: 'low'
        });
      }
    }
    
    // 4. SODIUM PENALTIES
    if (isLiquid) {
      // Liquid sodium (per 100ml)
      if (sodium > 200) {
        score -= 20;
        warnings.push({
          title: `Very High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - significant health concern`,
          severity: 'high'
        });
      } else if (sodium > 140) {
        score -= 10;
        warnings.push({
          title: `High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'medium'
        });
      } else if (sodium > 40) {
        score -= 5;
        warnings.push({
          title: `Moderate Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'low'
        });
      }
    } else {
      // Solid sodium (per 100g)
      if (sodium > 1000) {
        score -= 35;
        warnings.push({
          title: `Extreme Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - major cardiovascular risk!`,
          severity: 'critical'
        });
      } else if (sodium > 600) {
        score -= 25;
        warnings.push({
          title: `Very High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - exceeds EU threshold`,
          severity: 'high'
        });
      } else if (sodium > 400) {
        score -= 15;
        warnings.push({
          title: `High Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit} - FDA "high sodium"`,
          severity: 'medium'
        });
      } else if (sodium > 140) {
        score -= 5;
        warnings.push({
          title: `Moderate Sodium`,
          description: `${sodium.toFixed(0)}mg per ${unit}`,
          severity: 'low'
        });
      }
    }
    
    // 5. SATURATED FAT PENALTIES (for solids)
    if (!isLiquid && saturatedFat > 0) {
      if (saturatedFat > 10) {
        score -= 35;
        warnings.push({
          title: `Extreme Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit} - major cardiovascular risk!`,
          severity: 'critical'
        });
      } else if (saturatedFat > 5) {
        score -= 25;
        warnings.push({
          title: `Very High Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit} - exceeds 25% daily value`,
          severity: 'high'
        });
      } else if (saturatedFat > 3) {
        score -= 15;
        warnings.push({
          title: `High Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit} - EU "high saturated fat"`,
          severity: 'medium'
        });
      } else if (saturatedFat > 1.5) {
        score -= 5;
        warnings.push({
          title: `Moderate Saturated Fat`,
          description: `${saturatedFat.toFixed(1)}g per ${unit}`,
          severity: 'low'
        });
      }
    }
    
    // 6. CHECK FOR HARMFUL ADDITIVES
    const additiveCheck = this.checkHarmfulAdditives(product);
    score -= additiveCheck.penalty;
    warnings.push(...additiveCheck.warnings);
    
    // 7. POSITIVE MODIFIERS (max +20 total)
    let bonusPoints = 0;
    
    // High fiber bonus
    if (fiber > 6) {
      bonusPoints += 8;
    } else if (fiber > 3) {
      bonusPoints += 4;
    }
    
    // High protein bonus
    if (proteins > 10) {
      bonusPoints += 7;
    } else if (proteins > 5) {
      bonusPoints += 3;
    }
    
    // Check for whole grains in ingredients
    if (ingredients.includes('whole grain') || ingredients.includes('whole wheat')) {
      bonusPoints += 5;
    }
    
    // Organic bonus
    if (ingredients.includes('organic')) {
      bonusPoints += 3;
    }
    
    // Cap bonus at 20
    bonusPoints = Math.min(bonusPoints, 20);
    score += bonusPoints;
    
    // Ensure score stays within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    console.log('📊 Final calculations - Score:', score, 'Warnings:', warnings.length);
    
    // Calculate letter grade based on final score
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
    
    // Return score object in format expected by App.js
    return {
      score: Math.round(score),
      grade: grade,
      status: status,
      warnings: warnings.sort((a, b) => {
        // Sort warnings by severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
      })
    };
  }
}

export default ProductService;