import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import PremiumService from '../services/PremiumService';

/**
 * TierTestingTool Component
 * 
 * Standalone developer tool for testing tier functionality.
 * Can be easily added/removed without breaking other components.
 * 
 * Usage:
 * import TierTestingTool from '../components/TierTestingTool';
 * 
 * <TierTestingTool />
 */

const TierTestingTool = () => {
  const [currentTier, setCurrentTier] = useState('free');
  const [todayScans, setTodayScans] = useState(0);
  const [scanLimit, setScanLimit] = useState(7);
  const [loading, setLoading] = useState(true);

  // Load tier status on mount
  useEffect(() => {
    loadTierStatus();
  }, []);

  const loadTierStatus = async () => {
    try {
      setLoading(true);
      const status = await PremiumService.getStatus();
      setCurrentTier(status.tier);
      setTodayScans(status.todayScans);
      setScanLimit(status.scanLimit);
      console.log('🧪 Tier Testing Tool - Current Status:', status);
    } catch (error) {
      console.error('❌ Error loading tier status:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchToFree = async () => {
    try {
      console.log('🔄 Switching to FREE tier...');
      await PremiumService.setTestFree();
      await loadTierStatus();
      
      Alert.alert(
        '🆓 Switched to Free Tier',
        '• 7 scans per day\n• 7-day history\n• FDA Top 8 allergens only\n• 1 allergen profile',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error switching to Free:', error);
      Alert.alert('Error', 'Failed to switch tier');
    }
  };

  const switchToPlus = async () => {
    try {
      console.log('🔄 Switching to PLUS tier...');
      await PremiumService.setTestPlus();
      await loadTierStatus();
      
      Alert.alert(
        '⭐ Switched to Plus Tier',
        '• 25 scans per day\n• 30-day history\n• ADHD alerts enabled\n• 100+ allergens\n• 3 family profiles',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error switching to Plus:', error);
      Alert.alert('Error', 'Failed to switch tier');
    }
  };

  const switchToPro = async () => {
    try {
      console.log('🔄 Switching to PRO tier...');
      await PremiumService.setTestPro();
      await loadTierStatus();
      
      Alert.alert(
        '👑 Switched to Pro Tier',
        '• Unlimited scans\n• Unlimited history\n• ADHD alerts enabled\n• 100+ allergens\n• Unlimited family profiles\n• Family sharing',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error switching to Pro:', error);
      Alert.alert('Error', 'Failed to switch tier');
    }
  };

  const resetScans = async () => {
    try {
      console.log('🔄 Resetting scan counter...');
      await PremiumService.resetScanCounter();
      await loadTierStatus();
      
      Alert.alert(
        '🔄 Scans Reset',
        'Scan counter has been reset to 0',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error resetting scans:', error);
      Alert.alert('Error', 'Failed to reset scans');
    }
  };

  const showStatus = async () => {
    try {
      console.log('📊 Logging current status...');
      await PremiumService.logStatus();
      
      const status = await PremiumService.getStatus();
      
      Alert.alert(
        '📊 Current Status',
        `Tier: ${status.tier.toUpperCase()}\n` +
        `Today's Scans: ${status.todayScans}\n` +
        `Scan Limit: ${status.scanLimit === -1 ? 'Unlimited' : status.scanLimit}\n` +
        `Scans Remaining: ${status.scansRemaining === -1 ? 'Unlimited' : status.scansRemaining}\n` +
        `Can Scan: ${status.canScan ? 'Yes' : 'No'}\n\n` +
        `Check console for detailed logs`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error getting status:', error);
      Alert.alert('Error', 'Failed to get status');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>🧪 Developer Testing</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🧪 Developer Testing</Text>
      
      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Current Tier:</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>
              {currentTier === 'free' && '🆓 FREE'}
              {currentTier === 'plus' && '⭐ PLUS'}
              {currentTier === 'pro' && '👑 PRO'}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Today's Scans:</Text>
          <Text style={styles.statusValue}>
            {todayScans} / {scanLimit === -1 ? '∞' : scanLimit}
          </Text>
        </View>
      </View>

      {/* Tier Buttons */}
      <Text style={styles.buttonGroupLabel}>Switch Tier:</Text>
      <View style={styles.tierButtonsRow}>
        <TouchableOpacity
          style={[
            styles.tierButton,
            currentTier === 'free' && styles.tierButtonActive
          ]}
          onPress={switchToFree}
          activeOpacity={0.7}
        >
          <Text style={styles.tierButtonIcon}>🆓</Text>
          <Text style={styles.tierButtonText}>Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tierButton,
            currentTier === 'plus' && styles.tierButtonActive
          ]}
          onPress={switchToPlus}
          activeOpacity={0.7}
        >
          <Text style={styles.tierButtonIcon}>⭐</Text>
          <Text style={styles.tierButtonText}>Plus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tierButton,
            currentTier === 'pro' && styles.tierButtonActive
          ]}
          onPress={switchToPro}
          activeOpacity={0.7}
        >
          <Text style={styles.tierButtonIcon}>👑</Text>
          <Text style={styles.tierButtonText}>Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={resetScans}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonIcon}>🔄</Text>
          <Text style={styles.actionButtonText}>Reset Scans</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={showStatus}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonIcon}>📊</Text>
          <Text style={styles.actionButtonText}>Show Status</Text>
        </TouchableOpacity>
      </View>

      {/* Info Text */}
      <Text style={styles.infoText}>
        💡 Tip: Check console logs for detailed status information
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#667EEA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: '700',
  },
  tierBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667EEA',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TierTestingTool;