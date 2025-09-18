// constants/mockData.js
export const MOCK_NUTELLA_DATA = {
  barcode: '3017620422003',
  name: 'Nutella',
  brand: 'Ferrero',
  categories: 'Petit-déjeuners,Produits à tartiner,Produits à tartiner sucrés,Pâtes à tartiner,Pâtes à tartiner aux noisettes',
  image: '🍫', // Using emoji for simplicity
  healthScore: {
    score: 25,
    grade: 'F',
    gradeColor: '#DC2626'
  },
  allergens: ['gluten', 'tree-nuts', 'milk', 'soy'],
  userAllergens: ['gluten'], // Matches user's settings
  positiveAspects: ['Low sodium'],
  warnings: [
    {
      title: 'Ultra-Processed Food',
      description: 'Linked to 29% increased mortality risk (BMJ 2019)',
      severity: 'high'
    },
    {
      title: 'Extreme Sugar Content',
      description: '56.3g per 100g - major health risk!',
      severity: 'extreme'
    },
    {
      title: 'Extreme Saturated Fat',
      description: '10.6g per 100g - major cardiovascular risk!',
      severity: 'extreme'
    }
  ],
  nutritionFacts: {
    sugars_100g: 56.3,
    saturated_fat_100g: 10.6,
    sodium_100g: 0.041,
    calories_100g: 539
  }
};