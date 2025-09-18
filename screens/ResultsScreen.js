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

  const userAllergenWarnings = ProductService.checkUserAllergens(
    currentProduct.rawData || currentProduct,
    userSettings.activeFilters
  );

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
                {currentProduct.image && !currentProduct.image.includes('PHN2Z') ? (
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
                <Text style={styles.productName}>{currentProduct.name}</Text>
                <Text style={styles.productBrand}>
                  {currentProduct.brand} • {currentProduct.categories || 'Food Product'}
                </Text>
              </View>

              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(currentProduct.healthScore?.score || 0) }]}>
                  <Text style={styles.statusBadgeText}>
                    {currentProduct.healthScore?.status || 'Unknown Status'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Allergen Alert */}
            {userAllergenWarnings && userAllergenWarnings.length > 0 && (
              <View style={styles.allergenAlertBox}>
                <View style={styles.allergenHeader}>
                  <Text style={styles.allergenIcon}>⚠️</Text>
                  <Text style={styles.allergenTitle}>Allergen Alert</Text>
                </View>
                <Text style={styles.allergenDescription}>
                  This product contains ingredients you've marked to avoid in your profile settings.
                </Text>
                {userAllergenWarnings.map((warning, index) => (
                  <Text key={index} style={styles.allergenItem}>
                    • {warning.title.replace('⚠️ ', '')}
                  </Text>
                ))}
              </View>
            )}

            {/* Positive Aspects - MOVED UP */}
            {currentProduct.positiveAttributes && currentProduct.positiveAttributes.length > 0 && (
              <View style={styles.positiveSection}>
                <Text style={styles.sectionTitle}>✅ Positive Aspects</Text>
                {currentProduct.positiveAttributes.map((attribute, index) => (
                  <View key={index} style={styles.positiveItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.positiveText}>{attribute}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Health Warnings */}
            {currentProduct.healthScore?.warnings && currentProduct.healthScore.warnings.length > 0 && (
              <View style={styles.warningsContainer}>
                <Text style={styles.warningsTitle}>Health Warnings</Text>
                {currentProduct.healthScore.warnings.map((warning, index) => (
                  <View
                    key={index}
                    style={[
                      styles.warningCard,
                      {
                        backgroundColor:
                          warning.severity === 'critical' ? '#FEE2E2' :
                          warning.severity === 'high' ? '#FED7AA' :
                          warning.severity === 'medium' ? '#FEF3C7' :
                          '#E0E7FF'
                      }
                    ]}
                  >
                    <View style={styles.warningIconContainer}>
                      <Text style={styles.warningIcon}>⚠️</Text>
                    </View>
                    <View style={styles.warningContent}>
                      <Text style={styles.warningTitle}>{warning.title}</Text>
                      <Text style={styles.warningDesc}>{warning.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Critical Additives */}
            {currentProduct.criticalAdditives && currentProduct.criticalAdditives.length > 0 && (
              <View style={styles.concernsSection}>
                <Text style={styles.sectionTitle}>❌ Critical Additives</Text>
                {currentProduct.criticalAdditives.map((additive, index) => (
                  <View key={index} style={styles.concernCard}>
                    <View style={styles.concernNumberBadge}>
                      <Text style={styles.concernNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.concernContent}>
                      <Text style={styles.concernName}>{additive.name}</Text>
                      <Text style={styles.concernDescription}>{additive.healthImpact}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Additives Found - RENAMED from Additional Concerns */}
            {currentProduct.concerningAdditives && currentProduct.concerningAdditives.length > 0 && (
              <View style={styles.concernsSection}>
                <Text style={styles.sectionTitle}>🧪 Additives Found</Text>
                {currentProduct.concerningAdditives.map((additive, index) => (
                  <View key={index} style={[styles.concernCard, { backgroundColor: '#FEF3C7' }]}>
                    <View style={[styles.concernNumberBadge, { backgroundColor: '#F97316' }]}>
                      <Text style={styles.concernNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.concernContent}>
                      <Text style={styles.concernName}>{additive.name}</Text>
                      <Text style={styles.concernDescription}>{additive.healthImpact}</Text>
                    </View>
                  </View>
                ))}
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
                onPress={() => Alert.alert('Share', 'Sharing feature coming soon!')}
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

export default ResultsScreen;