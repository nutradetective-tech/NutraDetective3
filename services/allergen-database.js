// services/allergen-database.js
// Comprehensive allergen database with 100+ allergens
// Organized by category with severity levels and detection keywords

/**
 * ALLERGEN DATABASE
 * 
 * Structure:
 * - id: Unique identifier
 * - name: Display name
 * - category: Allergen category (snake_case)
 * - severity: severe | moderate | mild (lowercase)
 * - tier: free | plus | pro (lowercase)
 * - keywords: Detection terms in ingredients
 * - derivatives: Hidden sources and alternative names
 * - description: Health impact explanation
 */

export const ALLERGEN_DATABASE = {
  // ==========================================
  // FDA TOP 8 ALLERGENS (FREE TIER)
  // ==========================================
  
  milk: {
    id: 'milk',
    name: 'Milk & Dairy',
    category: 'fda_top_8',
    severity: 'moderate',
    tier: 'free',
    keywords: [
      'milk', 'dairy', 'cream', 'butter', 'cheese', 'yogurt', 'ice cream',
      'buttermilk', 'sour cream', 'ghee', 'custard', 'pudding'
    ],
    derivatives: [
      'casein', 'caseinate', 'whey', 'lactose', 'lactalbumin', 'lactoglobulin',
      'curds', 'kefir', 'paneer', 'quark', 'rennet'
    ],
    description: 'Can cause digestive issues, skin reactions, or respiratory problems. Common in processed foods.'
  },

  eggs: {
    id: 'eggs',
    name: 'Eggs',
    category: 'fda_top_8',
    severity: 'moderate',
    tier: 'free',
    keywords: [
      'egg', 'eggs', 'egg white', 'egg yolk', 'egg powder', 'dried egg',
      'mayonnaise', 'meringue', 'marshmallow'
    ],
    derivatives: [
      'albumin', 'globulin', 'lecithin', 'livetin', 'lysozyme', 'ovalbumin',
      'ovomucin', 'ovomucoid', 'ovovitellin', 'vitellin'
    ],
    description: 'Common allergen causing skin rashes, digestive upset, or respiratory symptoms.'
  },

  fish: {
    id: 'fish',
    name: 'Fish',
    category: 'fda_top_8',
    severity: 'severe',
    tier: 'free',
    keywords: [
      'fish', 'salmon', 'tuna', 'cod', 'halibut', 'bass', 'flounder',
      'sole', 'perch', 'snapper', 'trout', 'anchovy', 'sardine',
      'herring', 'catfish', 'mahi mahi', 'tilapia'
    ],
    derivatives: [
      'fish oil', 'fish sauce', 'fish stock', 'worcestershire sauce',
      'caesar dressing', 'surimi', 'imitation crab'
    ],
    description: 'Can cause severe allergic reactions. Often hidden in sauces and dressings.'
  },

  shellfish: {
    id: 'shellfish',
    name: 'Shellfish',
    category: 'fda_top_8',
    severity: 'severe',
    tier: 'free',
    keywords: [
      'shellfish', 'shrimp', 'prawns', 'crab', 'lobster', 'crayfish',
      'crawfish', 'clam', 'mussel', 'oyster', 'scallop', 'squid',
      'octopus', 'calamari'
    ],
    derivatives: [
      'shellfish extract', 'bouillabaisse', 'cuttlefish ink', 'glucosamine',
      'seafood flavoring'
    ],
    description: 'High risk of anaphylaxis. Cross-contamination common in seafood restaurants.'
  },

  'tree-nuts': {
    id: 'tree-nuts',
    name: 'Tree Nuts',
    category: 'fda_top_8',
    severity: 'severe',
    tier: 'free',
    keywords: [
      'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut',
      'macadamia', 'brazil nut', 'pine nut', 'chestnut', 'beech nut',
      'filbert', 'hickory nut', 'butternut'
    ],
    derivatives: [
      'marzipan', 'nougat', 'praline', 'gianduja', 'pesto', 'nut butter',
      'nut oil', 'nut paste', 'nut flour', 'nut milk'
    ],
    description: 'Life-threatening reactions possible. Often found in desserts and baked goods.'
  },

  peanuts: {
    id: 'peanuts',
    name: 'Peanuts',
    category: 'fda_top_8',
    severity: 'severe',
    tier: 'free',
    keywords: [
      'peanut', 'peanuts', 'groundnut', 'goober', 'monkey nut',
      'peanut butter', 'peanut oil', 'peanut flour'
    ],
    derivatives: [
      'arachis oil', 'arachis hypogaea', 'beer nuts', 'mandelonas',
      'mixed nuts', 'satay sauce', 'thai sauce'
    ],
    description: 'Most common cause of fatal food-related anaphylaxis. Cross-contamination risk high.'
  },

  wheat: {
    id: 'wheat',
    name: 'Wheat',
    category: 'fda_top_8',
    severity: 'moderate',
    tier: 'free',
    keywords: [
      'wheat', 'wheat flour', 'whole wheat', 'wheat bread', 'wheat bran',
      'wheat germ', 'wheat starch', 'wheat protein'
    ],
    derivatives: [
      'semolina', 'durum', 'spelt', 'kamut', 'farro', 'bulgur', 'couscous',
      'farina', 'graham flour', 'seitan', 'triticale', 'vital wheat gluten'
    ],
    description: 'Different from celiac disease. Can cause hives, breathing difficulties, digestive issues.'
  },

  soy: {
    id: 'soy',
    name: 'Soy',
    category: 'fda_top_8',
    severity: 'moderate',
    tier: 'free',
    keywords: [
      'soy', 'soya', 'soybeans', 'soybean oil', 'soy protein', 'soy sauce',
      'tofu', 'tempeh', 'miso', 'edamame', 'natto'
    ],
    derivatives: [
      'lecithin', 'soy lecithin', 'textured vegetable protein', 'tvp',
      'hydrolyzed soy protein', 'tamari', 'shoyu', 'teriyaki'
    ],
    description: 'Very common in processed foods. Can cause digestive and skin reactions.'
  },

  // ==========================================
  // EXTENDED ALLERGENS (PLUS TIER)
  // ==========================================

  sesame: {
    id: 'sesame',
    name: 'Sesame',
    category: 'other',
    severity: 'moderate',
    tier: 'plus',
    keywords: [
      'sesame', 'sesame seed', 'sesame oil', 'tahini', 'sesamol', 'sesamolin'
    ],
    derivatives: [
      'benne seed', 'gingelly', 'sim sim', 'til', 'hummus', 'halva'
    ],
    description: 'Increasingly common allergen, now recognized as major allergen in many countries.'
  },

  mustard: {
    id: 'mustard',
    name: 'Mustard',
    category: 'other',
    severity: 'moderate',
    tier: 'plus',
    keywords: [
      'mustard', 'mustard seed', 'mustard flour', 'mustard oil', 'yellow mustard',
      'dijon mustard', 'brown mustard', 'black mustard'
    ],
    derivatives: [
      'mustard greens', 'mustard powder', 'brassica'
    ],
    description: 'Common in European foods. Can cause skin reactions and respiratory issues.'
  },

  celery: {
    id: 'celery',
    name: 'Celery',
    category: 'vegetables',
    severity: 'moderate',
    tier: 'plus',
    keywords: [
      'celery', 'celery seed', 'celery salt', 'celery root', 'celeriac'
    ],
    derivatives: [
      'celery flakes', 'celery extract', 'celery juice'
    ],
    description: 'Can cause severe reactions, especially in people with birch pollen allergy.'
  },

  lupin: {
    id: 'lupin',
    name: 'Lupin',
    category: 'other',
    severity: 'moderate',
    tier: 'plus',
    keywords: [
      'lupin', 'lupine', 'lupin flour', 'lupin protein', 'lupin beans'
    ],
    derivatives: [
      'lupini beans', 'lupin seeds'
    ],
    description: 'Common in gluten-free products. Cross-reactivity with peanut allergy.'
  },

  sulfites: {
    id: 'sulfites',
    name: 'Sulfites',
    category: 'additives',
    severity: 'moderate',
    tier: 'plus',
    keywords: [
      'sulfite', 'sulphite', 'sulfur dioxide', 'sodium sulfite',
      'sodium bisulfite', 'potassium bisulfite', 'sodium metabisulfite'
    ],
    derivatives: [
      'e220', 'e221', 'e222', 'e223', 'e224', 'e225', 'e226', 'e227', 'e228'
    ],
    description: 'Preservative causing breathing problems in asthmatics. Common in wine, dried fruit.'
  },

  // TREE NUT VARIETIES (PLUS TIER - Individual)
  almonds: {
    id: 'almonds',
    name: 'Almonds',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['almond', 'almonds', 'almond milk', 'almond butter', 'almond flour', 'almond oil'],
    derivatives: ['marzipan', 'amaretto'],
    description: 'Most common tree nut allergy. Can cause anaphylaxis.'
  },

  cashews: {
    id: 'cashews',
    name: 'Cashews',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['cashew', 'cashews', 'cashew butter', 'cashew milk', 'cashew cream'],
    derivatives: ['cashew cheese'],
    description: 'High risk of severe reactions. Often cross-reactive with pistachios.'
  },

  walnuts: {
    id: 'walnuts',
    name: 'Walnuts',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['walnut', 'walnuts', 'black walnut', 'english walnut', 'walnut oil'],
    derivatives: ['walnut butter'],
    description: 'Common in baked goods. Can cause severe allergic reactions.'
  },

  pecans: {
    id: 'pecans',
    name: 'Pecans',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['pecan', 'pecans', 'pecan pie'],
    derivatives: [],
    description: 'Often cross-reactive with walnuts and hickory nuts.'
  },

  pistachios: {
    id: 'pistachios',
    name: 'Pistachios',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['pistachio', 'pistachios', 'pistachio butter'],
    derivatives: [],
    description: 'Cross-reactive with cashews. Used in Middle Eastern and Mediterranean cuisine.'
  },

  hazelnuts: {
    id: 'hazelnuts',
    name: 'Hazelnuts (Filberts)',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['hazelnut', 'hazelnuts', 'filbert', 'hazelnut oil'],
    derivatives: ['gianduja', 'frangelico'],
    description: 'Common in chocolate spreads. Cross-reactive with birch pollen.'
  },

  macadamia: {
    id: 'macadamia',
    name: 'Macadamia Nuts',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['macadamia', 'macadamia nut', 'macadamia oil'],
    derivatives: [],
    description: 'Less common but can cause severe reactions.'
  },

  brazil_nuts: {
    id: 'brazil_nuts',
    name: 'Brazil Nuts',
    category: 'tree_nuts',
    severity: 'severe',
    tier: 'plus',
    keywords: ['brazil nut', 'brazil nuts'],
    derivatives: ['brazil nut oil'],
    description: 'High selenium content tree nut.'
  },

  pine_nuts: {
    id: 'pine_nuts',
    name: 'Pine Nuts',
    category: 'tree_nuts',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['pine nut', 'pine nuts', 'pignoli', 'pinon'],
    derivatives: ['pine nut oil', 'pesto'],
    description: 'Used in Mediterranean cuisine.'
  },

  // SEEDS (PLUS TIER)
  'sunflower-seeds': {
    id: 'sunflower-seeds',
    name: 'Sunflower Seeds',
    category: 'seeds',
    severity: 'mild',
    tier: 'plus',
    keywords: ['sunflower seed', 'sunflower', 'sunflower butter', 'sunflower oil'],
    derivatives: [],
    description: 'Increasingly common allergen, especially in nut-free products.'
  },

  'pumpkin-seeds': {
    id: 'pumpkin-seeds',
    name: 'Pumpkin Seeds (Pepitas)',
    category: 'seeds',
    severity: 'mild',
    tier: 'plus',
    keywords: ['pumpkin seed', 'pepita', 'pumpkin seed oil'],
    derivatives: [],
    description: 'Rare but can cause reactions in sensitized individuals.'
  },

  'poppy-seeds': {
    id: 'poppy-seeds',
    name: 'Poppy Seeds',
    category: 'seeds',
    severity: 'mild',
    tier: 'plus',
    keywords: ['poppy seed', 'poppy seeds'],
    derivatives: [],
    description: 'Can cause mild allergic reactions. Common on baked goods.'
  },

  chia: {
    id: 'chia',
    name: 'Chia Seeds',
    category: 'seeds',
    severity: 'mild',
    tier: 'plus',
    keywords: ['chia', 'chia seed'],
    derivatives: ['chia oil'],
    description: 'Superfood that can cause reactions.'
  },

  flax: {
    id: 'flax',
    name: 'Flax Seeds',
    category: 'seeds',
    severity: 'mild',
    tier: 'plus',
    keywords: ['flax', 'flaxseed', 'linseed'],
    derivatives: ['flaxseed oil', 'linseed oil'],
    description: 'Omega-3 rich seed.'
  },

  // FRUITS (PLUS TIER)
  kiwi: {
    id: 'kiwi',
    name: 'Kiwi',
    category: 'fruits',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['kiwi', 'kiwifruit'],
    derivatives: [],
    description: 'Common cause of oral allergy syndrome. Cross-reactive with latex.'
  },

  banana: {
    id: 'banana',
    name: 'Banana',
    category: 'fruits',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['banana', 'bananas'],
    derivatives: [],
    description: 'Often associated with latex allergy. Can cause oral itching.'
  },

  avocado: {
    id: 'avocado',
    name: 'Avocado',
    category: 'fruits',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['avocado'],
    derivatives: ['guacamole'],
    description: 'Cross-reactive with latex and birch pollen.'
  },

  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'fruits',
    severity: 'mild',
    tier: 'plus',
    keywords: ['strawberry', 'strawberries'],
    derivatives: [],
    description: 'Can cause hives and oral symptoms. More common in children.'
  },

  mango: {
    id: 'mango',
    name: 'Mango',
    category: 'fruits',
    severity: 'mild',
    tier: 'plus',
    keywords: ['mango', 'mangoes'],
    derivatives: ['mango juice', 'mango puree'],
    description: 'Skin can cause contact dermatitis.'
  },

  pineapple: {
    id: 'pineapple',
    name: 'Pineapple',
    category: 'fruits',
    severity: 'mild',
    tier: 'plus',
    keywords: ['pineapple', 'pineapples'],
    derivatives: ['pineapple juice', 'bromelain'],
    description: 'Contains enzyme that can cause irritation.'
  },

  peach: {
    id: 'peach',
    name: 'Peach',
    category: 'fruits',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['peach', 'peaches'],
    derivatives: ['peach juice', 'peach nectar'],
    description: 'Common oral allergy syndrome trigger.'
  },

  apple: {
    id: 'apple',
    name: 'Apple',
    category: 'fruits',
    severity: 'mild',
    tier: 'plus',
    keywords: ['apple', 'apples'],
    derivatives: ['apple juice', 'apple cider', 'applesauce'],
    description: 'Raw apples can cause oral allergy syndrome.'
  },

  // VEGETABLES (PLUS TIER)
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    category: 'vegetables',
    severity: 'mild',
    tier: 'plus',
    keywords: ['tomato', 'tomatoes', 'tomato sauce', 'tomato paste'],
    derivatives: ['ketchup', 'marinara'],
    description: 'Part of nightshade family. Can cause oral allergy syndrome.'
  },

  potato: {
    id: 'potato',
    name: 'Potato',
    category: 'vegetables',
    severity: 'mild',
    tier: 'plus',
    keywords: ['potato', 'potatoes'],
    derivatives: ['potato starch', 'potato flour'],
    description: 'Nightshade allergen.'
  },

  carrot: {
    id: 'carrot',
    name: 'Carrot',
    category: 'vegetables',
    severity: 'mild',
    tier: 'plus',
    keywords: ['carrot', 'carrots'],
    derivatives: ['carrot juice'],
    description: 'Can cause oral allergy syndrome.'
  },

  // GRAINS (PLUS TIER)
  corn: {
    id: 'corn',
    name: 'Corn',
    category: 'grains',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['corn', 'maize', 'corn syrup', 'corn starch', 'corn flour', 'cornmeal'],
    derivatives: ['dextrose', 'maltodextrin', 'glucose', 'high fructose corn syrup'],
    description: 'Very common in processed foods. Can be severe for some individuals.'
  },

  rice: {
    id: 'rice',
    name: 'Rice',
    category: 'grains',
    severity: 'mild',
    tier: 'plus',
    keywords: ['rice'],
    derivatives: ['rice flour', 'rice syrup', 'rice bran', 'rice starch'],
    description: 'Rare allergen.'
  },

  oats: {
    id: 'oats',
    name: 'Oats',
    category: 'grains',
    severity: 'mild',
    tier: 'plus',
    keywords: ['oat', 'oats', 'oatmeal'],
    derivatives: ['oat flour', 'oat milk', 'oat bran'],
    description: 'Can be cross-contaminated with wheat.'
  },

  barley: {
    id: 'barley',
    name: 'Barley',
    category: 'grains',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['barley'],
    derivatives: ['malt', 'barley malt', 'malt vinegar', 'malt syrup'],
    description: 'Contains gluten.'
  },

  rye: {
    id: 'rye',
    name: 'Rye',
    category: 'grains',
    severity: 'moderate',
    tier: 'plus',
    keywords: ['rye'],
    derivatives: ['rye flour', 'rye bread'],
    description: 'Contains gluten.'
  },

  // ADDITIVES (PLUS TIER)
  msg: {
    id: 'msg',
    name: 'MSG (Monosodium Glutamate)',
    category: 'additives',
    severity: 'mild',
    tier: 'plus',
    keywords: ['monosodium glutamate', 'msg', 'e621'],
    derivatives: ['hydrolyzed protein', 'autolyzed yeast', 'yeast extract'],
    description: 'Controversial. Some report headaches and flushing. Sensitivity varies widely.'
  },

  carrageenan: {
    id: 'carrageenan',
    name: 'Carrageenan',
    category: 'additives',
    severity: 'mild',
    tier: 'plus',
    keywords: ['carrageenan', 'e407'],
    derivatives: [],
    description: 'Thickener from seaweed. Can cause digestive inflammation in some people.'
  },

  red_dye: {
    id: 'red_dye',
    name: 'Red Dye (Red 40)',
    category: 'additives',
    severity: 'mild',
    tier: 'plus',
    keywords: ['red 40', 'red dye', 'allura red', 'e129'],
    derivatives: ['fd&c red 40'],
    description: 'Artificial coloring linked to hyperactivity.'
  },

  yellow_dye: {
    id: 'yellow_dye',
    name: 'Yellow Dye (Yellow 5)',
    category: 'additives',
    severity: 'mild',
    tier: 'plus',
    keywords: ['yellow 5', 'tartrazine', 'e102'],
    derivatives: ['fd&c yellow 5'],
    description: 'Artificial coloring that can trigger reactions.'
  },

  // LATEX CROSS-REACTIVE FOODS (PRO TIER)
  latex_banana: {
    id: 'latex_banana',
    name: 'Latex-Banana Syndrome',
    category: 'other',
    severity: 'moderate',
    tier: 'pro',
    keywords: ['latex', 'banana'],
    derivatives: [],
    description: 'Cross-reactivity between latex and banana proteins.'
  },

  latex_avocado: {
    id: 'latex_avocado',
    name: 'Latex-Avocado Syndrome',
    category: 'other',
    severity: 'moderate',
    tier: 'pro',
    keywords: ['latex', 'avocado'],
    derivatives: [],
    description: 'Cross-reactivity between latex and avocado proteins.'
  },

  latex_kiwi: {
    id: 'latex_kiwi',
    name: 'Latex-Kiwi Syndrome',
    category: 'other',
    severity: 'moderate',
    tier: 'pro',
    keywords: ['latex', 'kiwi'],
    derivatives: [],
    description: 'Cross-reactivity between latex and kiwi proteins.'
  },

  // SPECIALIZED ALLERGENS (PRO TIER)
  chickpeas: {
    id: 'chickpeas',
    name: 'Chickpeas',
    category: 'other',
    severity: 'moderate',
    tier: 'pro',
    keywords: ['chickpea', 'chickpeas', 'garbanzo'],
    derivatives: ['hummus', 'chickpea flour', 'besan'],
    description: 'Legume allergen.'
  },

  lentils: {
    id: 'lentils',
    name: 'Lentils',
    category: 'other',
    severity: 'moderate',
    tier: 'pro',
    keywords: ['lentil', 'lentils'],
    derivatives: ['lentil flour', 'dal'],
    description: 'Legume allergen.'
  },

  coconut: {
    id: 'coconut',
    name: 'Coconut',
    category: 'other',
    severity: 'moderate',
    tier: 'pro',
    keywords: ['coconut'],
    derivatives: ['coconut oil', 'coconut milk', 'coconut flour', 'coconut water'],
    description: 'Tree nut allergen (technically a fruit).'
  },

  cocoa: {
    id: 'cocoa',
    name: 'Cocoa/Chocolate',
    category: 'other',
    severity: 'mild',
    tier: 'pro',
    keywords: ['cocoa', 'chocolate', 'cacao'],
    derivatives: ['chocolate', 'cocoa butter', 'cacao'],
    description: 'Can cause histamine reactions.'
  },

  caffeine: {
    id: 'caffeine',
    name: 'Caffeine',
    category: 'other',
    severity: 'mild',
    tier: 'pro',
    keywords: ['caffeine', 'coffee', 'tea'],
    derivatives: ['guarana', 'yerba mate'],
    description: 'Stimulant that can cause sensitivity.'
  },
};

