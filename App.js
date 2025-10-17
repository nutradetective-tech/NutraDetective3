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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FirebaseStorageService from './services/FirebaseStorageService';
import ImagePickerTest from './components/ImagePickerTest';
import PremiumService from './services/PremiumService';
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

// ===== FIREBASE AUTH IMPORTS (NEW) =====
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // ===== AUTH STATE (NEW) =====
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // ===== FIREBASE AUTH STATE LISTENER (NEW) =====
  useEffect(() => {
    console.log('🔥 Setting up Firebase Auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('✅ User is signed in!');
        console.log('👤 User ID:', currentUser.uid);
        console.log('📧 Email:', currentUser.email);
        setUser(currentUser);
      } else {
        console.log('❌ No user signed in');
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // ===== EXISTING INITIALIZATION =====
  useEffect(() => {
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
  }, []);

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

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('scanHistory');
      if (historyData) {
        const allHistory = JSON.parse(historyData);
        const filteredHistory = await PremiumService.filterHistory(allHistory);
        setScanHistory(filteredHistory);
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

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
    
    const scanCheck = await PremiumService.canScan();
    
    if (!scanCheck.canScan) {
      setIsScanning(false);
      setScanMethod(null);
      setShowCameraScanner(false);
      setUpgradeReason('scans');
      setShowUpgradeModal(true);
      return;
    }
    
    setIsScanning(false);
    setScanMethod(null);
    setShowCameraScanner(false);
    console.log('Starting product fetch');
    
    setTimeout(async () => {
      setIsLoading(true);
      
      try {
        if (!isPremium) {
          const newCount = await PremiumService.incrementScanCounter();
          setTodayScans(newCount);
        }
        
        const product = await ProductService.fetchProductByBarcode(barcode);
        
        if (product) {
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

  // ===== SPLASH SCREEN (EXISTING) =====
  if (showSplash) {
    return <SplashScreen splashFadeAnim={splashFadeAnim} styles={{}} />;
  }

  // ===== AUTH LOADING SCREEN (NEW) =====
  if (authLoading) {
    return (
      <View style={authStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={authStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ===== SHOW AUTH SCREEN IF NOT LOGGED IN (NEW) =====
  if (!user) {
    return <AuthScreen />;
  }

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
        />
        
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
    </SafeAreaProvider>
  );
}

// ===== AUTH LOADING STYLES (NEW) =====
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