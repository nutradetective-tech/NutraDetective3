import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AdhdAlertModal = ({
  visible,
  onClose,
  onUpgrade,
  adhdAdditives,
  isPremium,
}) => {
  if (!adhdAdditives || adhdAdditives.length === 0) return null;

  // Render for FREE users (upgrade prompt)
  if (!isPremium) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerFree}>
              <Text style={styles.iconLarge}>⚠️</Text>
              <Text style={styles.titleFree}>ADHD Additives Detected</Text>
            </View>

            <ScrollView style={styles.content}>
              <Text style={styles.countText}>
                This product contains {adhdAdditives.length} {adhdAdditives.length === 1 ? 'additive' : 'additives'} that may affect ADHD symptoms.
              </Text>

              <View style={styles.lockSection}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockTitle}>Unlock ADHD Alerts</Text>
                <Text style={styles.lockDescription}>
                  Get detailed warnings about additives linked to ADHD with Plus or Pro membership.
                </Text>
              </View>

              <View style={styles.tierCard}>
                <Text style={styles.tierName}>⭐ Detective Plus</Text>
                <Text style={styles.tierPrice}>$4.99/month or $49.99/year</Text>
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>✓ 25 scans per day</Text>
                  <Text style={styles.featureItem}>✓ ADHD additive alerts</Text>
                  <Text style={styles.featureItem}>✓ 100+ allergen detection</Text>
                  <Text style={styles.featureItem}>✓ 30-day history</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Continue Without Alerts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.upgradeButtonWrapper}
                onPress={onUpgrade}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.upgradeButton}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade to Plus →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Render for PREMIUM users (detailed alerts)
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerPremium}>
            <Text style={styles.iconLarge}>⚠️</Text>
            <Text style={styles.titlePremium}>ADHD ALERT</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.alertDescription}>
              This product contains additives linked to ADHD symptoms in children:
            </Text>

            {adhdAdditives.map((additive, index) => (
              <View key={index} style={styles.additiveCard}>
                <View style={styles.additiveHeader}>
                  <Text style={styles.riskIcon}>
                    {additive.severity === 'high' ? '🔴' : '🟡'}
                  </Text>
                  <View style={styles.additiveInfo}>
                    <Text style={styles.additiveName}>
                      {additive.name}
                    </Text>
                    <Text style={styles.additiveCode}>
                      {additive.code} • {additive.severity === 'high' ? 'High Risk' : 'Medium Risk'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.additiveDescription}>
                  {additive.healthImpact || additive.description}
                </Text>

                {additive.adhdEffects && (
                  <View style={styles.effectsList}>
                    <Text style={styles.effectsTitle}>May cause:</Text>
                    {additive.adhdEffects.map((effect, i) => (
                      <Text key={i} style={styles.effectItem}>• {effect}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <View style={styles.researchNote}>
              <Text style={styles.researchIcon}>📚</Text>
              <Text style={styles.researchText}>
                Based on Southampton Study (2007) and FDA research linking artificial colors to hyperactivity in children.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onClose}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  headerFree: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerPremium: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  iconLarge: {
    fontSize: 48,
    marginBottom: 8,
  },
  titleFree: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
  },
  titlePremium: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
  },
  content: {
    padding: 20,
  },
  countText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  lockSection: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  lockIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  lockDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#667EEA',
    marginBottom: 20,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667EEA',
    marginBottom: 4,
  },
  tierPrice: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#1A202C',
    lineHeight: 20,
  },
  alertDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 24,
  },
  additiveCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  additiveHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  riskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  additiveInfo: {
    flex: 1,
  },
  additiveName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  additiveCode: {
    fontSize: 13,
    color: '#64748B',
  },
  additiveDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  effectsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  effectsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  effectItem: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  researchNote: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  researchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  researchText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  closeButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  upgradeButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#667EEA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default AdhdAlertModal;