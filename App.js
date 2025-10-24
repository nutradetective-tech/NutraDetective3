import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  StatusBar,
  Dimensions,
  Animated,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import RecallFeedScreen from './screens/RecallFeedScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ImagePickerTest from './components/ImagePickerTest';
import PremiumService from './services/PremiumService';
import RevenueCatService from './services/RevenueCatService';
import UpgradeModal from './components/modals/UpgradeModal.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/AppStyles';
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
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

// ===== ONBOARDING IMPORTS =====
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import NameInputScreen from './screens/onboarding/NameInputScreen';
import ModeSelectionScreen from './screens/onboarding/ModeSelectionScreen';
import AccountLoginScreen from './screens/onboarding/AccountLoginScreen';
import OnboardingService from './services/OnboardingService';
import { ONBOARDING_STEPS } from './constants/onboarding';

// ===== SUPABASE AUTH IMPORTS =====
import { supabase } from './config/supabase';

export default function App() {
  // ===== AUTH STATE =====
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ===== ONBOARDING STATE =====
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(ONBOARDING_STEPS.WELCOME);

  // ===== EXISTING STATE =====
  const [testMode, setTestMode] = useState(false);
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

  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);
  const [showNameEditModal, setShowNameEditModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempGoal, setTempGoal] = useState(5);
  const [tempStats, setTempStats] = useState(['totalScans', 'healthyPercent', 'streak']);

  const [isPremium, setIsPremium] = useState(false);
  const [todayScans, setTodayScans] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('general');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const splashFadeAnim = useRef(new Animated.Value(0)).current;

// ===== SUPABASE AUTH STATE LISTENER =====
  // 🔥 TEMPORARILY DISABLED FOR RAPID DEV TESTING
  useEffect(() => {
    console.log('🔥 DEV MODE: Auth bypassed, auto-logged in');
    // Force logged-in state for testing
    setUser({ 
      id: 'dev-user-123',
      email: 'dev@test.com' 
    });
    setAuthLoading(false);
  }, []);

  /* COMMENTED OUT FOR DEV MODE - RESTORE BEFORE PRODUCTION BUILD
  useEffect(() => {
    console.log('🔷 Setting up Supabase Auth listener...');

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log('✅ Existing session found!');
        console.log('👤 User ID:', session.user.id);
        console.log('📧 Email:', session.user.email);
        setUser(session.user);
      } else {
        console.log('❌ No active session');
        setUser(null);
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log('✅ User signed in!');
        console.log('👤 User ID:', session.user.id);
        console.log('📧 Email:', session.user.email);
        setUser(session.user);
      } else {
        console.log('❌ User signed out');
        setUser(null);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);
  */

  // ===== CHECK ONBOARDING STATUS =====
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      console.log('🔍 Checking onboarding status...');
      
      const completed = await OnboardingService.hasCompletedOnboarding();
      
      if (completed) {
        console.log('✅ Onboarding already completed');
        setOnboardingCompleted(true);
        
        // Load onboarding state to get current step
        const state = await OnboardingService.getOnboardingState();
        setCurrentOnboardingStep(state.currentStep || ONBOARDING_STEPS.WELCOME);
      } else {
        console.log('⚠️ Onboarding not completed - will show onboarding flow');
        setOnboardingCompleted(false);
        setCurrentOnboardingStep(ONBOARDING_STEPS.WELCOME);
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      // On error, assume onboarding not completed
      setOnboardingCompleted(false);
    } finally {
      setOnboardingLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    console.log('🎉 Onboarding completed!');
    setOnboardingCompleted(true);
    
    // Reload user settings to get the name and mode from onboarding
    const settings = await UserSettingsService.getSettings();
    setUserSettings(settings);
    setTempName(settings.userName);
    
    console.log('✅ User settings loaded:', settings);
  };

