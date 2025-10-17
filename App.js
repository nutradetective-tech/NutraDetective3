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
import FirebaseStorageService from './services/FirebaseStorageService';
import ImagePickerTest from './components/ImagePickerTest';
import PremiumService from './services/PremiumService';
import UpgradeModal from './components/modals/UpgradeModal.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/AppStyles';
import HomeScreen from './screens/HomeScreen';  // ✅ Keep this - needed
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import { LinearGradient } from 'expo-linear-gradient';
import SimpleScanner from './components/SimpleScanner';
import ProductService from './services/ProductService';
import EnhancedManualScanner from './components/EnhancedManualScanner';
import CameraScanner from './components/CameraScanner';
import ScannerSelector from './components/ScannerSelector';
import UserSettingsService from './services/UserSettingsService';
import { DEFAULT_SETTINGS, APP_CONFIG } from './constants/config';
import { getResponsiveSize, isTablet, isDesktop } from './utils/responsive';
import { formatDate, getGreeting } from './utils/formatters';
import {
  getGradeColor,
  getGradeGradient,
  getResultBackgroundColor,
  getStatusBadgeColor,
  getAverageGrade,
  getTodayScans,
  calculateStreak
} from './utils/calculations';
import NameEditModal from './components/modals/NameEditModal';
import GoalEditModal from './components/modals/GoalEditModal';
import StatsSelectorModal from './components/modals/StatsSelectorModal';

