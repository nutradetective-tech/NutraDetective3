import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RevenueCatService from '../../services/RevenueCatService';

const PaywallModal = ({ visible, onClose, onPurchaseSuccess, upgradeReason = 'features' }) => {
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [billingPeriod, setBillingPeriod] = useState('annual'); // 'monthly' or 'annual'

  useEffect(() => {
    if (visible) {
      loadPackages();
    }
  }, [visible]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const offerings = await RevenueCatService.getOfferings();
      
      if (offerings && offerings.availablePackages) {
        setPackages(offerings.availablePackages);
        console.log('📦 Loaded packages:', offerings.availablePackages.length);
      } else {
        Alert.alert('Error', 'No subscription packages available. Please try again later.');
      }
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', 'Failed to load subscription options.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg) => {
    try {
      setPurchasing(true);
      console.log('💰 Attempting purchase:', pkg.identifier);

      const result = await RevenueCatService.purchasePackage(pkg);

      if (result.success) {
        Alert.alert(
          '🎉 Success!',
          `Welcome to ${result.tier === 'plus' ? 'Plus' : 'Pro'} tier!`,
          [
            {
              text: 'Awesome!',
              onPress: () => {
                onPurchaseSuccess(result.tier);
                onClose();
              }
            }
          ]
        );
      } else if (result.cancelled) {
        // User cancelled - do nothing
        console.log('Purchase cancelled by user');
      } else {
        Alert.alert('Purchase Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      const result = await RevenueCatService.restorePurchases();

      if (result.success) {
        Alert.alert(
          '✅ Restored!',
          `Your ${result.tier} subscription has been restored!`,
          [
            {
              text: 'Great!',
              onPress: () => {
                onPurchaseSuccess(result.tier);
                onClose();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'No Subscriptions Found',
          result.message || 'No active subscriptions to restore.'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases.');
    } finally {
      setPurchasing(false);
    }
  };

  const getUpgradeMessage = () => {
    switch (upgradeReason) {
      case 'scans':
        return 'Upgrade to scan more products per day!';
      case 'adhd':
        return 'Unlock ADHD additive alerts for your family!';
      case 'history':
        return 'Get unlimited scan history!';
      default:
        return 'Unlock all premium features!';
    }
  };

  const renderPackageCard = (tier, monthlyPrice, annualPrice, features) => {
    const isAnnual = billingPeriod === 'annual';
    const price = isAnnual ? annualPrice : monthlyPrice;
    const savings = isAnnual ? Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100) : 0;

    return (
      <TouchableOpacity
        style={[
          styles.packageCard,
          tier === 'pro' && styles.packageCardPro
        ]}
        onPress={() => {
          const pkg = packages.find(p => 
            p.identifier.includes(tier) && 
            p.identifier.includes(isAnnual ? 'annual' : 'monthly')
          );
          if (pkg) handlePurchase(pkg);
        }}
        disabled={purchasing}
      >
        {tier === 'pro' && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}

        <View style={styles.packageHeader}>
          <Text style={styles.packageIcon}>{tier === 'plus' ? '⭐' : '👑'}</Text>
          <Text style={styles.packageTitle}>{tier === 'plus' ? 'Plus' : 'Pro'}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceAmount}>${price}</Text>
          <Text style={styles.pricePeriod}>/{isAnnual ? 'year' : 'month'}</Text>
        </View>

        {isAnnual && savings > 0 && (
          <Text style={styles.savingsText}>Save {savings}%</Text>
        )}

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={tier === 'plus' ? ['#FBBF24', '#F59E0B'] : ['#667EEA', '#764BA2']}
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>
            {purchasing ? 'Processing...' : 'Select Plan'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667EEA" />
          <Text style={styles.loadingText}>Loading options...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Upgrade NutraDetective</Text>
            <Text style={styles.modalSubtitle}>{getUpgradeMessage()}</Text>

            {/* Billing Period Toggle */}
            <View style={styles.billingToggle}>
              <TouchableOpacity
                style={[
                  styles.billingOption,
                  billingPeriod === 'monthly' && styles.billingOptionActive
                ]}
                onPress={() => setBillingPeriod('monthly')}
              >
                <Text style={[
                  styles.billingOptionText,
                  billingPeriod === 'monthly' && styles.billingOptionTextActive
                ]}>Monthly</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.billingOption,
                  billingPeriod === 'annual' && styles.billingOptionActive
                ]}
                onPress={() => setBillingPeriod('annual')}
              >
                <Text style={[
                  styles.billingOptionText,
                  billingPeriod === 'annual' && styles.billingOptionTextActive
                ]}>Annual</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>SAVE 17%</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Plus Package */}
            {renderPackageCard(
              'plus',
              4.99,
              49.99,
              [
                '25 scans per day',
                'ADHD additive alerts',
                '30-day scan history',
                'Advanced allergen detection',
                'No ads ever'
              ]
            )}

            {/* Pro Package */}
            {renderPackageCard(
              'pro',
              9.99,
              99.99,
              [
                'Unlimited scans',
                'ADHD additive alerts',
                'Unlimited scan history',
                'Family sharing (5 accounts)',
                'Priority support',
                'No ads ever'
              ]
            )}

            {/* Restore Purchases */}
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={purchasing}
            >
              <Text style={styles.restoreButtonText}>
                Restore Purchases
              </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Subscriptions auto-renew. Cancel anytime in your app store settings.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  billingOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billingOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  billingOptionTextActive: {
    color: '#667EEA',
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  savingsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  packageCardPro: {
    borderColor: '#667EEA',
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#667EEA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  packageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#667EEA',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureCheck: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 8,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667EEA',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
});

export default PaywallModal;