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
import FirebaseStorageService from '../services/FirebaseStorageService';
import { calculateStreak } from '../utils/calculations';
import { isTablet } from '../utils/responsive';
// ===== NEW: Firebase Auth imports =====
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const ProfileScreen = ({
  user, // ===== NEW: User prop from App.js =====
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

  // Load profile picture on component mount
  useEffect(() => {
    loadProfilePicture();
  }, []);

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

  // ===== UPDATED: Upload image to Firebase Storage with REAL USER ID =====
  const uploadProfilePicture = async (imageUri) => {
    setUploadingImage(true);

    try {
      // ✅ USE REAL USER ID from authenticated user
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }

      const userId = user.uid; // ✅ Real Firebase user ID

      console.log('📤 Uploading profile picture for user:', userId);

      // Upload to Firebase
      const downloadUrl = await FirebaseStorageService.uploadProfilePicture(
        userId,    // ✅ Real user ID
        imageUri   // ✅ Image URI
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

  // ===== NEW: Sign Out Function =====
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
              await signOut(auth);
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

          {/* ===== NEW: Display user email below name ===== */}
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

          {/* ===== NEW: Sign Out Button ===== */}
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

export default ProfileScreen;