export default function App() {
  const [testMode, setTestMode] = useState(true); // Set to true to test image picker
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
  
  // Premium state
  const [isPremium, setIsPremium] = useState(false);
  const [todayScans, setTodayScans] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('general');
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const splashFadeAnim = useRef(new Animated.Value(0)).current;

  // Load history and settings when app starts
useEffect(() => {
  // ===== TEST FIREBASE STORAGE CONNECTION =====
  const testFirebase = async () => {
    console.log('🔥 Starting Firebase Storage test...');
    try {
      const isConnected = await FirebaseStorageService.testConnection();
      if (isConnected) {
        console.log('🎉 Firebase Storage is ready to use!');
      } else {
        console.error('⚠️ Firebase Storage connection failed');
      }
    } catch (error) {
      console.error('❌ Firebase test error:', error);
    }
  };
  
  testFirebase();

  // ===== END FIREBASE TEST =====

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
  
  // Load premium status
  const premiumStatus = await PremiumService.isPremium();
  setIsPremium(premiumStatus);
  
  // Load today's scan count
  const scans = await PremiumService.getTodayScans();
  setTodayScans(scans);
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

  // Load scan history from storage
  const loadHistory = async () => {
  try {
    const historyData = await AsyncStorage.getItem('scanHistory');
    if (historyData) {
      const allHistory = JSON.parse(historyData);
      // Filter history based on premium status (30 days for free, unlimited for premium)
      const filteredHistory = await PremiumService.filterHistory(allHistory);
      setScanHistory(filteredHistory);
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
      // 🔥 NEW: Cache complete product data
      fullProduct: {
        ...product,
        cachedAt: new Date().toISOString(),
        apiSource: product.source || 'Open Food Facts'
      }
    };

    const updatedHistory = [scanRecord, ...scanHistory].slice(0, 50);
    setScanHistory(updatedHistory);
    
    await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.log('Error saving to history:', error);
  }
};

  const handleBarcodeScan = async (result) => {
  const barcode = result.data || result;
  
  // Check if user can scan (premium limits)
  const scanCheck = await PremiumService.canScan();
  
  if (!scanCheck.canScan) {
    // Close scanner modal
    setIsScanning(false);
    setScanMethod(null);
    setShowCameraScanner(false);
    
    // Show upgrade modal
    setUpgradeReason('scans');
    setShowUpgradeModal(true);
    return;
  }
  
  // Close modal immediately
  setIsScanning(false);
  setScanMethod(null);
  setShowCameraScanner(false);
  console.log('Starting product fetch');
  
  // Process after modal closes
  setTimeout(async () => {
    setIsLoading(true);
    
    try {
      // Increment scan counter for free users
      if (!isPremium) {
        const newCount = await PremiumService.incrementScanCounter();
        setTodayScans(newCount);
      }
      
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
  // Check if we have cached product data
  if (item.fullProduct) {
    // Use cached data - NO API CALL! 🎉
    console.log('✅ Using cached product data - no API call needed');
    setCurrentProduct(item.fullProduct);
    setShowResult(true);
    setActiveTab('home');
  } else {
    // Legacy history items without fullProduct - need to re-fetch
    console.log('⚠️ Old history item, re-fetching from API...');
    setActiveTab('home');
    setIsLoading(true);
    
    setTimeout(async () => {
      try {
        const product = await ProductService.fetchProductByBarcode(item.barcode);
        
        if (product) {
          product.barcode = item.barcode;
          setCurrentProduct(product);
          setShowResult(true);
          // Update history with full product data for next time
          await saveToHistory(product);
        } else {
          Alert.alert('Error', 'Could not load product details');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch product data');
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }
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

  // SPLASH SCREEN
  if (showSplash) {
    return <SplashScreen splashFadeAnim={splashFadeAnim} styles={{}} />;
  }

// TEST MODE: Image Picker Test
  if (testMode) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImagePickerTest />
        <TouchableOpacity 
          style={{ 
            position: 'absolute', 
            top: 40, 
            right: 20, 
            backgroundColor: '#667EEA', 
            padding: 10, 
            borderRadius: 5 
          }}
          onPress={() => setTestMode(false)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Exit Test</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
            <Image 
  source={require('./assets/images/logo.png')}
  style={{ width: 50, height: 50, tintColor: '#FFFFFF' }}
  resizeMode="contain"
/>
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
      <ResultsScreen
        currentProduct={currentProduct}
        userSettings={userSettings}
        setShowResult={setShowResult}
        setCurrentProduct={setCurrentProduct}
        setScanMethod={setScanMethod}
        setIsScanning={setIsScanning}
        fadeAnim={fadeAnim}
        styles={styles}
      />
    );
  }

  // HISTORY TAB
  if (activeTab === 'history') {
    return (
      <HistoryScreen
        scanHistory={scanHistory}
        clearHistory={clearHistory}
        handleHistoryItemPress={handleHistoryItemPress}
        setActiveTab={setActiveTab}
        styles={styles}
      />
    );
  }

  // PROFILE TAB
  if (activeTab === 'profile') {
    return (
      <ProfileScreen
        userSettings={userSettings}
        setUserSettings={setUserSettings}
        scanHistory={scanHistory}
        showNameEditModal={showNameEditModal}
        setShowNameEditModal={setShowNameEditModal}
        showGoalModal={showGoalModal}
        setShowGoalModal={setShowGoalModal}
        showStatsModal={showStatsModal}
        setShowStatsModal={setShowStatsModal}
        tempName={tempName}
        setTempName={setTempName}
        tempGoal={tempGoal}
        setTempGoal={setTempGoal}
        tempStats={tempStats}
        setTempStats={setTempStats}
        setActiveTab={setActiveTab}
        styles={styles}
      />
    );
  }

  // HOME SCREEN (default)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HomeScreen
        userSettings={userSettings}
        scanHistory={scanHistory}
        showScanSelector={showScanSelector}
        setShowScanSelector={setShowScanSelector}
        scanMethod={scanMethod}
        setScanMethod={setScanMethod}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
        handleBarcodeScan={handleBarcodeScan}
        handleHistoryItemPress={handleHistoryItemPress}
        setActiveTab={setActiveTab}
        pulseAnim={pulseAnim}
        fadeAnim={fadeAnim}
        styles={styles}
      />
      
      {/* Upgrade Modal */}
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          Alert.alert(
            'Coming Soon!',
            'Payment integration coming soon. For now, go to Profile to toggle premium for testing.',
            [{ text: 'OK' }]
          );
        }}
        reason={upgradeReason}
      />
    </SafeAreaView>
  );
}  // This closes the App function
