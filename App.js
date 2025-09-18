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
import { styles } from './styles/AppStyles';
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import OverlayHints from './components/OverlayHints';
import TutorialScanner from './components/TutorialScanner';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_NUTELLA_DATA } from './constants/mockData';
import SimpleScanner from './components/SimpleScanner';
import ProductService from './services/ProductService';
import EnhancedManualScanner from './components/EnhancedManualScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  
  // Onboarding and tutorial states
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(null);
  const [isFirstScan, setIsFirstScan] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  const [showTutorialScanner, setShowTutorialScanner] = useState(false);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const splashFadeAnim = useRef(new Animated.Value(0)).current;

  // Handle onboarding completion
  const handleOnboardingComplete = async (mode) => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    
    if (mode === 'tutorial') {
      // Start tutorial mode with the special scanner
      setIsTutorialMode(true);
      setShowTutorialScanner(true);
    } else if (mode === 'camera') {
      // Skip tutorial, go to scanner selector
      setShowScanSelector(true);
    } else {
      // Manual entry
      setIsScanning(true);
      setScanMethod('manual');
    }
  };

  // Load history and settings when app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  // Replace your loadInitialData function (lines 106-148) with this:

const loadInitialData = async () => {
  try {
    // TEMPORARY: Force onboarding to show for testing
    await AsyncStorage.removeItem('hasCompletedOnboarding');
    setHasCompletedOnboarding(false);
    
    // Check onboarding status (this will now always be null/false)
    const onboardingComplete = await AsyncStorage.getItem('hasCompletedOnboarding');
    setHasCompletedOnboarding(onboardingComplete === 'true');
    
    // Only show splash if onboarding is complete
    if (onboardingComplete === 'true') {
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
    } else {
      setShowSplash(false); // Skip splash for new users
    }
    
    // Load user settings
    await loadUserSettings();
    
    // Load scan history
    await loadHistory();
    
    // Start animations
    startPulseAnimation();
    fadeIn();
  } catch (error) {
    console.error('Error loading initial data:', error.message);
    setHasCompletedOnboarding(false); // Default to showing onboarding on error
  }
};

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

  const handleBarcodeScan = async (result, isTutorial = false) => {
  // Tutorial mode - use mock data directly
  if (isTutorial) {
    console.log('Tutorial mode - using mock data');
    console.log('Mock data being set:', JSON.stringify(result, null, 2));
    setCurrentProduct(result); // result is already the mock product data
    setShowResult(true);
    setIsScanning(false);
    setShowTutorialScanner(false);
    setShowHints(true);
    // Don't make API call
    return;
  }
    
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
          
          // Track scan count
          const currentCount = await AsyncStorage.getItem('totalScanCount');
          const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
          await AsyncStorage.setItem('totalScanCount', newCount.toString());
          
          // Show hints for tutorial or first scan
          if (isTutorialMode || isFirstScan) {
            setShowHints(true);
            // Mark tutorial as complete if it was tutorial mode
            if (isTutorialMode) {
              await AsyncStorage.setItem('tutorialCompleted', 'true');
              setIsTutorialMode(false);
            }
            setIsFirstScan(false);
          }
          
          setShowResult(true);
          await saveToHistory(product);
        } else {
          // In tutorial mode, this shouldn't happen since we're using a known product
          if (isTutorialMode) {
            Alert.alert(
              'Tutorial Error',
              'The demo product couldn\'t be loaded. Please check your internet connection and try again.',
              [
                { 
                  text: 'Retry', 
                  onPress: () => {
                    setShowTutorialScanner(true);
                  }
                },
                { text: 'Skip Tutorial', onPress: () => setIsTutorialMode(false) }
              ]
            );
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

  // Show loading while checking onboarding status
  if (hasCompletedOnboarding === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667EEA" />
      </View>
    );
  }

  // Show onboarding for new users
  if (hasCompletedOnboarding === false) {
    console.log('About to render OnboardingScreen');
    console.log('handleOnboardingComplete exists?', typeof handleOnboardingComplete);
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // SPLASH SCREEN (only for returning users)
  if (showSplash) {
    return <SplashScreen splashFadeAnim={splashFadeAnim} styles={{}} />;
  }
// ADD THESE DEBUG LOGS
console.log('=== SCREEN DECISION LOGIC ===');
console.log('showSplash:', showSplash);
console.log('hasCompletedOnboarding:', hasCompletedOnboarding);
console.log('showTutorialScanner:', showTutorialScanner);
console.log('isLoading:', isLoading);
console.log('showResult:', showResult);
console.log('activeTab:', activeTab);
console.log('=== END LOGIC ===');

  // Tutorial Scanner Modal
if (showTutorialScanner) {
  console.log('showTutorialScanner is true, attempting to render TutorialScanner');
  console.log('TutorialScanner component exists?', typeof TutorialScanner);
  
  try {
    return (
      <TutorialScanner
        onScanResult={() => {
  console.log('TutorialScanner onScanResult called with mock data');
  handleBarcodeScan(MOCK_NUTELLA_DATA, true); // Pass mock data and tutorial flag
}}
        onClose={() => {
          console.log('TutorialScanner onClose called');
          setShowTutorialScanner(false);
          setIsTutorialMode(false);
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering TutorialScanner:', error);
    return (
      <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Error: {error.message}</Text>
      </View>
    );
  }
}

  // LOADING SCREEN
  // LOADING SCREEN
if (isLoading) {
  console.log('SHOWING LOADING SCREEN INSTEAD!');  // ADD THIS
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

  // RESULTS SCREEN with hints overlay
  if (showResult && currentProduct) {
    return (
      <View style={{ flex: 1 }}>
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
        {showHints && (
          <OverlayHints
            currentScreen="results"
            onDismiss={() => setShowHints(false)}
            isTutorial={isTutorialMode}
          />
        )}
      </View>
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
    </SafeAreaView>
  );
}