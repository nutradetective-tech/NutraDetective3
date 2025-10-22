import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductService from '../services/ProductService';
import PremiumService from '../services/PremiumService';
import AllergenService from '../services/AllergenService';
import HealthyAlternativesService from '../services/HealthyAlternativesService';
import AdhdAlertModal from '../components/modals/AdhdAlertModal';
import { getGradeGradient, getResultBackgroundColor, getStatusBadgeColor } from '../utils/calculations';
import { isTablet } from '../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import RecallService from '../services/RecallService';

const ResultsScreen = ({
  currentProduct,
  userSettings,
  setShowResult,
  setCurrentProduct,
  setScanMethod,
  setIsScanning,
  fadeAnim,
  styles,
  setShowUpgradeModal,
  setUpgradeReason,
  handleBarcodeScan,  // ← NEW PROP
}) => {
  // ===== NEW: Recall check state =====
  const [scannedRecall, setScannedRecall] = useState(null);
  const [checkingRecall, setCheckingRecall] = useState(false);
  
  // State for ADHD alert modal
  const [showAdhdAlert, setShowAdhdAlert] = useState(false);
  const [adhdAdditives, setAdhdAdditives] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  // ===== NEW: Advanced allergen state =====
  const [allergenSummary, setAllergenSummary] = useState(null);
  const [userTier, setUserTier] = useState('FREE');

  // ===== NEW: Healthy alternatives state =====
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  // Check for ADHD additives, allergens, and alternatives when product loads
  useEffect(() => {
    checkAdhdAdditives();
    checkAllergens();
    loadAlternatives();
    checkForRecall();
  }, [currentProduct]);

  const checkAdhdAdditives = async () => {
    try {
      // Check premium status
      const premiumStatus = await PremiumService.isPremium();
      setIsPremium(premiumStatus);

      // Detect ADHD-linked additives
      const detectedAdditives = ProductService.detectAdhdAdditives(currentProduct);
      
      if (detectedAdditives && detectedAdditives.length > 0) {
        console.log(`🧠 Found ${detectedAdditives.length} ADHD-linked additives, showing alert`);
        setAdhdAdditives(detectedAdditives);
        setShowAdhdAlert(true);
      } else {
        console.log('✅ No ADHD-linked additives found');
      }
    } catch (error) {
      console.error('Error checking ADHD additives:', error);
    }
  };

  // ===== NEW: Check allergens using new system =====
  const checkAllergens = async () => {
    try {
      // Get user's tier
      const status = await PremiumService.getStatus();
      setUserTier(status.tier.toUpperCase());

      // Get allergen summary
      const summary = await AllergenService.getAllergenSummary(
        currentProduct,
        status.tier.toUpperCase()
      );

      setAllergenSummary(summary);

      if (summary.hasAllergens) {
        console.log(`🥜 Found allergens affecting ${summary.affectedProfiles} profile(s)`);
      } else {
        console.log('✅ No allergens detected for any profiles');
      }
    } catch (error) {
      console.error('Error checking allergens:', error);
    }
  };

  // ===== NEW: Load healthy alternatives with COMPLETE ALLERGEN MAPPING =====
  const loadAlternatives = async () => {
      try {
      setLoadingAlternatives(true);
      
      // Get user's allergen profiles - FIXED: Use getAllProfiles()
      const allergenProfiles = await AllergenService.getAllProfiles();
      const defaultProfile = allergenProfiles.find(p => p.isDefault);
      
      // Get raw allergen IDs from profile
      const rawAllergenIds = defaultProfile?.allergens || [];
      
      // ========================================
      // COMPLETE ALLERGEN MAPPING
      // Maps ALL specific allergens to generic categories for filtering
      // CRITICAL: This protects users from dangerous recommendations
      // ========================================
      const allergenMap = {
        // ===== FDA TOP 8 (Generic - pass through) =====
        'milk': 'milk',
        'eggs': 'eggs',
        'fish': 'fish',
        'shellfish': 'shellfish',
        'tree-nuts': 'tree-nuts',
        'peanuts': 'peanuts',
        'wheat': 'wheat',
        'soy': 'soy',
        
        // ===== TREE NUTS (All map to generic tree-nuts) =====
        'almonds': 'tree-nuts',
        'cashews': 'tree-nuts',
        'walnuts': 'tree-nuts',
        'pecans': 'tree-nuts',
        'pistachios': 'tree-nuts',
        'hazelnuts': 'tree-nuts',
        'macadamia': 'tree-nuts',
        'brazil_nuts': 'tree-nuts',
        'pine_nuts': 'tree-nuts',
        
        // ===== SEEDS (Keep specific) =====
        'sesame': 'sesame',
        'sunflower-seeds': 'sunflower',
        'pumpkin-seeds': 'pumpkin',
        'poppy-seeds': 'poppy',
        'chia': 'chia',
        'flax': 'flax',
        
        // ===== GRAINS (Keep specific or map to gluten) =====
        'corn': 'corn',
        'rice': 'rice',
        'oats': 'oats',
        'barley': 'wheat', // Contains gluten
        'rye': 'wheat',    // Contains gluten
        
        // ===== FRUITS (Keep specific) =====
        'kiwi': 'kiwi',
        'banana': 'banana',
        'avocado': 'avocado',
        'strawberry': 'strawberry',
        'mango': 'mango',
        'pineapple': 'pineapple',
        'peach': 'peach',
        'apple': 'apple',
        
        // ===== VEGETABLES (Keep specific) =====
        'celery': 'celery',
        'tomato': 'tomato',
        'potato': 'potato',
        'carrot': 'carrot',
        
        // ===== LEGUMES (Keep specific) =====
        'lupin': 'lupin',
        'chickpeas': 'chickpeas',
        'lentils': 'lentils',
        
        // ===== OTHER ALLERGENS (Keep specific) =====
        'mustard': 'mustard',
        'sulfites': 'sulfites',
        'coconut': 'coconut',
        'cocoa': 'cocoa',
        'caffeine': 'caffeine',
        
        // ===== ADDITIVES (Keep specific) =====
        'msg': 'msg',
        'carrageenan': 'carrageenan',
        'red_dye': 'red-dye',
        'yellow_dye': 'yellow-dye',
        
        // ===== LATEX CROSS-REACTIVE (Map to fruit) =====
        'latex_banana': 'banana',
        'latex_avocado': 'avocado',
        'latex_kiwi': 'kiwi',
      };
      
const handleShareRecall = async () => {
    if (!scannedRecall) return;

    const shareMessage = 
      `🚨 FOOD RECALL ALERT\n\n` +
      `I just scanned "${currentProduct.name}" and it's been RECALLED!\n\n` +
      `Reason: ${scannedRecall.reason}\n` +
      `Classification: ${scannedRecall.classification}\n` +
      `Date: ${scannedRecall.recallDate}\n\n` +
      `${scannedRecall.actionToTake}\n\n` +
      `Check your food safety with NutraDetective 📱\n` +
      `Download: https://nutradetective.com`;

    try {
      await Share.share({
        message: shareMessage,
        title: 'Food Recall Alert'
      });
    } catch (error) {
      console.error('Error sharing recall:', error);
    }
  };

      // ===== NEW: Check if scanned product is recalled =====
  const checkForRecall = async () => {
    try {
      setCheckingRecall(true);
      
      // Quick check against cached recall feed (no API call!)
      const recall = await RecallService.checkScannedProduct(
        currentProduct.name,
        currentProduct.brand
      );
      
      if (recall) {
        console.log('🚨 SCANNED PRODUCT IS RECALLED!');
        setScannedRecall(recall);
      } else {
        console.log('✅ Scanned product not in recall database');
        setScannedRecall(null);
      }
    } catch (error) {
      console.error('Error checking recall:', error);
      setScannedRecall(null);
    } finally {
      setCheckingRecall(false);
    }
  };
      
  // Convert to generic allergen list for filtering
      const userAllergens = rawAllergenIds.map(id => allergenMap[id] || id);
      
      // Remove duplicates
      const uniqueAllergens = [...new Set(userAllergens)];
      
      console.log('🔄 ALLERGEN MAPPING FOR ALTERNATIVES:');
      console.log('══════════════════════════════════════════════════════════');
      console.log('📋 Raw allergen IDs from profile:', rawAllergenIds);
      console.log('🔀 Mapped to generic categories:', uniqueAllergens);
      console.log('✅ Total allergens to filter:', uniqueAllergens.length);
      console.log('══════════════════════════════════════════════════════════');
      
      // Find alternatives (will filter out ALL mapped allergens)
      const foundAlternatives = await HealthyAlternativesService.findAlternatives(
        currentProduct,
        uniqueAllergens
      );
      
      setAlternatives(foundAlternatives);
    } catch (error) {
      console.error('❌ Error loading alternatives:', error);
    } finally {
      setLoadingAlternatives(false);
    }
  };

  const handleUpgradeFromAdhdAlert = () => {
    setShowAdhdAlert(false);
    if (setUpgradeReason && setShowUpgradeModal) {
      setUpgradeReason('adhd');
      setShowUpgradeModal(true);
    } else {
      Alert.alert(
        'Upgrade to Plus',
        'Get detailed ADHD additive warnings with Plus membership for $4.99/month',
        [{ text: 'OK' }]
      );
    }
  };

  const ResponsiveContainer = ({ children, style }) => (
    <View style={[
      styles.responsiveContainer,
      isTablet && styles.tabletContainer,
      style
    ]}>
      {children}
    </View>
  );

  const productData = currentProduct.rawData || currentProduct;

  // ===== OLD allergen code kept for backward compatibility =====
  const userAllergenWarnings = ProductService.checkUserAllergens(
    productData,
    userSettings.activeFilters
  );

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
            
            {/* Product Header - unchanged */}
            <View style={[styles.productHeaderCard, { backgroundColor: getResultBackgroundColor(currentProduct.healthScore?.score || 0) }]}>
              <LinearGradient
                colors={getGradeGradient(currentProduct?.healthScore?.score || 0)}
                style={styles.gradeCircle}
              >
                <Text style={styles.gradeText}>
                  {currentProduct.healthScore?.grade || '?'}
                </Text>
              </LinearGradient>

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

            {/* ===== NEW: Advanced Allergen Warning - RED URGENT STYLING ===== */}
            {allergenSummary && allergenSummary.hasAllergens && (
              <View style={additionalStyles.allergenAlertBox}>
                <View style={additionalStyles.allergenHeader}>
                  <Text style={additionalStyles.allergenIcon}>🚨</Text>
                  <Text style={additionalStyles.allergenTitle}>
                    ALLERGEN ALERT !!!
                  </Text>
                </View>

                <Text style={additionalStyles.allergenDescription}>
                  ⚠️ WARNING: This product contains allergens affecting {allergenSummary.affectedProfiles} family member(s).
                </Text>

                {/* Show warnings by profile */}
                {allergenSummary.detailedResults.map((result, idx) => (
                  <View key={idx} style={additionalStyles.profileAllergenSection}>
                    <Text style={additionalStyles.profileName}>
                      👤 {result.profile.name}
                      {result.profile.isDefault && ' (You)'}
                    </Text>
                    {result.warnings.map((warning, wIdx) => (
                      <View key={wIdx} style={additionalStyles.allergenItemRow}>
                        <Text style={additionalStyles.severityIcon}>
                          🔴
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={additionalStyles.allergenItemTitle}>
                            {warning.allergenName}
                          </Text>
                          <Text style={additionalStyles.allergenItemSource}>
                            Found: {warning.matchedTerm}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}

                {/* ===== 🚨 SCANNED PRODUCT RECALL ALERT ===== */}
            {scannedRecall && (
              <View style={additionalStyles.scannedRecallBanner}>
                <View style={additionalStyles.scannedRecallHeader}>
                  <Text style={additionalStyles.scannedRecallIcon}>🚨</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={additionalStyles.scannedRecallTitle}>
                      RECALL ALERT
                    </Text>
                    <Text style={additionalStyles.scannedRecallSubtitle}>
                      This product has an active recall
                    </Text>
                  </View>
                  <View style={[
                    additionalStyles.severityDot,
                    { backgroundColor: scannedRecall.severity === 'critical' ? '#DC2626' : '#F97316' }
                  ]} />
                </View>

                <View style={additionalStyles.scannedRecallContent}>
                  <Text style={additionalStyles.scannedRecallReason}>
                    <Text style={{ fontWeight: 'bold' }}>Reason: </Text>
                    {scannedRecall.reason}
                  </Text>
                  <Text style={additionalStyles.scannedRecallDate}>
                    Recall Date: {scannedRecall.recallDate}
                  </Text>
                </View>

                <View style={additionalStyles.scannedRecallAction}>
                  <Text style={additionalStyles.scannedRecallActionText}>
                    {scannedRecall.actionToTake}
                  </Text>
                </View>

                <TouchableOpacity
                  style={additionalStyles.viewRecallButton}
                  onPress={() => {
                    Alert.alert(
                      'Full Recall Details',
                      `${scannedRecall.productName}\n\n` +
                      `Company: ${scannedRecall.company}\n` +
                      `Classification: ${scannedRecall.classification}\n` +
                      `Recall Number: ${scannedRecall.recallNumber}\n\n` +
                      `${scannedRecall.details || 'No additional details'}\n\n` +
                      `View all recalls in the Safety Alerts tab.`,
                      [
                        { text: 'Share Alert', onPress: () => handleShareRecall() },
                        { text: 'OK' }
                      ]
                    );
                  }}
                >
                  <Text style={additionalStyles.viewRecallButtonText}>
                    View Full Details →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

                {/* Hidden allergens warning */}
                {allergenSummary.hiddenAllergens.length > 0 && (
                  <View style={additionalStyles.hiddenAllergenSection}>
                    <Text style={additionalStyles.hiddenAllergenTitle}>
                      ⚠️ Cross-Contamination Warning
                    </Text>
                    {allergenSummary.hiddenAllergens.map((hidden, idx) => (
                      <Text key={idx} style={additionalStyles.hiddenAllergenText}>
                        • {hidden.warning}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Upgrade prompt if on free tier */}
                {userTier === 'FREE' && (
                  <TouchableOpacity
                    style={additionalStyles.upgradeButton}
                    onPress={() => {
                      if (setUpgradeReason && setShowUpgradeModal) {
                        setUpgradeReason('allergens');
                        setShowUpgradeModal(true);
                      }
                    }}
                  >
                    <Text style={additionalStyles.upgradeButtonText}>
                      ⭐ Upgrade to Plus for 100+ Allergens
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Old allergen section - keep for backward compatibility */}
            {userAllergenWarnings && userAllergenWarnings.length > 0 && !allergenSummary && (
              <View style={styles.allergenAlertBox}>
                <View style={styles.allergenHeader}>
                  <Text style={styles.allergenIcon}>⚠️</Text>
                  <Text style={styles.allergenTitle}>Allergen Alert</Text>
                </View>
                <Text style={styles.allergenDescription}>
                  This product contains ingredients you've marked to avoid in your profile settings.
                </Text>
                {userAllergenWarnings.map((warning, index) => {
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

            {/* All Allergens section - keep unchanged */}
            {allAllergens.length > 0 && (
              <View style={additionalStyles.allergensSection}>
                <Text style={styles.sectionTitle}>🥜 All Allergens</Text>
                <Text style={additionalStyles.allergenSubtext}>This product contains:</Text>
                <View style={additionalStyles.allergensList}>
                  {allAllergens.map((allergen, index) => (
                    <View key={index} style={additionalStyles.allergenChip}>
                      <Text style={additionalStyles.allergenChipText}>{allergen}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ===== NEW: Healthy Alternatives Section ===== */}
            {alternatives.length > 0 && (
              <View style={additionalStyles.alternativesSection}>
                <Text style={styles.sectionTitle}>✨ Healthier Alternatives</Text>
                <Text style={additionalStyles.alternativesSubtext}>
                  We found {alternatives.length} better option{alternatives.length > 1 ? 's' : ''} for you
                </Text>
                
                {alternatives.map((alt, index) => (
                  <View key={index} style={additionalStyles.alternativeCard}>
                    <View style={additionalStyles.alternativeHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={additionalStyles.alternativeName}>{alt.name}</Text>
                        <Text style={additionalStyles.alternativeBrand}>{alt.brand}</Text>
                      </View>
                      <View style={additionalStyles.alternativeGrade}>
                        <Text style={additionalStyles.alternativeGradeText}>{alt.grade}</Text>
                      </View>
                    </View>
                    
                    {alt.advantages && alt.advantages.length > 0 && (
                      <View style={additionalStyles.advantagesList}>
                        {alt.advantages.slice(0, 3).map((adv, idx) => (
                          <View key={idx} style={additionalStyles.advantageChip}>
                            <Text style={additionalStyles.advantageText}>{adv}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {alt.barcode && (
  <TouchableOpacity
    style={additionalStyles.scanButton}
    onPress={() => {
  console.log('🔄 Scanning alternative:', alt.barcode);
  
  // Close current results
  setShowResult(false);
  setCurrentProduct(null);
  
  // Trigger scan of alternative product
  handleBarcodeScan(alt.barcode);
}}
  >
    <Text style={additionalStyles.scanButtonText}>Scan This Instead</Text>
  </TouchableOpacity>
)}
                  </View>
                ))}
              </View>
            )}

            {/* Nutrition section */}
            {(productData.nutriments || productData.displayData?.keyNutrients) && (
              <View style={additionalStyles.nutritionSection}>
                <Text style={styles.sectionTitle}>📊 Nutrition Facts</Text>
                <Text style={additionalStyles.nutritionSubtext}>Per 100g</Text>
                <View style={additionalStyles.nutritionGrid}>
                  {productData.displayData?.keyNutrients ? (
                    Object.entries(productData.displayData.keyNutrients).map(([key, value], index) => (
                      <View key={index} style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                        <Text style={additionalStyles.nutritionValue}>{value}</Text>
                      </View>
                    ))
                  ) : (
                    <>
                      <View style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>Calories</Text>
                        <Text style={additionalStyles.nutritionValue}>{productData.nutriments['energy-kcal_100g'] || 0} kcal</Text>
                      </View>
                      <View style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>Sugar</Text>
                        <Text style={[additionalStyles.nutritionValue, 
                          productData.nutriments['sugars_100g'] > 22.5 && additionalStyles.nutritionValueBad
                        ]}>{productData.nutriments['sugars_100g'] || 0}g</Text>
                      </View>
                      <View style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>Saturated Fat</Text>
                        <Text style={[additionalStyles.nutritionValue,
                          productData.nutriments['saturated-fat_100g'] > 5 && additionalStyles.nutritionValueBad
                        ]}>{productData.nutriments['saturated-fat_100g'] || 0}g</Text>
                      </View>
                      <View style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>Protein</Text>
                        <Text style={additionalStyles.nutritionValue}>{productData.nutriments['proteins_100g'] || 0}g</Text>
                      </View>
                      <View style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>Fiber</Text>
                        <Text style={additionalStyles.nutritionValue}>{productData.nutriments['fiber_100g'] || 0}g</Text>
                      </View>
                      <View style={additionalStyles.nutritionItem}>
                        <Text style={additionalStyles.nutritionLabel}>Salt</Text>
                        <Text style={additionalStyles.nutritionValue}>{productData.nutriments['salt_100g'] || 0}g</Text>
                      </View>
                    </>
                  )}
                </View>
 
                {productData.serving_size && (
                  <View style={additionalStyles.nutritionItem}>
                    <Text style={additionalStyles.nutritionLabel}>Serving Size</Text>
                    <Text style={additionalStyles.nutritionValue}>{productData.serving_size}</Text>
                  </View>
                )}

                {(productData.quantity || currentProduct.netQuantity) && (
                  <View style={additionalStyles.nutritionItem}>
                    <Text style={additionalStyles.nutritionLabel}>Container Size</Text>
                    <Text style={additionalStyles.nutritionValue}>
                      {productData.quantity || currentProduct.netQuantity}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Positive Aspects - unchanged */}
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

            {/* Health Warnings - unchanged */}
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

            {/* Additives - unchanged */}
            {(currentProduct.additives && currentProduct.additives.length > 0) || 
             (productData.additives_tags && productData.additives_tags.length > 0) ? (
              <View style={additionalStyles.additivesSection}>
                <Text style={styles.sectionTitle}>🧪 Additives Found</Text>
                <View>
                  {currentProduct.additives && currentProduct.additives.length > 0 ? (
                    currentProduct.additives.map((additive, index) => (
                      <Text key={index} style={additionalStyles.additiveItem}>
                        • {additive.code} - {additive.name}
                        {additive.severity === 'high' && ' ⚠️'}
                      </Text>
                    ))
                  ) : (
                    productData.additives_tags.map((additive, index) => (
                      <Text key={index} style={additionalStyles.additiveItem}>
                        • {additive.replace('en:', '').toUpperCase()}
                      </Text>
                    ))
                  )}
                </View>
                {productData.additives_n && (
                  <Text style={additionalStyles.additivesCount}>
                    Total additives: {productData.additives_n}
                  </Text>
                )}
              </View>
            ) : null}

            {/* Ingredients - unchanged */}
            {productData.ingredients_text && (
              <View style={additionalStyles.ingredientsSection}>
                <Text style={styles.sectionTitle}>📝 Ingredients</Text>
                <Text style={additionalStyles.ingredientsText}>{productData.ingredients_text}</Text>
              </View>
            )}

            {/* Processing Level - unchanged */}
            {productData.nova_group && (
              <View style={additionalStyles.processingSection}>
                <Text style={styles.sectionTitle}>🏭 Processing Level</Text>
                <View style={[additionalStyles.novaGroupBadge, 
                  { backgroundColor: 
                    productData.nova_group === '4' ? '#FEE2E2' :
                    productData.nova_group === '3' ? '#FED7AA' :
                    productData.nova_group === '2' ? '#FEF3C7' :
                    '#D1FAE5'
                  }
                ]}>
                  <Text style={additionalStyles.novaGroupText}>
                    NOVA Group {productData.nova_group}
                    {productData.nova_group === '4' && ' - Ultra-processed'}
                    {productData.nova_group === '3' && ' - Processed'}
                    {productData.nova_group === '2' && ' - Processed ingredients'}
                    {productData.nova_group === '1' && ' - Unprocessed'}
                  </Text>
                </View>
              </View>
            )}

            {/* Nutri-Score - unchanged */}
            {productData.nutrition_grades && (
              <View style={additionalStyles.nutriScoreSection}>
                <Text style={styles.sectionTitle}>🎯 Nutri-Score</Text>
                <LinearGradient
                  colors={
                    productData.nutrition_grades === 'a' ? ['#038141', '#03A550'] :
                    productData.nutrition_grades === 'b' ? ['#85BB2F', '#94C83D'] :
                    productData.nutrition_grades === 'c' ? ['#FECB02', '#FFD617'] :
                    productData.nutrition_grades === 'd' ? ['#EE8100', '#F39200'] :
                    ['#E63E11', '#ED5922']
                  }
                  style={additionalStyles.nutriScoreBadge}
                >
                  <Text style={additionalStyles.nutriScoreText}>
                    Grade {productData.nutrition_grades.toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Save/Share buttons - unchanged */}
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

      {/* ADHD Alert Modal - unchanged */}
      <AdhdAlertModal
        visible={showAdhdAlert}
        onClose={() => setShowAdhdAlert(false)}
        onUpgrade={handleUpgradeFromAdhdAlert}
        adhdAdditives={adhdAdditives}
        isPremium={isPremium}
      />
    </SafeAreaView>
  );
};

// ===== STYLES WITH NEW ALTERNATIVES SECTION =====
const additionalStyles = StyleSheet.create({

  // ===== Scanned Product Recall Alert Styles =====
  scannedRecallBanner: {
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    marginVertical: 12,
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  scannedRecallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scannedRecallIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  scannedRecallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scannedRecallSubtitle: {
    fontSize: 13,
    color: '#FCA5A5',
    marginTop: 2,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  scannedRecallContent: {
    backgroundColor: '#991B1B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  scannedRecallReason: {
    fontSize: 14,
    color: '#FEE2E2',
    lineHeight: 20,
    marginBottom: 6,
  },
  scannedRecallDate: {
    fontSize: 12,
    color: '#FCA5A5',
    fontStyle: 'italic',
  },
  scannedRecallAction: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  scannedRecallActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  viewRecallButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  viewRecallButtonText: {
    color: '#7F1D1D',
    fontSize: 14,
    fontWeight: '700',
  },

  // ===== Allergen Styles =====
  allergenAlertBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  allergenIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  allergenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  allergenDescription: {
    fontSize: 15,
    color: '#991B1B',
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 20,
  },
  profileAllergenSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  allergenItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 8,
  },
  severityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  allergenItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  allergenItemSource: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  hiddenAllergenSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  hiddenAllergenTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 6,
  },
  hiddenAllergenText: {
    fontSize: 13,
    color: '#78350F',
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // ===== All Other Styles =====
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

  // ===== NEW: Healthy Alternatives Styles =====
  alternativesSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
  },
  alternativesSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 12,
  },
  alternativeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  alternativeBrand: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  alternativeGrade: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  alternativeGradeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  advantagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  advantageChip: {
    backgroundColor: '#D1FAE5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  advantageText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: '#667EEA',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },

  // ===== Rest of styles =====
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