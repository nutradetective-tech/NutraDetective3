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

const ProfileScreen = ({
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
  // NEW STATE: Profile picture URI and upload status
  const [profilePictureUri, setProfilePictureUri] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // NEW: Load profile picture on component mount
  useEffect(() => {
    loadProfilePicture();
  }, []);

  // NEW FUNCTION: Load saved profile picture from AsyncStorage
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

  // NEW FUNCTION: Pick image from gallery
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

 // NEW FUNCTION: Upload image to Firebase Storage
const uploadProfilePicture = async (imageUri) => {
  setUploadingImage(true);
  
  try {
    // For now, we'll use a simple user ID (replace with actual auth user ID later)
    const userId = 'test-user-' + Date.now();
    
    // Upload to Firebase
    const downloadUrl = await FirebaseStorageService.uploadProfilePicture(
      userId,    // ✅ userId FIRST
      imageUri   // ✅ imageUri SECOND
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
          
          {/* UPDATED: Make avatar tappable and show image or initials */}
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
                // Show loading spinner while uploading
                <ActivityIndicator size="large" color="#FFF" />
              ) : profilePictureUri ? (
                // Show uploaded profile picture
                <Image 
                  source={{ uri: profilePictureUri }}
                  style={styles.profileImage}
                />
              ) : (
                // Show initials if no picture
                <Text style={styles.profileAvatarIcon}>
                  {userSettings.profileInitials}
                </Text>
              )}
            </LinearGradient>
            
            {/* NEW: Camera icon to indicate it's tappable */}
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