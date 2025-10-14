import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductService from '../services/ProductService';
import { getGradeGradient, getResultBackgroundColor, getStatusBadgeColor } from '../utils/calculations';
import { isTablet } from '../utils/responsive';
import { Ionicons } from '@expo/vector-icons';

const ResultsScreen = ({
  currentProduct,
  userSettings,
  setShowResult,
  setCurrentProduct,
  setScanMethod,
  setIsScanning,
  fadeAnim,
  styles, // Pass styles from App.js for now
}) => {
  const ResponsiveContainer = ({ children, style }) => (
    <View style={[
      styles.responsiveContainer,
      isTablet && styles.tabletContainer,
      style
    ]}>
      {children}
    </View>
  );

  // Get the product data (handle both mock and real API data)
  const productData = currentProduct.rawData || currentProduct;
  
  // Check for user allergen matches
  const userAllergenWarnings = ProductService.checkUserAllergens(
    productData,
    userSettings.activeFilters
  );

  // Parse allergens from the product
  const getAllergens = () => {
    if (productData.displayData?.mainAllergens) {
      return productData.displayData.mainAllergens;
    }
    if (productData.allergens_tags) {
      return productData.allergens_tags.map(tag => 
        tag.replace('en:', '').replace('-', ' ').charAt(0).toUpperCase() + 
        tag.replace('en:', '').replace('-', ' ').slice(1)
      );
    }
    return [];
  };

  const allAllergens = getAllergens();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      <StatusBar barStyle="dark-content" />
      
      <ResponsiveContainer>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setShowResult(false);
              setCurrentProduct(null);
            }}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Results</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.resultContent, { opacity: fadeAnim }]}>
            
            {/* Product Header - Contains Grade, Product Info, and Status Badge */}
            <View style={[styles.productHeaderCard, { backgroundColor: getResultBackgroundColor(currentProduct.healthScore?.score || 0) }]}>
              <LinearGradient
                colors={getGradeGradient(currentProduct?.healthScore?.score || 0)}
                style={styles.gradeCircle}
              >
                <Text style={styles.gradeText}>
                  {currentProduct.healthScore?.grade || '?'}
                </Text>
              </LinearGradient>

              {/* Product Image */}
              <View style={styles.productImageContainer}>
                {currentProduct.image_url === '🍫' ? (
                  <Text style={[styles.placeholderIcon, { fontSize: 60 }]}>🍫</Text>
                ) : currentProduct.image && !currentProduct.image.includes('PHN2Z') ? (
                  <Image 
                    source={{ uri: currentProduct.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderIcon}>📦</Text>
                    <Text style={styles.placeholderText}>No image available</Text>
                  </View>
                )}
              </View>

              <View style={styles.productInfo}>
  <Text style={styles.productName}>
    {currentProduct.name || currentProduct.product_name || 'Unknown Product'}
  </Text>
  <Text style={styles.productBrand}>
    {currentProduct.brand || currentProduct.brands || 'Unknown Brand'} • {currentProduct.categories?.split(',')[0] || 'Food Product'}
  </Text>
  
</View>

              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(currentProduct.healthScore?.score || 0) }]}>
                  <Text style={styles.statusBadgeText}>
                    {currentProduct.healthScore?.score <= 30 ? 'Avoid - Serious Health Concerns' :
                     currentProduct.healthScore?.score <= 50 ? 'Limit - Health Concerns' :
                     currentProduct.healthScore?.score <= 70 ? 'Moderate - Some Concerns' :
                     'Good Choice'}
                  </Text>
                </View>
              </View>
            </View>

            {/* User Allergen Alert - Only show if user has allergen matches */}
            {userAllergenWarnings && userAllergenWarnings.length > 0 && (
              <View style={styles.allergenAlertBox}>
                <View style={styles.allergenHeader}>
                  <Text style={styles.allergenIcon}>⚠️</Text>
                  <Text style={styles.allergenTitle}>Allergen Alert</Text>
                </View>
                <Text style={styles.allergenDescription}>
                  This product contains ingredients you've marked to avoid in your profile settings.
                </Text>
                {userAllergenWarnings.map((warning, index) => {
                  // Check if it's tree nuts and show the correct allergen
                  const displayWarning = warning.title.includes('tree-nuts') ? 
                    'Contains Tree Nuts (Hazelnuts)' : 
                    warning.title.replace('⚠️ ', '');
                  
                  return (
                    <Text key={index} style={styles.allergenItem}>
                      • {displayWarning}
                    </Text>
                  );
                })}
              </View>
            )}

            {/* All Allergens Section - NEW */}
            {allAllergens.length > 0 && (
              <View style={styles.allergensSection}>
                <Text style={styles.sectionTitle}>🥜 All Allergens</Text>
                <Text style={styles.allergenSubtext}>This product contains:</Text>
                <View style={styles.allergensList}>
                  {allAllergens.map((allergen, index) => (
                    <View key={index} style={styles.allergenChip}>
                      <Text style={styles.allergenChipText}>{allergen}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Nutrition Facts - NEW */}
            {(productData.nutriments || productData.displayData?.keyNutrients) && (
              <View style={styles.nutritionSection}>
                <Text style={styles.sectionTitle}>📊 Nutrition Facts</Text>
                <Text style={styles.nutritionSubtext}>Per 100g</Text>
                <View style={styles.nutritionGrid}>
                  {productData.displayData?.keyNutrients ? (
                    // Use display data if available
                    Object.entries(productData.displayData.keyNutrients).map(([key, value], index) => (
                      <View key={index} style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                        <Text style={styles.nutritionValue}>{value}</Text>
                      </View>
                    ))
                  ) : (
                    // Use raw nutriments data
                    <>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                        <Text style={styles.nutritionValue}>{productData.nutriments['energy-kcal_100g'] || 0} kcal</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Sugar</Text>
                        <Text style={[styles.nutritionValue, 
                          productData.nutriments['sugars_100g'] > 22.5 && styles.nutritionValueBad
                        ]}>{productData.nutriments['sugars_100g'] || 0}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Saturated Fat</Text>
                        <Text style={[styles.nutritionValue,
                          productData.nutriments['saturated-fat_100g'] > 5 && styles.nutritionValueBad
                        ]}>{productData.nutriments['saturated-fat_100g'] || 0}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                        <Text style={styles.nutritionValue}>{productData.nutriments['proteins_100g'] || 0}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fiber</Text>
                        <Text style={styles.nutritionValue}>{productData.nutriments['fiber_100g'] || 0}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Salt</Text>
                        <Text style={styles.nutritionValue}>{productData.nutriments['salt_100g'] || 0}g</Text>
                      </View>
                    </>
                  )}
                </View>
 
{productData.serving_size && (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionLabel}>Serving Size</Text>
    <Text style={styles.nutritionValue}>{productData.serving_size}</Text>
  </View>
)}

{/* ADD CONTAINER SIZE */}
{(productData.quantity || currentProduct.netQuantity) && (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionLabel}>Container Size</Text>
    <Text style={styles.nutritionValue}>
      {productData.quantity || currentProduct.netQuantity}
    </Text>
  </View>
)}
              </View>
            )}

            {/* Positive Aspects */}
            {(currentProduct.positiveAttributes || currentProduct.positiveAspects) && 
             (currentProduct.positiveAttributes?.length > 0 || currentProduct.positiveAspects?.length > 0) && (
              <View style={styles.positiveSection}>
                <Text style={styles.sectionTitle}>✅ Positive Aspects</Text>
                {(currentProduct.positiveAttributes || currentProduct.positiveAspects || []).map((attribute, index) => (
                  <View key={index} style={styles.positiveItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.positiveText}>{attribute}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Health Warnings */}
            {(currentProduct.healthScore?.warnings || currentProduct.warnings) && 
             (currentProduct.healthScore?.warnings?.length > 0 || currentProduct.warnings?.length > 0) && (
              <View style={styles.warningsContainer}>
                <Text style={styles.warningsTitle}>⚠️ Health Warnings</Text>
                {(currentProduct.healthScore?.warnings || currentProduct.warnings || []).map((warning, index) => (
                  <View
                    key={index}
                    style={[
                      styles.warningCard,
                      {
                        backgroundColor:
                          warning.severity === 'extreme' ? '#FEE2E2' :
                          warning.severity === 'high' ? '#FED7AA' :
                          warning.severity === 'medium' ? '#FEF3C7' :
                          '#E0E7FF'
                      }
                    ]}
                  >
                    <View style={styles.warningContent}>
                      <Text style={styles.warningTitle}>{warning.title}</Text>
                      <Text style={styles.warningDesc}>{warning.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Additives Section - NEW */}
            {(currentProduct.additives && currentProduct.additives.length > 0) || 
             (productData.additives_tags && productData.additives_tags.length > 0) ? (
              <View style={styles.additivesSection}>
                <Text style={styles.sectionTitle}>🧪 Additives Found</Text>
                <View>
                  {currentProduct.additives && currentProduct.additives.length > 0 ? (
                    currentProduct.additives.map((additive, index) => (
                      <Text key={index} style={styles.additiveItem}>
                        • {additive.code} - {additive.name}
                        {additive.severity === 'high' && ' ⚠️'}
                      </Text>
                    ))
                  ) : (
                    productData.additives_tags.map((additive, index) => (
                      <Text key={index} style={styles.additiveItem}>
                        • {additive.replace('en:', '').toUpperCase()}
                      </Text>
                    ))
                  )}
                </View>
                {productData.additives_n && (
                  <Text style={styles.additivesCount}>
                    Total additives: {productData.additives_n}
                  </Text>
                )}
              </View>
            ) : null}

            {/* Ingredients Section - NEW */}
            {productData.ingredients_text && (
              <View style={styles.ingredientsSection}>
                <Text style={styles.sectionTitle}>📝 Ingredients</Text>
                <Text style={styles.ingredientsText}>{productData.ingredients_text}</Text>
              </View>
            )}

            {/* Processing Level - NEW */}
            {productData.nova_group && (
              <View style={styles.processingSection}>
                <Text style={styles.sectionTitle}>🏭 Processing Level</Text>
                <View style={[styles.novaGroupBadge, 
                  { backgroundColor: 
                    productData.nova_group === '4' ? '#FEE2E2' :
                    productData.nova_group === '3' ? '#FED7AA' :
                    productData.nova_group === '2' ? '#FEF3C7' :
                    '#D1FAE5'
                  }
                ]}>
                  <Text style={styles.novaGroupText}>
                    NOVA Group {productData.nova_group}
                    {productData.nova_group === '4' && ' - Ultra-processed'}
                    {productData.nova_group === '3' && ' - Processed'}
                    {productData.nova_group === '2' && ' - Processed ingredients'}
                    {productData.nova_group === '1' && ' - Unprocessed'}
                  </Text>
                </View>
              </View>
            )}

            {/* Nutri-Score Section - NEW */}
            {productData.nutrition_grades && (
              <View style={styles.nutriScoreSection}>
                <Text style={styles.sectionTitle}>🎯 Nutri-Score</Text>
                <LinearGradient
                  colors={
                    productData.nutrition_grades === 'a' ? ['#038141', '#03A550'] :
                    productData.nutrition_grades === 'b' ? ['#85BB2F', '#94C83D'] :
                    productData.nutrition_grades === 'c' ? ['#FECB02', '#FFD617'] :
                    productData.nutrition_grades === 'd' ? ['#EE8100', '#F39200'] :
                    ['#E63E11', '#ED5922']
                  }
                  style={styles.nutriScoreBadge}
                >
                  <Text style={styles.nutriScoreText}>
                    Grade {productData.nutrition_grades.toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 20, paddingHorizontal: 15 }}>
              <TouchableOpacity
                style={{ 
                  flex: 1,
                  backgroundColor: '#007BFF',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => {
                  Alert.alert('Success', 'Saved to history!');
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ 
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
                onPress={async () => {
  const shareMessage = `🔍 NutraDetective Scan Results\n\n` +
    `📦 ${currentProduct.name}\n` +
    `🏷️ ${currentProduct.brand}\n` +
    `📊 Grade: ${currentProduct.healthScore?.grade || '?'}\n` +
    `⭐ Score: ${currentProduct.healthScore?.score || 0}/100\n\n` +
    `${currentProduct.healthScore?.status || 'Unknown Status'}\n\n` +
    `Scanned with NutraDetective\n` +
    `Download: nutradetective.com`;

  try {
    await Share.share({
      message: shareMessage,
      title: 'NutraDetective Scan Results'
    });
  } catch (error) {
    Alert.alert('Error', 'Could not share results');
  }
}}
              >
                <LinearGradient
                  colors={['#E91E63', '#9C27B0']}
                  style={{ 
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Share</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

// Add these additional styles to your AppStyles.js
const additionalStyles = StyleSheet.create({
  servingSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'center',
  },
  servingSizeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  servingSizeValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
  },
  allergensSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  allergenSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 5,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  allergenChip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenChipText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
  },
  nutritionSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  nutritionSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 5,
  },
  nutritionGrid: {
    marginTop: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nutritionLabel: {
    color: '#4B5563',
    fontSize: 14,
  },
  nutritionValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  nutritionValueBad: {
    color: '#DC2626',
  },
  servingSizeText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  additivesSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  additivesText: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 8,
  },
  additiveItem: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 5,
  },
  additivesCount: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  ingredientsSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  ingredientsText: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  processingSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  novaGroupBadge: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  novaGroupText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  nutriScoreSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  nutriScoreBadge: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nutriScoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;