// components/modals/UpgradeModal.js
// NutraDetective - 3-Tier Upgrade Modal (Free, Plus, Pro)
// Version 2.1 - COMPLETE with Fixed Header + Annual Pricing

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const UpgradeModal = ({ visible, onClose, onUpgrade, reason = 'general' }) => {
  const [selectedTier, setSelectedTier] = useState('plus');
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  // Reason-specific messaging
  const reasons = {
    scans: {
      title: '🚫 Daily Scan Limit Reached',
      message: "You've used all 7 free scans today!",
      highlight: 'scans'
    },
    history: {
      title: '📚 History Limit',
      message: 'Free users can only view the last 7 days of scan history.',
      highlight: 'history'
    },
    adhd: {
      title: '🧠 ADHD Alerts',
      message: 'ADHD additive alerts are a premium feature.',
      highlight: 'adhd'
    },
    allergens: {
      title: '🥜 Advanced Allergens',
      message: 'Access to 100+ allergen database requires Plus or Pro.',
      highlight: 'allergens'
    },
    general: {
      title: '✨ Upgrade to Premium',
      message: 'Unlock the full NutraDetective experience',
      highlight: null
    }
  };

  const content = reasons[reason] || reasons.general;

  // Tier configurations with separate monthly/annual pricing
  const tiers = {
    free: {
      name: 'Free',
      priceMonthly: '$0',
      priceAnnual: '$0',
      period: 'forever',
      color: '#6B7280',
      icon: '🆓',
      features: [
        { text: '7 scans per day', included: true },
        { text: '7-day history', included: true },
        { text: 'Basic A-F grading', included: true },
        { text: 'Top 8 allergens', included: true },
        { text: 'ADHD alerts', included: false },
        { text: 'Advanced allergens', included: false },
        { text: 'Unlimited scans', included: false },
        { text: 'Family sharing', included: false }
      ]
    },
    plus: {
      name: 'Plus',
      priceMonthly: '$4.99',
      priceAnnual: '$49.99',
      annualSavings: 'Save 17%',
      color: '#8B5CF6',
      icon: '⭐',
      badge: 'POPULAR',
      features: [
        { text: '25 scans per day', included: true },
        { text: '30-day history', included: true },
        { text: 'Basic A-F grading', included: true },
        { text: 'Top 8 allergens', included: true },
        { text: 'ADHD alerts', included: true },
        { text: '100+ allergen database', included: true },
        { text: 'Alternative suggestions', included: true },
        { text: 'Family sharing', included: false }
      ]
    },
    pro: {
      name: 'Pro',
      priceMonthly: '$9.99',
      priceAnnual: '$99.99',
      annualSavings: 'Save 17%',
      color: '#F59E0B',
      icon: '👑',
      badge: 'BEST VALUE',
      features: [
        { text: 'Unlimited scans', included: true },
        { text: 'Unlimited history', included: true },
        { text: 'Basic A-F grading', included: true },
        { text: 'Top 8 allergens', included: true },
        { text: 'ADHD alerts', included: true },
        { text: '100+ allergen database', included: true },
        { text: 'Alternative suggestions', included: true },
        { text: 'Family sharing (5 accounts)', included: true },
        { text: 'Priority support', included: true },
        { text: 'Store leaderboards', included: true }
      ]
    }
  };

  const selectedTierData = tiers[selectedTier];
  const displayPrice = billingPeriod === 'annual' 
    ? selectedTierData.priceAnnual 
    : selectedTierData.priceMonthly;
  const displayPeriod = billingPeriod === 'annual' ? 'per year' : 'per month';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Fixed Header (doesn't scroll) */}
          <View style={styles.fixedHeader}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.message}>{content.message}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Tier Selector */}
            <View style={styles.tierSelector}>
              {Object.keys(tiers).map((tierKey) => {
                const tier = tiers[tierKey];
                const isSelected = selectedTier === tierKey;
                const isFree = tierKey === 'free';

                return (
                  <TouchableOpacity
                    key={tierKey}
                    style={[
                      styles.tierTab,
                      isSelected && styles.tierTabSelected,
                      isFree && styles.tierTabFree
                    ]}
                    onPress={() => setSelectedTier(tierKey)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tierIcon}>{tier.icon}</Text>
                    <Text style={[
                      styles.tierName,
                      isSelected && styles.tierNameSelected
                    ]}>
                      {tier.name}
                    </Text>
                    {tier.badge && (
                      <View style={styles.tierBadge}>
                        <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Tier Details */}
            <View style={styles.tierDetails}>
              
              {/* Billing Period Toggle (Only for Plus/Pro) */}
              {selectedTier !== 'free' && (
                <View style={styles.billingToggle}>
                  <TouchableOpacity
                    style={[
                      styles.billingButton,
                      billingPeriod === 'monthly' && styles.billingButtonActive
                    ]}
                    onPress={() => setBillingPeriod('monthly')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.billingButtonText,
                      billingPeriod === 'monthly' && styles.billingButtonTextActive
                    ]}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.billingButton,
                      billingPeriod === 'annual' && styles.billingButtonActive
                    ]}
                    onPress={() => setBillingPeriod('annual')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.billingButtonText,
                      billingPeriod === 'annual' && styles.billingButtonTextActive
                    ]}>
                      Annual
                    </Text>
                    {selectedTierData.annualSavings && (
                      <Text style={styles.savingsTag}>{selectedTierData.annualSavings}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Pricing */}
              <View style={styles.pricingBox}>
                <Text style={styles.priceAmount}>{displayPrice}</Text>
                <Text style={styles.pricePeriod}>{displayPeriod}</Text>
                {billingPeriod === 'annual' && selectedTier !== 'free' && (
                  <Text style={styles.priceBreakdown}>
                    ({selectedTierData.priceMonthly}/month billed annually)
                  </Text>
                )}
              </View>

              {/* Features List */}
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>
                  {selectedTierData.name} Features:
                </Text>
                {selectedTierData.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Text style={styles.featureIcon}>
                      {feature.included ? '✅' : '❌'}
                    </Text>
                    <Text style={[
                      styles.featureText,
                      !feature.included && styles.featureTextDisabled
                    ]}>
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Upgrade Button (Only for Plus/Pro) */}
            {selectedTier !== 'free' && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => onUpgrade(selectedTier, billingPeriod)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.upgradeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade to {selectedTierData.name} - {displayPrice}
                    {billingPeriod === 'annual' ? '/yr' : '/mo'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Comparison Note */}
            <View style={styles.comparisonNote}>
              <Text style={styles.comparisonText}>
                💡 Tap each tier above to compare features
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: width - 40,
    maxWidth: 500,
    maxHeight: '90%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  fixedHeader: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22
  },

  // Tier Selector
  tierSelector: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 20,
    gap: 8
  },
  tierTab: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative'
  },
  tierTabSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#667EEA'
  },
  tierTabFree: {
    opacity: 0.8
  },
  tierIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  tierName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280'
  },
  tierNameSelected: {
    color: '#667EEA',
    fontWeight: 'bold'
  },
  tierBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  tierBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },

  // Tier Details
  tierDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  
  // Billing Toggle
  billingToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    gap: 4
  },
  billingButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative'
  },
  billingButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  billingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280'
  },
  billingButtonTextActive: {
    color: '#667EEA',
    fontWeight: 'bold'
  },
  savingsTag: {
    position: 'absolute',
    top: -6,
    right: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  
  pricingBox: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  priceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  pricePeriod: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  priceBreakdown: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic'
  },

  // Features
  featuresContainer: {
    marginTop: 8
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1
  },
  featureTextDisabled: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through'
  },

  // Buttons
  upgradeButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden'
  },
  upgradeGradient: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280'
  },

  // Comparison Note
  comparisonNote: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12
  },
  comparisonText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center'
  }
});

export default UpgradeModal;