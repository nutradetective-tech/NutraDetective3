import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
   Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NameEditModal from '../components/modals/NameEditModal';
import GoalEditModal from '../components/modals/GoalEditModal';
import StatsSelectorModal from '../components/modals/StatsSelectorModal';
import UserSettingsService from '../services/UserSettingsService';
import PremiumService from '../services/PremiumService';
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
  styles, // Pass styles from App.js for now
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
              <Text style={styles.profileStatValue}>{calculateStreak(scanHistory)}</Text>
              <Text style={styles.profileStatLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Personalization</Text>

            {/* 🔥 PREMIUM TOGGLE - FOR TESTING ONLY */}
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
        <NameEditModal 
          visible={showNameEditModal}
          tempName={tempName}
          setTempName={setTempName}
          onClose={() => {
            setTempName(userSettings.userName);
            setShowNameEditModal(false);
          }}
          onSave={async () => {
            await UserSettingsService.updateUserName(tempName);
            const newSettings = await UserSettingsService.getSettings();
            setUserSettings(newSettings);
            setShowNameEditModal(false);
          }}
        />
        <GoalEditModal
          visible={showGoalModal}
          tempGoal={tempGoal}
          setTempGoal={setTempGoal}
          onClose={() => {
            setTempGoal(userSettings.scanGoal);
            setShowGoalModal(false);
          }}
          onSave={async () => {
            await UserSettingsService.updateScanGoal(tempGoal);
            const newSettings = await UserSettingsService.getSettings();
            setUserSettings(newSettings);
            setShowGoalModal(false);
          }}
        />
        <StatsSelectorModal
          visible={showStatsModal}
          tempStats={tempStats}
          setTempStats={setTempStats}
          onClose={() => {
            setTempStats(userSettings.dashboardStats);
            setShowStatsModal(false);
          }}
          onSave={async () => {
            await UserSettingsService.updateDashboardStats(tempStats);
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