// ===== APP INITIALIZATION WITH REVENUECAT =====
useEffect(() => {
    // Initialize RevenueCat first
    const initializeRevenueCat = async () => {
      try {
        await RevenueCatService.initialize(user?.id);
        console.log('✅ RevenueCat ready');
      } catch (error) {
        console.error('❌ RevenueCat initialization failed:', error);
      }
    };

    initializeRevenueCat();

    // 🚀 PRE-LOAD RECALL FEED ON APP STARTUP
    const preloadRecalls = async () => {
  if (recallsPreloaded) {
    console.log('⏭️  Recalls already pre-loaded, skipping...');
    return;
  }
  
  try {
    setRecallsPreloaded(true); // Set flag immediately
    console.log('');
    console.log('🚀 ═══════════════════════════════════════════════════');
    console.log('🚀 PRE-LOADING RECALL FEED ON APP STARTUP...');
    console.log('🚀 ═══════════════════════════════════════════════════');
    
    await RecallService.fetchRecallFeed();
    
    console.log('✅ Recall feed ready for Alerts tab!');
    console.log('🚀 ═══════════════════════════════════════════════════');
    console.log('');
  } catch (error) {
    console.error('⚠️  Recall pre-load failed (non-critical):', error.message);
    setRecallsPreloaded(false); // Reset on error so it can retry
  }
};

    preloadRecalls();

    // TEMPORARY: Clear product cache to see scoring logs
    const clearProductCache = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const productKeys = keys.filter(k => k.startsWith('product_cache_'));
        if (productKeys.length > 0) {
          await AsyncStorage.multiRemove(productKeys);
          console.log('🗑️ CLEARED', productKeys.length, 'CACHED PRODUCTS');
        }

        // 🔥 CLEAR ALTERNATIVES CACHE
        const altKeys = keys.filter(k => k.startsWith('alternatives_'));
        if (altKeys.length > 0) {
          await AsyncStorage.multiRemove(altKeys);
          console.log('🗑️ CLEARED', altKeys.length, 'CACHED ALTERNATIVES');
        }
      } catch (error) {
        console.log('Cache clear error:', error);
      }
    };
    clearProductCache();

    Animated.timing(splashFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

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
  }, [user]);

  const loadUserSettings = async () => {
    const settings = await UserSettingsService.getSettings();
    setUserSettings(settings);
    setTempName(settings.userName);
    setTempGoal(settings.scanGoal);
    setTempStats(settings.dashboardStats);

    const premiumStatus = await PremiumService.isPremium();
    setIsPremium(premiumStatus);

    const scans = await PremiumService.getTodayScans();
    setTodayScans(scans);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('scanHistory');
      if (savedHistory) {
        setScanHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const saveToHistory = async (product) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        name: product.product_name,
        brand: product.brands,
        grade: product.nutriscore_grade || 'unknown',
        score: product.calculatedScore || 0,
        barcode: product.barcode,
        image: product.image_url,
        scannedAt: new Date().toISOString(),
        fullProduct: product,
      };

      const updatedHistory = [newItem, ...scanHistory].slice(0, APP_CONFIG.historyLimit);
      setScanHistory(updatedHistory);
      await AsyncStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Error saving to history:', error);
    }
  };

  const handleBarcodeScan = async (barcode) => {
    setIsScanning(false);
    setIsLoading(true);
    setScanMethod(null);

    try {
      console.log('📱 Barcode scanned:', barcode);

      const product = await ProductService.fetchProductByBarcode(barcode);

      if (product) {
        product.barcode = barcode;
        setCurrentProduct(product);
        setShowResult(true);
        await saveToHistory(product);
      } else {
        Alert.alert('Product Not Found', 'No information available for this product.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Error', 'Failed to fetch product information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemPress = (item) => {
    if (item.fullProduct) {
      console.log('✅ Using cached product data - no API call needed');
      setCurrentProduct(item.fullProduct);
      setShowResult(true);
      setActiveTab('home');
    } else {
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

  // ===== SPLASH SCREEN =====
  if (showSplash) {
    return <SplashScreen splashFadeAnim={splashFadeAnim} styles={{}} />;
  }

  // ===== ONBOARDING LOADING SCREEN =====
  if (onboardingLoading) {
    return (
      <View style={authStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={authStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ===== ONBOARDING FLOW =====
  if (!onboardingCompleted) {
    // Render appropriate onboarding screen based on current step
    switch (currentOnboardingStep) {
      case ONBOARDING_STEPS.WELCOME:
        return (
          <WelcomeScreen
            onNext={() => setCurrentOnboardingStep(ONBOARDING_STEPS.NAME)}
          />
        );
      
      case ONBOARDING_STEPS.NAME:
        return (
          <NameInputScreen
            onNext={() => setCurrentOnboardingStep(ONBOARDING_STEPS.MODE)}
            onBack={() => setCurrentOnboardingStep(ONBOARDING_STEPS.WELCOME)}
          />
        );
      
      case ONBOARDING_STEPS.MODE:
        return (
          <ModeSelectionScreen
            onNext={() => setCurrentOnboardingStep(ONBOARDING_STEPS.AUTH)}
            onBack={() => setCurrentOnboardingStep(ONBOARDING_STEPS.NAME)}
          />
        );
      
      case ONBOARDING_STEPS.AUTH:
        return (
          <AccountLoginScreen
            onComplete={handleOnboardingComplete}
            onBack={() => setCurrentOnboardingStep(ONBOARDING_STEPS.MODE)}
          />
        );
      
      default:
        return (
          <WelcomeScreen
            onNext={() => setCurrentOnboardingStep(ONBOARDING_STEPS.NAME)}
          />
        );
    }
  }

  // ===== AUTH LOADING SCREEN =====
  if (authLoading) {
    return (
      <View style={authStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={authStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ===== SHOW AUTH SCREEN IF NOT LOGGED IN =====
  // 🔥 TEMPORARILY DISABLED FOR RAPID DEV TESTING
  /* COMMENTED OUT FOR DEV MODE - RESTORE BEFORE PRODUCTION BUILD
  if (!user) {
    return <AuthScreen />;
  }
  */

  // ===== REST OF APP (ONLY SHOWS WHEN LOGGED IN) =====

  if (testMode) {
    return (
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    );
  }

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
        setShowUpgradeModal={setShowUpgradeModal}
        setUpgradeReason={setUpgradeReason}
        handleBarcodeScan={handleBarcodeScan}
      />
    );
  }

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

  // ===== NEW: ALERTS TAB =====
  if (activeTab === 'alerts') {
    return <RecallFeedScreen setActiveTab={setActiveTab} />;
  }

  if (activeTab === 'profile') {
    return (
      <ProfileScreen
        user={user}
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

  return (
    <SafeAreaProvider>
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
          setShowUpgradeModal={setShowUpgradeModal}
          setUpgradeReason={setUpgradeReason}
        />

        <UpgradeModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={(selectedTier, billingPeriod) => {
            setShowUpgradeModal(false);
            Alert.alert(
              'Coming Soon!',
              `Payment integration coming soon!\n\nYou selected:\n• ${selectedTier.toUpperCase()} tier\n• ${billingPeriod === 'annual' ? 'Annual' : 'Monthly'} billing\n\nFor now, go to Profile to toggle premium for testing.`,
              [{ text: 'OK' }]
            );
          }}
          reason={upgradeReason}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ===== AUTH LOADING STYLES =====
const authStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#667EEA',
  },
});