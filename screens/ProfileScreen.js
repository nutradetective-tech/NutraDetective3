import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NameEditModal from '../components/modals/NameEditModal';
import GoalEditModal from '../components/modals/GoalEditModal';
import StatsSelectorModal from '../components/modals/StatsSelectorModal';
import UserSettingsService from '../services/UserSettingsService';
import PremiumService from '../services/PremiumService';
import SupabaseStorageService from '../services/SupabaseStorageService';
import { calculateStreak } from '../utils/calculations';
import { isTablet } from '../utils/responsive';
// ===== SUPABASE AUTH IMPORTS =====
import { supabase } from '../config/supabase';

const ProfileScreen = ({
  user, // ===== User prop from App.js =====
  userSettings,
  setUserSettings,
  scanHistory,
  showNameEditModal,
  setShowNameEditModal,
  showGoalModal,
  setShowGoalModal,
  showStatsModal,
  setShowStatsModal,
  tempName,
  setTempName,
  tempGoal,
  setTempGoal,
  tempStats,
  setTempStats,
  setActiveTab,
  styles,
}) => {
  // Profile picture state
  const [profilePictureUri, setProfilePictureUri] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ===== NEW: Tier testing state =====
  const [currentTier, setCurrentTier] = useState('free');
  const [todayScans, setTodayScans] = useState(0);
  const [scanLimit, setScanLimit] = useState(7);

  // Load profile picture on component mount
  useEffect(() => {
    loadProfilePicture();
    loadTierStatus(); // ===== NEW: Load tier status =====
  }, []);

  // ===== NEW: Load tier status =====
  const loadTierStatus = async () => {
    try {
      const status = await PremiumService.getStatus();
      setCurrentTier(status.tier);
      setTodayScans(status.todayScans);
      setScanLimit(status.scanLimit);
    } catch (error) {
      console.error('Error loading tier status:', error);
    }
  };

  // Load saved profile picture from AsyncStorage
  const loadProfilePicture = async () => {
    try {
      const savedUri = await AsyncStorage.getItem('profilePictureUri');
      if (savedUri) {
        setProfilePictureUri(savedUri);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  };

  // Pick image from gallery
  const pickProfileImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        // Show confirmation
        Alert.alert(
          'Upload Profile Picture?',
          'This will replace your current profile picture.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Upload',
              onPress: () => uploadProfilePicture(imageUri)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };


  const uploadProfilePicture = async (imageUri) => {
    setUploadingImage(true);

    try {
      // ✅ USE REAL USER ID from authenticated user
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const userId = user.id; // ✅ Supabase user ID

      console.log('📤 Uploading profile picture for user:', userId);

      // Upload to Supabase Storage
      const downloadUrl = await SupabaseStorageService.uploadProfilePicture(
        userId,
        imageUri
      );

      // Save URL to state and AsyncStorage
      setProfilePictureUri(downloadUrl);
      await AsyncStorage.setItem('profilePictureUri', downloadUrl);

      Alert.alert(
        '✅ Success!',
        'Profile picture uploaded successfully!',
        [{ text: 'Great!' }]
      );
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert(
        'Upload Failed',
        'Could not upload profile picture. Please try again.\n\nError: ' + error.message,
        [{ text: 'OK' }]
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // ===== NEW: Tier testing handlers =====
  const switchToFree = async () => {
    try {
      await PremiumService.setTestFree();
      await loadTierStatus();
      Alert.alert(
        '🆓 Switched to Free',
        '7 scans/day\n7-day history',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to switch tier');
    }
  };

  const switchToPlus = async () => {
    try {
      await PremiumService.setTestPlus();
      await loadTierStatus();
      Alert.alert(
        '⭐ Switched to Plus',
        '25 scans/day\n30-day history\nADHD alerts enabled',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to switch tier');
    }
  };

  const switchToPro = async () => {
    try {
      await PremiumService.setTestPro();
      await loadTierStatus();
      Alert.alert(
        '👑 Switched to Pro',
        'Unlimited scans\nUnlimited history\nFamily sharing\nAll features',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to switch tier');
    }
  };

  const resetScans = async () => {
    try {
      await PremiumService.resetScanCounter();
      await loadTierStatus();
      Alert.alert(
        '🔄 Scans Reset',
        'Scan counter has been reset to 0',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset scans');
    }
  };

  const showStatus = async () => {
    try {
      await PremiumService.logStatus();
      Alert.alert(
        '📊 Status Logged',
        'Check the console for detailed status information',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to get status');
    }
  };

  // ===== SIGN OUT FUNCTION (SUPABASE) =====
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚪 Signing out user...');
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              console.log('✅ User signed out successfully');
              // Auth state listener in App.js will automatically show AuthScreen
            } catch (error) {
              console.error('❌ Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ResponsiveContainer>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={styles.profileHeader}
        >
          <Text style={styles.profileHeaderTitle}>Profile</Text>

          {/* Avatar with profile picture */}
          <TouchableOpacity
            onPress={pickProfileImage}
            disabled={uploadingImage}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.profileAvatarLarge}
            >
              {uploadingImage ? (
                <ActivityIndicator size="large" color="#FFF" />
              ) : profilePictureUri ? (
                <Image
                  source={{ uri: profilePictureUri }}
                  style={styles.profileImage}
                />
              ) : (
                <Text style={styles.profileAvatarIcon}>
                  {userSettings.profileInitials}
                </Text>
              )}
            </LinearGradient>

            {/* Camera icon badge */}
            {!uploadingImage && (
              <View style={styles.cameraIconBadge}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.profileNameWhite}>{userSettings.userName}</Text>
          <TouchableOpacity
            onPress={() => setShowNameEditModal(true)}
            style={styles.editNameButton}
          >
            <Text style={styles.editNameText}>✏️ Edit Name</Text>
          </TouchableOpacity>

          {/* ===== Display user email below name ===== */}
          {user && user.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
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
              <Text style={styles.profileStatValue}>{calculateStreak(scanHistory)}</Text>
              <Text style={styles.profileStatLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Personalization</Text>

            <TouchableOpacity
              style={[styles.settingItem, {
                backgroundColor: '#FEF2F2',
                borderWidth: 2,
                borderColor: '#8B5CF6',
                marginBottom: 12
              }]}
              onPress={async () => {
                try {
                  const currentStatus = await PremiumService.isPremium();

                  if (currentStatus) {
                    await PremiumService.deactivateTestPremium();
                    Alert.alert(
                      '✅ Premium Deactivated',
                      'You are now on the free Seeker tier (7 scans/day).',
                      [{ text: 'OK' }]
                    );
                  } else {
                    await PremiumService.activateTestPremium();
                    Alert.alert(
                      '🎉 Guardian Activated!',
                      'You now have Guardian tier for 30 days!\n\n✅ Unlimited scans\n✅ Unlimited history\n✅ No ads (coming soon)',
                      [{ text: 'Awesome!' }]
                    );
                  }
                } catch (error) {
                  console.error('Premium toggle error:', error);
                  Alert.alert('Error', 'Could not toggle premium status. Check console.');
                }
              }}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>👑</Text>
                <Text style={styles.settingLabel}>Premium Status (TEST)</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: '#8B5CF6', fontWeight: '600' }]}>
                  Tap to unlock
                </Text>
                <Text style={styles.settingArrow}>→</Text>
              </View>
            </TouchableOpacity>

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

          {/* ===== NEW: DEVELOPER TESTING SECTION ===== */}
          <View style={testingStyles.testingSection}>
            <Text style={styles.sectionTitle}>🧪 Developer Testing</Text>
            
            <View style={testingStyles.statusCard}>
              <View style={testingStyles.statusRow}>
                <Text style={testingStyles.statusLabel}>Current Tier:</Text>
                <Text style={testingStyles.statusValue}>
                  {currentTier === 'free' && '🆓 FREE'}
                  {currentTier === 'plus' && '⭐ PLUS'}
                  {currentTier === 'pro' && '👑 PRO'}
                </Text>
              </View>
              <View style={testingStyles.statusRow}>
                <Text style={testingStyles.statusLabel}>Today's Scans:</Text>
                <Text style={testingStyles.statusValue}>
                  {todayScans}/{scanLimit === -1 ? '∞' : scanLimit}
                </Text>
              </View>
            </View>

            <Text style={testingStyles.buttonGroupLabel}>Switch Tier:</Text>
            <View style={testingStyles.tierButtonsRow}>
              <TouchableOpacity
                style={[
                  testingStyles.tierButton,
                  currentTier === 'free' && testingStyles.tierButtonActive
                ]}
                onPress={switchToFree}
              >
                <Text style={testingStyles.tierButtonIcon}>🆓</Text>
                <Text style={testingStyles.tierButtonText}>Free</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  testingStyles.tierButton,
                  currentTier === 'plus' && testingStyles.tierButtonActive
                ]}
                onPress={switchToPlus}
              >
                <Text style={testingStyles.tierButtonIcon}>⭐</Text>
                <Text style={testingStyles.tierButtonText}>Plus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  testingStyles.tierButton,
                  currentTier === 'pro' && testingStyles.tierButtonActive
                ]}
                onPress={switchToPro}
              >
                <Text style={testingStyles.tierButtonIcon}>👑</Text>
                <Text style={testingStyles.tierButtonText}>Pro</Text>
              </TouchableOpacity>
            </View>

            <View style={testingStyles.actionButtonsRow}>
              <TouchableOpacity
                style={testingStyles.actionButton}
                onPress={resetScans}
              >
                <Text style={testingStyles.actionButtonIcon}>🔄</Text>
                <Text style={testingStyles.actionButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={testingStyles.actionButton}
                onPress={showStatus}
              >
                <Text style={testingStyles.actionButtonIcon}>📊</Text>
                <Text style={testingStyles.actionButtonText}>Status</Text>
              </TouchableOpacity>
            </View>
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

          {/* ===== SIGN OUT BUTTON ===== */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutIcon}>🚪</Text>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

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

        <NameEditModal
          visible={showNameEditModal}
          currentName={userSettings.userName}
          onClose={() => {
            setShowNameEditModal(false);
          }}
          onSave={async (newName) => {
            await UserSettingsService.updateUserName(newName);
            const newSettings = await UserSettingsService.getSettings();
            setUserSettings(newSettings);
            setShowNameEditModal(false);
          }}
        />
        <GoalEditModal
          visible={showGoalModal}
          currentGoal={userSettings.scanGoal}
          onClose={() => {
            setShowGoalModal(false);
          }}
          onSave={async (newGoal) => {
            await UserSettingsService.updateScanGoal(newGoal);
            const newSettings = await UserSettingsService.getSettings();
            setUserSettings(newSettings);
            setShowGoalModal(false);
          }}
        />
        <StatsSelectorModal
          visible={showStatsModal}
          currentStats={userSettings.dashboardStats}
          onClose={() => {
            setShowStatsModal(false);
          }}
          onSave={async (newStats) => {
            await UserSettingsService.updateDashboardStats(newStats);
            const newSettings = await UserSettingsService.getSettings();
            setUserSettings(newSettings);
            setShowStatsModal(false);
          }}
        />
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

// ===== NEW: Testing styles =====
const testingStyles = StyleSheet.create({
  testingSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#667EEA',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  buttonGroupLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 8,
  },
  tierButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tierButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  tierButtonActive: {
    borderColor: '#667EEA',
    backgroundColor: '#EEF2FF',
  },
  tierButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tierButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
});

export default ProfileScreen;