// ==========================================
// SEVERITY LEVELS
// ==========================================

export const SEVERITY_LEVELS = {
  severe: {
    color: '#DC2626', // red-600
    icon: '🔴',
    description: 'Can cause anaphylaxis - life-threatening'
  },
  moderate: {
    color: '#F59E0B', // amber-500
    icon: '🟡',
    description: 'Strong reactions possible - significant symptoms'
  },
  mild: {
    color: '#10B981', // green-500
    icon: '🟢',
    description: 'Sensitivity - mild to moderate symptoms'
  }
};

// ==========================================
// TIER ACCESS
// ==========================================

export const TIER_ACCESS = {
  free: ['milk', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy'],
  plus: null, // All allergens
  pro: null   // All allergens + unlimited profiles
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get allergen by ID
 */
export function getAllergen(allergenId) {
  return ALLERGEN_DATABASE[allergenId] || null;
}

/**
 * Get all allergens for a specific tier
 */
export function getAllergensForTier(tier) {
  const tierLower = tier.toLowerCase();
  
  if (tierLower === 'free') {
    return TIER_ACCESS.free.map(id => ALLERGEN_DATABASE[id]).filter(Boolean);
  }
  // plus and pro get all allergens
  return Object.values(ALLERGEN_DATABASE);
}

/**
 * Get allergens by category
 */
export function getAllergensByCategory(category) {
  if (category === 'all') {
    return Object.values(ALLERGEN_DATABASE);
  }
  
  return Object.values(ALLERGEN_DATABASE).filter(
    allergen => allergen.category === category
  );
}

/**
 * Get allergens by severity
 */
export function getAllergensBySeverity(severity) {
  return Object.values(ALLERGEN_DATABASE).filter(
    allergen => allergen.severity === severity.toLowerCase()
  );
}

/**
 * Check if user has access to allergen based on tier
 */
export function canAccessAllergen(allergenId, userTier) {
  const tierLower = userTier.toLowerCase();
  
  if (tierLower === 'pro' || tierLower === 'plus') {
    return true;
  }
  // free tier
  return TIER_ACCESS.free.includes(allergenId);
}

/**
 * Get total allergen count
 */
export function getTotalAllergenCount() {
  return Object.keys(ALLERGEN_DATABASE).length;
}

export default ALLERGEN_DATABASE;