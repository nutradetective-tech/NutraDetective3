// screens/onboarding/NameInputScreen.js
// Step 2 of onboarding: Name/nickname input with validation

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from '../../components/ProgressBar';
import { ONBOARDING_STEPS, ONBOARDING_PROGRESS } from '../../constants/onboarding';
import OnboardingService from '../../services/OnboardingService';
import UserSettingsService from '../../services/UserSettingsService';

const NameInputScreen = ({ onNext, onBack }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update onboarding state
    OnboardingService.updateCurrentStep(ONBOARDING_STEPS.NAME);

    // Load existing name if any
    loadExistingName();
  }, []);

  const loadExistingName = async () => {
    const state = await OnboardingService.getOnboardingState();
    if (state.userName) {
      setName(state.userName);
    }
  };

  const handleContinue = async () => {
    // Validate name
    const validation = OnboardingService.validateName(name);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Clear any errors
    setError('');

    // Save name to onboarding state
    const result = await OnboardingService.saveUserName(validation.name);
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to save name');
      return;
    }

    // Also save to user settings for immediate use
    await UserSettingsService.updateUserName(validation.name);

    // Animate out and proceed
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onNext();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Progress Bar */}
          <ProgressBar progress={ONBOARDING_PROGRESS[ONBOARDING_STEPS.NAME]} />

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>What should we call you?</Text>
              <Text style={styles.description}>
                Choose a name or nickname for your profile
              </Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={[
                  styles.input,
                  error ? styles.inputError : null,
                ]}
                placeholder="Enter your name..."
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError(''); // Clear error on type
                }}
                autoFocus
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
              
              {/* Error Message */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {/* Hint Box */}
              <View style={styles.hintBox}>
                <Text style={styles.hintIcon}>💡</Text>
                <Text style={styles.hintText}>
                  This appears on leaderboards if you choose Game Mode
                </Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !name.trim() ? styles.continueButtonDisabled : null,
            ]}
            onPress={handleContinue}
            disabled={!name.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={name.trim() ? ['#667EEA', '#764BA2'] : ['#CBD5E1', '#94A3B8']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
  },
  titleSection: {
    marginTop: 30,
    marginBottom: 40,
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
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#667EEA',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  hintIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: '#667EEA',
    fontWeight: '500',
    lineHeight: 20,
  },
  continueButton: {
    width: '100%',
    marginBottom: 30,
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

export default NameInputScreen;