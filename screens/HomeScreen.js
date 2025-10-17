import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Modal,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CameraScanner from '../components/CameraScanner';
import SimpleScanner from '../components/SimpleScanner';
import ScannerSelector from '../components/ScannerSelector';
import { getResponsiveSize, isTablet } from '../utils/responsive';
import { formatDate, getGreeting } from '../utils/formatters';
import { getGradeGradient, getTodayScans, getAverageGrade, calculateStreak, getGradeColor } from '../utils/calculations';

const HomeScreen = ({
  userSettings,
  scanHistory,
  showScanSelector,
  setShowScanSelector,
  scanMethod,
  setScanMethod,
  isScanning,
  setIsScanning,
  handleBarcodeScan,
  handleHistoryItemPress,
  setActiveTab,
  pulseAnim,
  fadeAnim,
  styles,
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

  if (isScanning && scanMethod === 'camera') {
    return (
      <CameraScanner
        onScanResult={(result) => {
          handleBarcodeScan(result);
        }}
        onClose={() => {
          setIsScanning(false);
          setScanMethod(null);
        }}
      />
    );
  }

  if (isScanning && scanMethod === 'manual') {
    return (
      <SimpleScanner
        onScanResult={handleBarcodeScan}
        onClose={() => {
          setIsScanning(false);
          setScanMethod(null);
        }}
        onSwitchToCamera={() => {
          setIsScanning(false);
          setScanMethod(null);
          setShowScanSelector(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ResponsiveContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={[styles.homeHeader, styles.cardShadow]}>
              <View style={styles.headerLeft}>
                <View style={styles.logoHeader}>
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    style={styles.logoIconContainer}
                  >
                    <Image 
                      source={require('../assets/images/logo.png')}
                      style={{ width: 48, height: 48, tintColor: '#FFFFFF' }}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                  <Text style={styles.logoText}>
                    <Text style={styles.logoNutra}>Nutra</Text>
                    <Text style={styles.logoDetective}>Detective</Text>
                  </Text>
                </View>
                
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
                    statValue = calculateStreak(scanHistory);
                    statLabel = 'Streak\nDays';
                    statColor = '#F59E0B';
                    break;
                  case 'dailyGoal':
                    const todayScans = getTodayScans(scanHistory);
                    statValue = `${todayScans}/${userSettings.scanGoal}`;
                    statLabel = 'Daily\nGoal';
                    statColor = todayScans >= userSettings.scanGoal ? '#10B981' : '#8B5CF6';
                    break;
                  case 'avgGrade':
                    statValue = getAverageGrade(scanHistory);
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
          </Animated.View>
        </ScrollView>

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
};

export default HomeScreen;