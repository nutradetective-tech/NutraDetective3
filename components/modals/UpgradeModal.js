// components/modals/UpgradeModal.js
import React from 'react';
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
  
  const reasons = {
    scans: {
      title: '🚫 Daily Scan Limit Reached',
      message: "You've used all 7 free scans today!",
      cta: 'Upgrade for unlimited scans'
    },
    history: {
      title: '📚 History Limit',
      message: 'Free users can only view the last 30 days of scan history.',
      cta: 'Upgrade to keep all your scans forever'
    },
    general: {
      title: '⭐ Upgrade to Guardian',
      message: 'Unlock the full NutraDetective experience',
      cta: 'See all premium features'
    }
  };

  const content = reasons[reason] || reasons.general;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{content.title}</Text>
              <Text style={styles.message}>{content.message}</Text>
            </View>

            {/* Guardian Badge */}
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.badge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.badgeText}>👑 GUARDIAN</Text>
              </LinearGradient>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Guardian Benefits:</Text>
              
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Unlimited scans per day</Text>
              </View>

              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Unlimited scan history (keep forever)</Text>
              </View>

              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>No ads - clean experience</Text>
              </View>

              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Smart shopping alternatives</Text>
              </View>

              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>Priority support</Text>
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.pricingContainer}>
              <View style={styles.priceOption}>
                <Text style={styles.pricePeriod}>Monthly</Text>
                <Text style={styles.priceAmount}>$6.99</Text>
                <Text style={styles.priceDetail}>per month</Text>
              </View>

              <View style={[styles.priceOption, styles.popularOption]}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>BEST VALUE</Text>
                </View>
                <Text style={styles.pricePeriod}>Yearly</Text>
                <Text style={styles.priceAmount}>$69</Text>
                <Text style={styles.priceDetail}>per year</Text>
                <Text style={styles.savings}>Save 17%</Text>
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={onUpgrade}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.upgradeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.upgradeButtonText}>{content.cta}</Text>
              </LinearGradient>
            </TouchableOpacity>

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
  header: {
    alignItems: 'center',
    marginBottom: 20
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
  badgeContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  badge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20
  },
  badgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  featuresContainer: {
    marginVertical: 20
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 12
  },
  priceOption: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  popularOption: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1'
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  pricePeriod: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 4
  },
  priceDetail: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  savings: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 4
  },
  upgradeButton: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden'
  },
  upgradeGradient: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  upgradeButtonText: {
    fontSize: 18,
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
  }
});

export default UpgradeModal;