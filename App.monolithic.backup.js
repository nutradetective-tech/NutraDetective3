import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  FlatList,
  StatusBar,
  Dimensions,
  Animated,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SimpleScanner from './components/SimpleScanner';
import ProductService from './services/ProductService';
import EnhancedManualScanner from './components/EnhancedManualScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraScanner from './components/CameraScanner';
import ScannerSelector from './components/ScannerSelector';
import UserSettingsService from './services/UserSettingsService';

const { width, height } = Dimensions.get('window');

// Responsive helpers
const isTablet = width >= 768;
const isDesktop = width >= 1024;

const getResponsiveSize = (mobile, tablet, desktop) => {
  if (isDesktop && desktop !== undefined) return desktop;
  if (isTablet && tablet !== undefined) return tablet;
  return mobile;
};

// Default settings
const DEFAULT_SETTINGS = {
  userName: 'User',
  profileInitials: 'U',
  activeFilters: ['gluten-free', 'no-dyes', 'tree-nuts'],
  scanGoal: 5,
  dashboardStats: ['totalScans', 'healthyPercent', 'streak'],
  theme: 'light',
  notifications: true,
};

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [scanHistory, setScanHistory] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [scanMethod, setScanMethod] = useState(null);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [showScanSelector, setShowScanSelector] = useState(false);
  
  // User settings states
  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);
  const [showNameEditModal, setShowNameEditModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempGoal, setTempGoal] = useState(5);
  const [tempStats, setTempStats] = useState(['totalScans', 'healthyPercent', 'streak']);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const splashFadeAnim = useRef(new Animated.Value(0)).current;

  // Load history and settings when app starts
  useEffect(() => {
    // Fade in splash screen
    Animated.timing(splashFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Hide splash after 2 seconds
    setTimeout(() => {
      Animated.timing(splashFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 2000);
    
    loadUserSettings();
    loadHistory();
    startPulseAnimation();
    fadeIn();
  }, []);

  // Load user settings
  const loadUserSettings = async () => {
    const settings = await UserSettingsService.getSettings();
    setUserSettings(settings);
    setTempName(settings.userName);
    setTempGoal(settings.scanGoal);
    setTempStats(settings.dashboardStats);
  };

  // Pulse animation for scan button
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Fade in animation
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Load scan history from storage
  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('scanHistory');
      if (historyData) {
        const history = JSON.parse(historyData);
        setScanHistory(history);
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  // Save scan to history
  const saveToHistory = async (product) => {
    try {
      const scanRecord = {
        id: Date.now().toString(),
        name: product.name,
        brand: product.brand,
        grade: product.healthScore?.grade || '?',
        score: product.healthScore?.score || 0,
        date: new Date().toISOString(),
        barcode: product.barcode || '',
      };

      const updatedHistory = [scanRecord, ...scanHistory].slice(0, 50);
      setScanHistory(updatedHistory);
      
      await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Error saving to history:', error);
    }
  };

  // Get grade color
  const getGradeColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    if (score >= 50) return '#F97316';
    return '#EF4444';
  };

  // Get gradient colors for grade
  const getGradeGradient = (score) => {
    if (score >= 90) return ['#10B981', '#059669'];
    if (score >= 70) return ['#F59E0B', '#D97706'];
    if (score >= 50) return ['#F97316', '#EA580C'];
    return ['#EF4444', '#DC2626'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get today's scan count
  const getTodayScans = () => {
    const today = new Date().toDateString();
    return scanHistory.filter(item => {
      const scanDate = new Date(item.date).toDateString();
      return scanDate === today;
    }).length;
  };

  // Get average grade
  const getAverageGrade = () => {
    if (scanHistory.length === 0) return 'N/A';
    const avgScore = scanHistory.reduce((acc, item) => acc + item.score, 0) / scanHistory.length;
    if (avgScore >= 90) return 'A';
    if (avgScore >= 80) return 'A-';
    if (avgScore >= 75) return 'B+';
    if (avgScore >= 70) return 'B';
    if (avgScore >= 65) return 'B-';
    if (avgScore >= 60) return 'C+';
    if (avgScore >= 55) return 'C';
    if (avgScore >= 50) return 'C-';
    if (avgScore >= 45) return 'D+';
    if (avgScore >= 40) return 'D';
    if (avgScore >= 30) return 'D-';
    return 'F';
  };

  const handleBarcodeScan = (result) => {
  const barcode = result.data || result;
  
  // Close modal immediately
  setIsScanning(false);
  setScanMethod(null);
  setShowCameraScanner(false);
  console.log('Starting product fetch');
  // Process after modal closes
  setTimeout(async () => {
    setIsLoading(true);
    
    try {
      const product = await ProductService.fetchProductByBarcode(barcode);
      
      if (product) {
        // Check for user's allergens
        if (userSettings.activeFilters && userSettings.activeFilters.length > 0) {
          const allergenWarnings = ProductService.checkUserAllergens(product, userSettings.activeFilters);
          if (allergenWarnings.length > 0) {
            product.healthScore.warnings = [
              ...allergenWarnings,
              ...(product.healthScore.warnings || [])
            ];
          }
        }
        
        product.barcode = barcode;
        setCurrentProduct(product);
        setShowResult(true);
        await saveToHistory(product);
      } else {
        Alert.alert(
          'Product Not Found',
          'This product is not in our database yet. Try another product.',
          [
            { text: 'Try Again', onPress: () => {
              setScanMethod('manual');
              setIsScanning(true);
            }},
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product data');
    } finally {
      setIsLoading(false);
    }
  }, 100);
};

  const handleHistoryItemPress = async (item) => {
  setActiveTab('home');
  setIsLoading(true);
  
  // Process after delay to show loading screen
  setTimeout(async () => {
    try {
      const product = await ProductService.fetchProductByBarcode(item.barcode);
      
      if (product) {
        product.barcode = item.barcode;
        setCurrentProduct(product);
        setShowResult(true);
        // NOT calling saveToHistory - it's already in history!
      } else {
        Alert.alert('Error', 'Could not load product details');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product data');
    } finally {
      setIsLoading(false);
    }
  }, 100);
};

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setScanHistory([]);
            await AsyncStorage.removeItem('scanHistory');
            Alert.alert('Success', 'History cleared');
          }
        }
      ]
    );
  };

  const calculateStreak = () => {
    if (scanHistory.length === 0) return 0;
    let streak = 1;
    const today = new Date().toDateString();
    const latestScan = new Date(scanHistory[0].date).toDateString();
    if (latestScan !== today) return 0;
    return streak;
  };

  // Responsive container wrapper
  const ResponsiveContainer = ({ children, style }) => {
    return (
      <View style={[
        styles.responsiveContainer,
        isTablet && styles.tabletContainer,
        isDesktop && styles.desktopContainer,
        style
      ]}>
        {children}
      </View>
    );
  };

  // Name Edit Modal Component
  const NameEditModal = () => (
    <Modal 
      visible={showNameEditModal} 
      transparent 
      animationType="slide"
      onRequestClose={() => setShowNameEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Display Name</Text>
          <TextInput
            style={styles.modalInput}
            value={tempName}
            onChangeText={setTempName}
            placeholder="Enter your name"
            maxLength={20}
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => {
                setTempName(userSettings.userName);
                setShowNameEditModal(false);
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={async () => {
                await UserSettingsService.updateUserName(tempName);
                const newSettings = await UserSettingsService.getSettings();
                setUserSettings(newSettings);
                setShowNameEditModal(false);
              }}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.modalGradientButton}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Goal Edit Modal
  const GoalEditModal = () => (
    <Modal 
      visible={showGoalModal} 
      transparent 
      animationType="slide"
      onRequestClose={() => setShowGoalModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Daily Scan Goal</Text>
          <View style={styles.goalSelector}>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => setTempGoal(Math.max(1, tempGoal - 1))}
            >
              <Text style={styles.goalButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.goalValue}>{tempGoal}</Text>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => setTempGoal(Math.min(50, tempGoal + 1))}
            >
              <Text style={styles.goalButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.goalHint}>Set a daily target for scanning products</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => {
                setTempGoal(userSettings.scanGoal);
                setShowGoalModal(false);
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={async () => {
                await UserSettingsService.updateScanGoal(tempGoal);
                const newSettings = await UserSettingsService.getSettings();
                setUserSettings(newSettings);
                setShowGoalModal(false);
              }}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.modalGradientButton}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Stats Selector Modal
  const StatsSelectorModal = () => {
    const availableStats = [
      { id: 'totalScans', name: 'Total Scans', icon: '📊' },
      { id: 'healthyPercent', name: 'Healthy %', icon: '✅' },
      { id: 'streak', name: 'Day Streak', icon: '🔥' },
      { id: 'dailyGoal', name: 'Daily Goal', icon: '🎯' },
      { id: 'avgGrade', name: 'Avg Grade', icon: '📈' },
    ];

    const toggleStat = (statId) => {
      if (tempStats.includes(statId)) {
        if (tempStats.length > 1) {
          setTempStats(tempStats.filter(id => id !== statId));
        }
      } else {
        if (tempStats.length < 3) {
          setTempStats([...tempStats, statId]);
        }
      }
    };

    return (
      <Modal 
        visible={showStatsModal} 
        transparent 
        animationType="slide"
        onRequestClose={() => setShowStatsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dashboard Stats</Text>
            <Text style={styles.modalSubtitle}>Choose 3 stats to display</Text>
            {availableStats.map(stat => (
              <TouchableOpacity
                key={stat.id}
                style={[
                  styles.statOption,
                  tempStats.includes(stat.id) && styles.statOptionActive
                ]}
                onPress={() => toggleStat(stat.id)}
              >
                <Text style={styles.statOptionIcon}>{stat.icon}</Text>
                <Text style={[
                  styles.statOptionText,
                  tempStats.includes(stat.id) && styles.statOptionTextActive
                ]}>
                  {stat.name}
                </Text>
                {tempStats.includes(stat.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => {
                  setTempStats(userSettings.dashboardStats);
                  setShowStatsModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={async () => {
                  await UserSettingsService.updateDashboardStats(tempStats);
                  const newSettings = await UserSettingsService.getSettings();
                  setUserSettings(newSettings);
                  setShowStatsModal(false);
                }}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.modalGradientButton}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // SPLASH SCREEN
  if (showSplash) {
    return (
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.splashContainer}
      >
        <Animated.View style={[styles.splashContent, { opacity: splashFadeAnim }]}>
          <View style={styles.splashLogoContainer}>
            <View style={styles.splashIconWrapper}>
              <Text style={styles.splashIcon}>🔍</Text>
            </View>
          </View>
          <Text style={styles.splashTitle}>NutraDetective</Text>
          <Text style={styles.splashTagline}>Uncover What's Really in Your Food</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  // LOADING SCREEN
  if (isLoading) {
    return (
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <Text style={styles.loadingIcon}>🔍</Text>
          </View>
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingTextWhite}>Analyzing product...</Text>
        </View>
      </LinearGradient>
    );
  }

  // RESULTS SCREEN
  if (showResult && currentProduct) {
    return (
      <SafeAreaView style={styles.container}>
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
              {/* Grade Circle with Gradient */}
              <LinearGradient
                colors={getGradeGradient(currentProduct?.healthScore?.score || 0)}
                style={styles.gradeCircle}
              >
                <Text style={styles.gradeText}>
                  {currentProduct.healthScore?.grade || '?'}
                </Text>
              </LinearGradient>

              
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


              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{currentProduct.name}</Text>
                <Text style={styles.productBrand}>
                  {currentProduct.brand} • {currentProduct.category || 'Food Product'}
                </Text>
              </View>

              {/* Status Badge with Gradient Background */}
              <View style={styles.statusContainer}>
                <LinearGradient
                  colors={
                    currentProduct.healthScore?.score >= 70 
                      ? ['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']
                      : currentProduct.healthScore?.score >= 50
                      ? ['rgba(245, 158, 11, 0.1)', 'rgba(217, 119, 6, 0.1)']
                      : ['rgba(239, 68, 68, 0.1)', 'rgba(220, 38, 38, 0.1)']
                  }
                  style={styles.statusBadge}
                >
                  <Text style={styles.statusIcon}>
                    {currentProduct.healthScore?.score >= 70 ? '✓' : '⚠️'}
                  </Text>
                  <Text style={[
                    styles.statusText,
                    { color: getGradeColor(currentProduct.healthScore?.score || 0) }
                  ]}>
                    {currentProduct.healthScore?.status || 'Unknown Status'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Warnings Section with Glass Effect */}
              {currentProduct.healthScore?.warnings?.length > 0 && (
                <View style={styles.warningsContainer}>
                  <Text style={styles.warningsTitle}>Health Warnings</Text>
                  {currentProduct.healthScore.warnings.map((warning, i) => (
                    <View key={i} style={[styles.warningCard, styles.glassEffect]}>
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

              {/* Score Display */}
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Health Score</Text>
                <Text style={styles.scoreValue}>
                  {currentProduct.healthScore?.score || 0}/100
                </Text>
              </View>

              {/* Nutrition Facts */}
              {currentProduct.nutrition && (
                <View style={styles.nutritionContainer}>
                  <Text style={styles.sectionTitle}>Nutrition Facts (per 100g)</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Calories</Text>
                      <Text style={styles.nutritionValue}>{currentProduct.nutrition?.calories || 0}</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Sugar</Text>
                      <Text style={styles.nutritionValue}>{currentProduct.nutrition?.sugar || 0}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Sat. Fat</Text>
                      <Text style={styles.nutritionValue}>{currentProduct.nutrition?.saturatedFat || 0}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Sodium</Text>
                      <Text style={styles.nutritionValue}>{currentProduct.nutrition?.sodium || 0}mg</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                      <Text style={styles.nutritionValue}>{currentProduct.nutrition?.protein || 0}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Fiber</Text>
                      <Text style={styles.nutritionValue}>{currentProduct.nutrition?.fiber || 0}g</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Ingredients */}
              {currentProduct.ingredients && (
                <View style={styles.ingredientsContainer}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  <Text style={styles.ingredientsText}>{currentProduct.ingredients}</Text>
                </View>
              )}

              {/* Allergens */}
              {currentProduct.allergens?.length > 0 && (
                <View style={styles.allergensContainer}>
                  <Text style={styles.sectionTitle}>Allergens</Text>
                  <View style={styles.allergensList}>
                    {currentProduct.allergens.map((allergen, i) => (
                      <View key={i} style={styles.allergenTag}>
                        <Text style={styles.allergenText}>{allergen.replace('en:', '')}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Additives */}
              {currentProduct.additives?.length > 0 && (
                <View style={styles.additivesContainer}>
                  <Text style={styles.sectionTitle}>Additives</Text>
                  {currentProduct.criticalAdditives?.length > 0 && (
                    <View style={styles.additiveGroup}>
                      <Text style={styles.additiveGroupTitle}>Critical</Text>
                      {currentProduct.criticalAdditives.map((add, i) => (
                        <Text key={i} style={styles.criticalAdditive}>{add}</Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
              {/* Action Buttons with Gradients */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setShowResult(false);
                    setCurrentProduct(null);
                    setShowScanSelector(true);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>📷 Scan Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButtonWrapper}
                  onPress={() => {
                    Alert.alert('Share', 'Sharing feature coming soon!');
                  }}
                >
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    style={styles.primaryGradientButton}
                  >
                    <Text style={styles.primaryButtonText}>📤 Share</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </ResponsiveContainer>
      </SafeAreaView>
    );
  }

  // HISTORY TAB
  if (activeTab === 'history') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <ResponsiveContainer>
          <LinearGradient
            colors={['#FFFFFF', '#F7F8FA']}
            style={styles.gradientHeader}
          >
            <Text style={styles.headerTitleCenter}>Scan History</Text>
            {scanHistory.length > 0 && (
              <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          {scanHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No scans yet</Text>
              <Text style={styles.emptySubtext}>Your scan history will appear here</Text>
            </View>
          ) : (
            <FlatList
              data={scanHistory}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.historyList}
              numColumns={isTablet ? 2 : 1}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.historyItem,
                    styles.cardShadow,
                    isTablet && styles.historyItemTablet
                  ]}
                  onPress={() => handleHistoryItemPress(item)}
                >
                  <LinearGradient
                    colors={getGradeGradient(item.score)}
                    style={styles.historyGradeBadge}
                  >
                    <Text style={styles.historyGradeText}>{item.grade}</Text>
                  </LinearGradient>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.historyTime}>{formatDate(item.date)}</Text>
                  </View>
                  <Text style={styles.historyArrow}>→</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Bottom Navigation with Gradient Active State */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('home')}
            >
              <Text style={styles.navIcon}>🏠</Text>
              <Text style={styles.navLabel}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navItem, styles.navItemActive]}
              onPress={() => setActiveTab('history')}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.navActiveIndicator}
              />
              <Text style={[styles.navIcon, styles.navIconActive]}>📊</Text>
              <Text style={[styles.navLabel, styles.navLabelActive]}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('profile')}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={styles.navLabel}>Profile</Text>
            </TouchableOpacity>
          </View>
        </ResponsiveContainer>
      </SafeAreaView>
    );
  }

  // PROFILE TAB
  if (activeTab === 'profile') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <ResponsiveContainer>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            style={styles.profileHeader}
          >
            <Text style={styles.profileHeaderTitle}>Profile</Text>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.profileAvatarLarge}
            >
              <Text style={styles.profileAvatarIcon}>{userSettings.profileInitials}</Text>
            </LinearGradient>
            <Text style={styles.profileNameWhite}>{userSettings.userName}</Text>
            <TouchableOpacity 
              onPress={() => setShowNameEditModal(true)}
              style={styles.editNameButton}
            >
              <Text style={styles.editNameText}>✏️ Edit Name</Text>
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.profileContent}>
            <View style={[styles.profileStats, styles.cardShadow]}>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{scanHistory.length}</Text>
                <Text style={styles.profileStatLabel}>Total Scans</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>
                  {Math.round((scanHistory.filter(item => item.score >= 70).length / (scanHistory.length || 1)) * 100)}%
                </Text>
                <Text style={styles.profileStatLabel}>Healthy</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{calculateStreak()}</Text>
                <Text style={styles.profileStatLabel}>Day Streak</Text>
              </View>
            </View>

            {/* Settings Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Personalization</Text>
              
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setShowGoalModal(true)}
              >
                <View style={styles.settingLeft}>
                  <Text style={styles.settingIcon}>🎯</Text>
                  <Text style={styles.settingLabel}>Daily Scan Goal</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={styles.settingValue}>{userSettings.scanGoal} scans</Text>
                  <Text style={styles.settingArrow}>→</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => setShowStatsModal(true)}
              >
                <View style={styles.settingLeft}>
                  <Text style={styles.settingIcon}>📊</Text>
                  <Text style={styles.settingLabel}>Dashboard Stats</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={styles.settingValue}>{userSettings.dashboardStats.length} active</Text>
                  <Text style={styles.settingArrow}>→</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.premiumButtonWrapper}>
              <LinearGradient
                colors={['#FBBF24', '#F59E0B']}
                style={styles.premiumButton}
              >
                <Text style={styles.premiumIcon}>👑</Text>
                <View style={styles.premiumInfo}>
                  <Text style={styles.premiumTitle}>Go Premium</Text>
                  <Text style={styles.premiumSubtitle}>Unlimited scans, no ads</Text>
                </View>
                <Text style={styles.premiumArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('home')}
            >
              <Text style={styles.navIcon}>🏠</Text>
              <Text style={styles.navLabel}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => setActiveTab('history')}
            >
              <Text style={styles.navIcon}>📊</Text>
              <Text style={styles.navLabel}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navItem, styles.navItemActive]}
              onPress={() => setActiveTab('profile')}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.navActiveIndicator}
              />
              <Text style={[styles.navIcon, styles.navIconActive]}>👤</Text>
              <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Modals */}
          <NameEditModal />
          <GoalEditModal />
          <StatsSelectorModal />
        </ResponsiveContainer>
      </SafeAreaView>
    );
  }

  // HOME SCREEN (Main)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ResponsiveContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header Section with Logo */}
            <View style={[styles.homeHeader, styles.cardShadow]}>
              <View style={styles.headerLeft}>
                {/* Logo Header */}
                <View style={styles.logoHeader}>
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    style={styles.logoIconContainer}
                  >
                    <Text style={styles.logoIcon}>🔍</Text>
                  </LinearGradient>
                  <Text style={styles.logoText}>
                    <Text style={styles.logoNutra}>Nutra</Text>
                    <Text style={styles.logoDetective}>Detective</Text>
                  </Text>
                </View>
                
                {/* Greeting */}
                <View style={styles.greetingContainer}>
                  <Text style={[
                    styles.greeting,
                    { fontSize: getResponsiveSize(20, 24, 28) }
                  ]}>
                    {getGreeting()}, {userSettings.userName}
                  </Text>
                  <Text style={styles.subGreeting}>Ready to scan healthier?</Text>
                </View>
              </View>
              
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.profileCircle}
              >
                <Text style={styles.profileCircleText}>{userSettings.profileInitials}</Text>
              </LinearGradient>
            </View>

            {/* Dynamic Stats Grid */}
            <View style={[
              styles.statsGrid,
              isTablet && styles.statsGridTablet
            ]}>
              {userSettings.dashboardStats.map((statType) => {
                let statValue, statLabel, statColor;
                
                switch(statType) {
                  case 'totalScans':
                    statValue = scanHistory.length;
                    statLabel = 'Products\nScanned';
                    statColor = '#667EEA';
                    break;
                  case 'healthyPercent':
                    statValue = `${Math.round((scanHistory.filter(item => item.score >= 70).length / (scanHistory.length || 1)) * 100)}%`;
                    statLabel = 'Healthy\nChoices';
                    statColor = '#10B981';
                    break;
                  case 'streak':
                    statValue = calculateStreak();
                    statLabel = 'Streak\nDays';
                    statColor = '#F59E0B';
                    break;
                  case 'dailyGoal':
                    const todayScans = getTodayScans();
                    statValue = `${todayScans}/${userSettings.scanGoal}`;
                    statLabel = 'Daily\nGoal';
                    statColor = todayScans >= userSettings.scanGoal ? '#10B981' : '#8B5CF6';
                    break;
                  case 'avgGrade':
                    statValue = getAverageGrade();
                    statLabel = 'Average\nGrade';
                    const avgScore = scanHistory.reduce((acc, item) => acc + item.score, 0) / (scanHistory.length || 1);
                    statColor = getGradeColor(avgScore);
                    break;
                  default:
                    return null;
                }
                
                return (
                  <View key={statType} style={[styles.statCard, styles.cardShadow]}>
                    <Text style={[
                      styles.statValue,
                      { fontSize: getResponsiveSize(24, 28, 32), color: statColor }
                    ]}>
                      {statValue}
                    </Text>
                    <Text style={styles.statLabel}>{statLabel}</Text>
                  </View>
                );
              })}
            </View>

            {/* Main Scan Button with Gradient and Pulse */}
            <TouchableOpacity
              style={styles.scanButtonWrapper}
              onPress={() => setShowScanSelector(true)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.scanButtonAnimated,
                  {
                    transform: [{ scale: pulseAnim }]
                  }
                ]}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={[
                    styles.scanButton,
                    { 
                      width: getResponsiveSize(140, 160, 180),
                      height: getResponsiveSize(140, 160, 180)
                    }
                  ]}
                >
                  <Text style={[
                    styles.scanButtonIcon,
                    { fontSize: getResponsiveSize(48, 56, 64) }
                  ]}>
                    📷
                  </Text>
                  <Text style={[
                    styles.scanButtonText,
                    { fontSize: getResponsiveSize(16, 18, 20) }
                  ]}>
                    SCAN
                  </Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            {/* Recent Scans Section with Cards */}
            {scanHistory.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.recentTitle}>Recent Scans</Text>
                <View style={isTablet && styles.recentGridTablet}>
                  {scanHistory.slice(0, isTablet ? 6 : 3).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.recentCard,
                        styles.cardShadow,
                        isTablet && styles.recentCardTablet
                      ]}
                      onPress={() => handleHistoryItemPress(item)}
                    >
                      <View style={styles.recentLeft}>
                        <LinearGradient
                          colors={getGradeGradient(item.score)}
                          style={styles.recentGradeBadge}
                        >
                          <Text style={styles.recentGradeText}>{item.grade}</Text>
                        </LinearGradient>
                        <View>
                          <Text style={styles.recentName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.recentTime}>{formatDate(item.date)}</Text>
                        </View>
                      </View>
                      <Text style={styles.recentArrow}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Ad Banner Placeholder */}
            <View style={styles.adBanner}>
              <Text style={styles.adText}>AdMob Banner (320x50)</Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Navigation with Gradient Active Indicator */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, styles.navItemActive]}
            onPress={() => setActiveTab('home')}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.navActiveIndicator}
            />
            <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('history')}
          >
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ResponsiveContainer>

      {/* Camera Scanner Modal */}
{isScanning && scanMethod === 'camera' ? (
  <Modal visible={true} animationType="slide">
    <CameraScanner
      onScanResult={(result) => {
        handleBarcodeScan(result);
      }}
      onClose={() => {
        setIsScanning(false);
        setScanMethod(null);
      }}
    />
  </Modal>
) : null}

      {/* Manual Scanner Modal */}
      {isScanning && scanMethod === 'manual' && (
        <Modal visible={true} animationType="slide">
          <SimpleScanner
            onScanResult={handleBarcodeScan}
            onClose={() => {
              setIsScanning(false);
              setScanMethod(null);
            }}
          />
        </Modal>
      )}

      {/* Scanner Selection Modal */}
      <ScannerSelector
        visible={showScanSelector}
        onSelectCamera={() => {
          setShowScanSelector(false);
          setScanMethod('camera');
          setIsScanning(true);
        }}
        onSelectManual={() => {
          setShowScanSelector(false);
          setScanMethod('manual');
          setIsScanning(true);
        }}
        onClose={() => setShowScanSelector(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  responsiveContainer: {
    flex: 1,
    width: '100%',
  },
  tabletContainer: {
    maxWidth: 768,
    alignSelf: 'center',
  },
  desktopContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
  },

  // Splash Screen
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogoContainer: {
    marginBottom: 30,
  },
  splashIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  splashIcon: {
    fontSize: 64,
  },
  splashTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  splashTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 40,
  },
  loadingTextWhite: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Card Shadow Effect
  cardShadow: {
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },

  // Glass Effect
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    flex: 1,
    textAlign: 'center',
  },
  gradientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitleCenter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#667EEA',
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },

  // Home Header with Logo
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: getResponsiveSize(20, 30, 40),
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flex: 1,
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  logoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
  },
  logoNutra: {
    color: '#667EEA',
  },
  logoDetective: {
    color: '#764BA2',
  },
  greetingContainer: {
    marginTop: 5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A202C',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  profileCircle: {
    width: getResponsiveSize(40, 50, 60),
    height: getResponsiveSize(40, 50, 60),
    borderRadius: getResponsiveSize(20, 25, 30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircleText: {
    color: '#FFFFFF',
    fontSize: getResponsiveSize(16, 20, 24),
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  statsGridTablet: {
    paddingHorizontal: 30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: getResponsiveSize(15, 20, 25),
    alignItems: 'center',
    width: `${100/3 - 2}%`,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667EEA',
  },
  statLabel: {
    fontSize: getResponsiveSize(10, 12, 14),
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },

  // Scan Button with Animation
  scanButtonWrapper: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  scanButtonAnimated: {
    alignSelf: 'center',
  },
  scanButton: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  scanButtonIcon: {
    marginBottom: 5,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Recent Scans
  recentSection: {
    paddingHorizontal: getResponsiveSize(15, 30, 40),
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 15,
  },
  recentGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  recentCardTablet: {
    width: '48%',
    marginHorizontal: '1%',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  recentGradeBadge: {
    width: getResponsiveSize(40, 45, 50),
    height: getResponsiveSize(40, 45, 50),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentGradeText: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recentName: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
    color: '#1A202C',
  },
  recentTime: {
    fontSize: getResponsiveSize(12, 13, 14),
    color: '#64748B',
    marginTop: 2,
  },
  recentArrow: {
    fontSize: 18,
    color: '#64748B',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  navItemActive: {},
  navActiveIndicator: {
    position: 'absolute',
    top: -1,
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  navIcon: {
    fontSize: getResponsiveSize(24, 28, 32),
    color: '#94A3B8',
    marginBottom: 4,
  },
  navIconActive: {
    color: '#667EEA',
  },
  navLabel: {
    fontSize: getResponsiveSize(10, 12, 14),
    fontWeight: '600',
    color: '#94A3B8',
  },
  navLabelActive: {
    color: '#667EEA',
  },

  // Results Screen
  resultContent: {
    padding: getResponsiveSize(15, 30, 40),
  },
  gradeCircle: {
    width: getResponsiveSize(100, 120, 140),
    height: getResponsiveSize(100, 120, 140),
    borderRadius: getResponsiveSize(50, 60, 70),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradeText: {
    fontSize: getResponsiveSize(48, 56, 64),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  productInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productName: {
    fontSize: getResponsiveSize(22, 26, 30),
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: getResponsiveSize(14, 16, 18),
    color: '#64748B',
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusText: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
  },
  warningsContainer: {
    marginBottom: 20,
  },
  warningsTitle: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 10,
  },
  warningCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    gap: 12,
  },
  warningIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 18,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  warningDesc: {
    fontSize: getResponsiveSize(12, 13, 14),
    color: '#64748B',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingVertical: 20,
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#667EEA',
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#667EEA',
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '700',
  },
  primaryButtonWrapper: {
    flex: 1,
  },
  primaryGradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '700',
  },

  // History Screen
  historyList: {
    padding: getResponsiveSize(15, 30, 40),
    paddingBottom: 100,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  historyItemTablet: {
    width: '48%',
    marginHorizontal: '1%',
  },
  historyGradeBadge: {
    width: getResponsiveSize(40, 45, 50),
    height: getResponsiveSize(40, 45, 50),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyGradeText: {
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: getResponsiveSize(14, 15, 16),
    fontWeight: '600',
    color: '#1A202C',
  },
  historyTime: {
    fontSize: getResponsiveSize(12, 13, 14),
    color: '#64748B',
    marginTop: 2,
  },
  historyArrow: {
    fontSize: 18,
    color: '#64748B',
  },

  // Profile Screen
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  profileAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatarIcon: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileNameWhite: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmailWhite: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  editNameButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  editNameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileContent: {
    flex: 1,
    marginTop: -20,
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginHorizontal: getResponsiveSize(15, 30, 40),
    marginBottom: 15,
    borderRadius: 16,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: getResponsiveSize(24, 28, 32),
    fontWeight: '700',
    color: '#667EEA',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: getResponsiveSize(12, 14, 16),
    color: '#64748B',
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  premiumButtonWrapper: {
    marginHorizontal: getResponsiveSize(15, 30, 40),
    marginTop: 10,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  premiumIcon: {
    fontSize: getResponsiveSize(32, 36, 40),
    marginRight: 15,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: getResponsiveSize(18, 20, 22),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: getResponsiveSize(14, 15, 16),
    color: '#FFFFFF',
    opacity: 0.9,
  },
  premiumArrow: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  // Settings Section
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: getResponsiveSize(15, 30, 40),
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A202C',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 10,
  },
  settingArrow: {
    fontSize: 18,
    color: '#94A3B8',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: getResponsiveSize(64, 72, 80),
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: getResponsiveSize(20, 24, 28),
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: getResponsiveSize(14, 16, 18),
    color: '#94A3B8',
  },

  // Ad Banner
  adBanner: {
    height: 50,
    backgroundColor: '#E2E8F0',
    marginHorizontal: getResponsiveSize(10, 30, 40),
    marginBottom: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 11,
    color: '#64748B',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F7F8FA',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalGradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Goal Modal Styles
  goalSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  goalButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#667EEA',
  },
  goalValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A202C',
    minWidth: 60,
    textAlign: 'center',
  },
  goalHint: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Stats Selector Styles
  statOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  statOptionActive: {
    borderColor: '#667EEA',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  statOptionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  statOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  statOptionTextActive: {
    color: '#667EEA',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#667EEA',
    fontWeight: '700',
  },

  productImageContainer: {
  width: '90%',
  height: 200,
  alignSelf: 'center',
  marginVertical: 15,
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  overflow: 'hidden',
},
productImage: {
  width: '100%',
  height: '100%',
},

placeholderContainer: {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
},
placeholderIcon: {
  fontSize: 48,
  marginBottom: 8,
},
placeholderText: {
  fontSize: 14,
  color: '#6B7280',
},

});