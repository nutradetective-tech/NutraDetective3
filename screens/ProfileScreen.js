import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NameEditModal from '../components/modals/NameEditModal';
import GoalEditModal from '../components/modals/GoalEditModal';
import StatsSelectorModal from '../components/modals/StatsSelectorModal';
import AllergenPickerModal from '../components/modals/AllergenPickerModal';
import UserSettingsService from '../services/UserSettingsService';
import PremiumService from '../services/PremiumService';
import SupabaseStorageService from '../services/SupabaseStorageService';
import AllergenService from '../services/AllergenService';
import { ALLERGEN_DATABASE } from '../services/allergen-database';
import { calculateStreak } from '../utils/calculations';
import { isTablet } from '../utils/responsive';
import BottomNav from '../components/BottomNav';
import ScreenContainer from '../components/ScreenContainer';
import { supabase } from '../config/supabase';

const ProfileScreen = ({
  user,
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

  // Allergen management state
  const [allergenProfiles, setAllergenProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [expandedProfiles, setExpandedProfiles] = useState(new Set(['user']));
  const [showAllergenPicker, setShowAllergenPicker] = useState(false);
  const [currentPickerProfile, setCurrentPickerProfile] = useState(null);
  const [userTier, setUserTier] = useState('free');

  // Load profile picture and allergen profiles on mount
  useEffect(() => {
    loadProfilePicture();
    loadAllergenProfiles();
    loadUserTier();
  }, []);

  const loadUserTier = async () => {
    try {
      const status = await PremiumService.getStatus();
      setUserTier(status.tier);
    } catch (error) {
      console.error('Error loading tier:', error);
    }
  };

  const loadAllergenProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const profiles = await AllergenService.getAllProfiles();
      setAllergenProfiles(profiles);
      console.log('📋 Loaded allergen profiles:', profiles.length);
    } catch (error) {
      console.error('Error loading allergen profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

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

  const pickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;

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
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const userId = user.id;
      console.log('📤 Uploading profile picture for user:', userId);

      const downloadUrl = await SupabaseStorageService.uploadProfilePicture(
        userId,
        imageUri
      );

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
            } catch (error) {
              console.error('❌ Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Allergen profile management functions
  const toggleProfileExpanded = (profileId) => {
    const newExpanded = new Set(expandedProfiles);
    if (newExpanded.has(profileId)) {
      newExpanded.delete(profileId);
    } else {
      newExpanded.add(profileId);
    }
    setExpandedProfiles(newExpanded);
  };

  const addFamilyMember = async () => {
    try {
      // Check tier limits
      const canAdd = await AllergenService.canAddProfile(userTier);
      if (!canAdd.allowed) {
        Alert.alert(
          canAdd.reason === 'tier_limit' ? '⭐ Upgrade Required' : '👑 Pro Required',
          canAdd.message,
          [
            { text: 'Maybe Later', style: 'cancel' },
            { text: 'Upgrade', onPress: () => {
              // TODO: Open upgrade modal
              console.log('Open upgrade modal');
            }}
          ]
        );
        return;
      }

      // Prompt for name
      Alert.prompt(
        'Add Family Member',
        'Enter the name of the family member:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: async (name) => {
              if (!name || !name.trim()) {
                Alert.alert('Error', 'Please enter a name.');
                return;
              }

              try {
                await AllergenService.createProfile(name.trim(), []);
                await loadAllergenProfiles();
                Alert.alert(
                  '✅ Added!',
                  `${name} has been added to your family profiles.`,
                  [{ text: 'Great!' }]
                );
              } catch (error) {
                console.error('Error creating profile:', error);
                Alert.alert('Error', 'Could not create profile. Please try again.');
              }
            }
          }
        ],
        'plain-text'
      );
    } catch (error) {
      console.error('Error in addFamilyMember:', error);
      Alert.alert('Error', 'Could not add family member.');
    }
  };

  const deleteProfile = (profileId, profileName) => {
    if (profileId === 'user') {
      Alert.alert('Cannot Delete', 'You cannot delete your own profile.');
      return;
    }

    Alert.alert(
      'Delete Profile?',
      `Are you sure you want to delete ${profileName}'s profile? This will remove all their allergen settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AllergenService.deleteProfile(profileId);
              await loadAllergenProfiles();
              Alert.alert('✅ Deleted', `${profileName}'s profile has been removed.`);
            } catch (error) {
              console.error('Error deleting profile:', error);
              Alert.alert('Error', 'Could not delete profile.');
            }
          }
        }
      ]
    );
  };

  const openAllergenPicker = (profile) => {
    setCurrentPickerProfile(profile);
    setShowAllergenPicker(true);
  };

  const handleSelectAllergen = async (allergen) => {
    if (!currentPickerProfile) return;

    try {
      await AllergenService.addAllergenToProfile(currentPickerProfile.id, allergen.id);
      await loadAllergenProfiles();
      setShowAllergenPicker(false);
      
      Alert.alert(
        '✅ Added!',
        `${allergen.name} has been added to ${currentPickerProfile.name}'s allergens.`,
        [{ text: 'Great!' }]
      );
    } catch (error) {
      console.error('Error adding allergen:', error);
      Alert.alert('Error', 'Could not add allergen. Please try again.');
    }
  };

  const removeAllergen = (profileId, allergenId, profileName, allergenName) => {
    Alert.alert(
      'Remove Allergen?',
      `Remove ${allergenName} from ${profileName}'s allergens?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await AllergenService.removeAllergenFromProfile(profileId, allergenId);
              await loadAllergenProfiles();
              Alert.alert('✅ Removed', `${allergenName} has been removed.`);
            } catch (error) {
              console.error('Error removing allergen:', error);
              Alert.alert('Error', 'Could not remove allergen.');
            }
          }
        }
      ]
    );
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'severe': return '🔴';
      case 'moderate': return '🟡';
      case 'mild': return '🟢';
      default: return '⚪';
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
    <ScreenContainer activeTab="profile" setActiveTab={setActiveTab}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.profileHeader}
      >
        <Text style={styles.profileHeaderTitle}>Profile</Text>

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

        {user && user.email && (
          <Text style={styles.userEmail}>{user.email}</Text>
        )}
      </LinearGradient>

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

      {/* ALLERGEN PROFILES SECTION */}
      <View style={allergenStyles.section}>
        <View style={allergenStyles.sectionHeader}>
          <Text style={styles.sectionTitle}>🥜 Allergen Profiles</Text>
          {userTier !== 'free' && (
            <TouchableOpacity
              style={allergenStyles.addButton}
              onPress={addFamilyMember}
            >
              <Text style={allergenStyles.addButtonText}>+ Family</Text>
            </TouchableOpacity>
          )}
        </View>

        {loadingProfiles ? (
          <View style={allergenStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#667EEA" />
          </View>
        ) : (
          allergenProfiles.map((profile) => {
            const isExpanded = expandedProfiles.has(profile.id);
            const allergenCount = profile.allergens.length;

            return (
              <View key={profile.id} style={allergenStyles.profileCard}>
                {/* Profile Header */}
                <TouchableOpacity
                  style={allergenStyles.profileHeader}
                  onPress={() => toggleProfileExpanded(profile.id)}
                  activeOpacity={0.7}
                >
                  <View style={allergenStyles.profileHeaderLeft}>
                    <Text style={allergenStyles.profileIcon}>
                      {profile.id === 'user' ? '👤' : '👨‍👩‍👧'}
                    </Text>
                    <View>
                      <Text style={allergenStyles.profileName}>{profile.name}</Text>
                      <Text style={allergenStyles.profileSubtext}>
                        {allergenCount} allergen{allergenCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                  <Text style={allergenStyles.expandIcon}>
                    {isExpanded ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {/* Expanded Content */}
                {isExpanded && (
                  <View style={allergenStyles.profileContent}>
                    {allergenCount === 0 ? (
                      <View style={allergenStyles.emptyState}>
                        <Text style={allergenStyles.emptyText}>
                          No allergens added yet
                        </Text>
                      </View>
                    ) : (
                      <View style={allergenStyles.allergensContainer}>
                        {profile.allergens.map((allergenId) => {
                          const allergen = ALLERGEN_DATABASE[allergenId];
                          if (!allergen) return null;

                          return (
                            <View key={allergenId} style={allergenStyles.allergenChip}>
                              <Text style={allergenStyles.allergenChipIcon}>
                                {getSeverityIcon(allergen.severity)}
                              </Text>
                              <Text style={allergenStyles.allergenChipText}>
                                {allergen.name}
                              </Text>
                              <TouchableOpacity
                                onPress={() => removeAllergen(
                                  profile.id,
                                  allergenId,
                                  profile.name,
                                  allergen.name
                                )}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                              >
                                <Text style={allergenStyles.allergenChipRemove}>✕</Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View style={allergenStyles.profileActions}>
                      <TouchableOpacity
                        style={allergenStyles.actionButton}
                        onPress={() => openAllergenPicker(profile)}
                      >
                        <Text style={allergenStyles.actionButtonText}>
                          + Add Allergen
                        </Text>
                      </TouchableOpacity>

                      {profile.id !== 'user' && (
                        <TouchableOpacity
                          style={allergenStyles.deleteButton}
                          onPress={() => deleteProfile(profile.id, profile.name)}
                        >
                          <Text style={allergenStyles.deleteButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* Upgrade Prompt for Free Users */}
        {userTier === 'free' && (
          <View style={allergenStyles.upgradePrompt}>
            <Text style={allergenStyles.upgradePromptText}>
              Upgrade to Plus for 100+ allergens and family profiles
            </Text>
          </View>
        )}
      </View>

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

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutIcon}>🚪</Text>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Modals */}
      <NameEditModal
        visible={showNameEditModal}
        currentName={userSettings.userName}
        onClose={() => setShowNameEditModal(false)}
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
        onClose={() => setShowGoalModal(false)}
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
        onClose={() => setShowStatsModal(false)}
        onSave={async (newStats) => {
          await UserSettingsService.updateDashboardStats(newStats);
          const newSettings = await UserSettingsService.getSettings();
          setUserSettings(newSettings);
          setShowStatsModal(false);
        }}
      />
      <AllergenPickerModal
        visible={showAllergenPicker}
        onClose={() => setShowAllergenPicker(false)}
        onSelectAllergen={handleSelectAllergen}
        selectedAllergens={currentPickerProfile?.allergens || []}
        profileName={currentPickerProfile?.name || ''}
      />
    </ScreenContainer>
  );
};

// Allergen-specific styles
const allergenStyles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  profileSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  expandIcon: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  profileContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  allergenChipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  allergenChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    marginRight: 4,
  },
  allergenChipRemove: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '700',
    marginLeft: 2,
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#667EEA',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
  },
  upgradePrompt: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  upgradePromptText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ProfileScreen;