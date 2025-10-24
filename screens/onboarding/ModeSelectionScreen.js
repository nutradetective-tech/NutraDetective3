// screens/onboarding/ModeSelectionScreen.js
// Step 3 of onboarding: Choose Game Mode or Educational Mode

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from '../../components/ProgressBar';
import {
  ONBOARDING_STEPS,
  ONBOARDING_PROGRESS,
  MODES,
  MODE_CONFIG,
} from '../../constants/onboarding';
import OnboardingService from '../../services/OnboardingService';

const ModeSelectionScreen = ({ onNext, onBack }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim1 = useRef(new Animated.Value(0.95)).current;
  const scaleAnim2 = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim1, {
        toValue: 1,
        delay: 100,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim2, {
        toValue: 1,
        delay: 200,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Update onboarding state
    OnboardingService.updateCurrentStep(ONBOARDING_STEPS.MODE);

    // Load existing selection if any
    loadExistingMode();
  }, []);

  const loadExistingMode = async () => {
    const state = await OnboardingService.getOnboardingState();
    if (state.selectedMode) {
      setSelectedMode(state.selectedMode);
    }
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleContinue = async () => {
    if (!selectedMode) {
      Alert.alert('Select a Mode', 'Please choose Game Mode or Educational Mode to continue.');
      return;
    }

    // Save selected mode
    const result = await OnboardingService.saveSelectedMode(selectedMode);
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to save mode');
      return;
    }

    console.log('✅ Mode selected:', selectedMode);

    // Animate out and proceed
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onNext();
    });
  };

  const renderModeCard = (mode, animValue) => {
    const config = MODE_CONFIG[mode];
    const isSelected = selectedMode === mode;

    return (
      <Animated.View
        style={[
          styles.modeCardWrapper,
          { transform: [{ scale: animValue }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.modeCard,
            isSelected && styles.modeCardSelected,
          ]}
          onPress={() => handleModeSelect(mode)}
          activeOpacity={0.7}
        >
          {/* Header */}
          <View style={styles.modeHeader}>
            <Text style={styles.modeIcon}>{config.icon}</Text>
            <Text style={styles.modeTitle}>{config.name}</Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {config.features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Best For Section */}
          <View style={styles.bestForContainer}>
            <Text style={styles.bestForLabel}>PERFECT FOR</Text>
            <Text style={styles.bestForText}>{config.bestFor}</Text>
          </View>

          {/* Select Button */}
          {isSelected ? (
            <View style={styles.selectedBadge}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.selectedBadgeGradient}
              >
                <Text style={styles.selectedBadgeText}>✓ Selected</Text>
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select This Mode</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={ONBOARDING_PROGRESS[ONBOARDING_STEPS.MODE]} />
        </View>

        {/* Scrollable Content */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Choose Your Experience</Text>
              <Text style={styles.description}>
                Pick the mode that fits your style
              </Text>
            </View>

            {/* Game Mode Card */}
            {renderModeCard(MODES.GAME, scaleAnim1)}

            {/* Educational Mode Card */}
            {renderModeCard(MODES.EDUCATIONAL, scaleAnim2)}

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                ⚡ Both modes show the SAME health information!{'\n'}
                Only the presentation differs.
              </Text>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </Animated.View>

        {/* Continue Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedMode ? styles.continueButtonDisabled : null,
            ]}
            onPress={handleContinue}
            disabled={!selectedMode}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedMode ? ['#667EEA', '#764BA2'] : ['#CBD5E1', '#94A3B8']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  modeCardWrapper: {
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  modeCardSelected: {
    borderColor: '#667EEA',
    shadowColor: '#667EEA',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modeIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A202C',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  featureBullet: {
    color: '#667EEA',
    fontSize: 20,
    fontWeight: '900',
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
    lineHeight: 22,
  },
  bestForContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  bestForLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667EEA',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bestForText: {
    fontSize: 14,
    color: '#1A202C',
    fontWeight: '600',
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: '#667EEA',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#667EEA',
    fontSize: 16,
    fontWeight: '700',
  },
  selectedBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedBadgeGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  infoBannerText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 21,
  },
  bottomSpacing: {
    height: 20,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    backgroundColor: '#F7FAFC',
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ModeSelectionScreen;