// screens/onboarding/AccountLoginScreen.js
// Step 4 of onboarding: Authentication with Facebook, Google, Email, or Guest

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
  AUTH_OPTIONS,
  AUTH_CONFIG,
  GUEST_LIMITATIONS,
} from '../../constants/onboarding';
import OnboardingService from '../../services/OnboardingService';
import { supabase } from '../../config/supabase';

const AccountLoginScreen = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update onboarding state
    OnboardingService.updateCurrentStep(ONBOARDING_STEPS.AUTH);
  }, []);

  const handleAuthOption = async (authType) => {
    if (loading) return;

    switch (authType) {
      case AUTH_OPTIONS.FACEBOOK:
        handleFacebookLogin();
        break;
      case AUTH_OPTIONS.GOOGLE:
        handleGoogleLogin();
        break;
      case AUTH_OPTIONS.EMAIL:
        handleEmailLogin();
        break;
      case AUTH_OPTIONS.GUEST:
        handleGuestContinue();
        break;
      default:
        break;
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    
    try {
      // TODO: Implement Facebook OAuth with Supabase
      // For now, show coming soon message
      Alert.alert(
        '🚧 Coming Soon',
        'Facebook login is currently being implemented!\n\nFor now, please use:\n• Email login\n• Guest mode',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Error', 'Failed to login with Facebook. Please try another method.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // TODO: Implement Google OAuth with Supabase
      // For now, show coming soon message
      Alert.alert(
        '🚧 Coming Soon',
        'Google login is currently being implemented!\n\nFor now, please use:\n• Email login\n• Guest mode',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Failed to login with Google. Please try another method.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    // TODO: Navigate to email signup/login screen
    // For now, show placeholder
    Alert.alert(
      '📧 Email Sign Up',
      'Email authentication is ready!\n\nThis will open your existing AuthScreen.\n\nFor testing, try Guest mode first.',
      [{ text: 'OK' }]
    );
  };

  const handleGuestContinue = () => {
    Alert.alert(
      '👤 Continue as Guest?',
      'Guest accounts have limitations:\n\n' + 
      GUEST_LIMITATIONS.map(limitation => `• ${limitation}`).join('\n') + 
      '\n\nYou can connect your account anytime later.',
      [
        { text: 'Go Back', style: 'cancel' },
        {
          text: 'Continue as Guest',
          style: 'default',
          onPress: async () => {
            setLoading(true);
            
            try {
              // Complete onboarding as guest
              const result = await OnboardingService.completeAuthStep(AUTH_OPTIONS.GUEST);
              
              if (result.success) {
                console.log('✅ Guest user initialized successfully');
                
                // Animate out and complete
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => {
                  onComplete();
                });
              } else {
                Alert.alert('Error', result.error || 'Failed to initialize guest account');
              }
            } catch (error) {
              console.error('Guest initialization error:', error);
              Alert.alert('Error', 'Failed to create guest account. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderAuthButton = (authType) => {
    const config = AUTH_CONFIG[authType];
    const isGuest = authType === AUTH_OPTIONS.GUEST;

    return (
      <TouchableOpacity
        key={authType}
        style={[
          styles.authButton,
          isGuest && styles.authButtonGuest,
        ]}
        onPress={() => handleAuthOption(authType)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={styles.authButtonContent}>
          {/* Icon Circle */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isGuest ? '#F3F4F6' : '#F7FAFC' },
            ]}
          >
            <Text style={styles.iconText}>{config.icon}</Text>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Text style={styles.authButtonTitle}>{config.name}</Text>
            <Text style={styles.authButtonSubtitle}>{config.subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={ONBOARDING_PROGRESS[ONBOARDING_STEPS.AUTH]} />
        </View>

        {/* Scrollable Content */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.icon}>💾</Text>
              <Text style={styles.title}>Save Your Progress Forever</Text>
              <Text style={styles.description}>
                Connect now to never lose your data
              </Text>
            </View>

            {/* Auth Buttons */}
            <View style={styles.authButtonsContainer}>
              {renderAuthButton(AUTH_OPTIONS.FACEBOOK)}
              {renderAuthButton(AUTH_OPTIONS.GOOGLE)}
              {renderAuthButton(AUTH_OPTIONS.EMAIL)}
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Option */}
            {renderAuthButton(AUTH_OPTIONS.GUEST)}

            {/* Guest Warning */}
            <View style={styles.guestWarning}>
              <View style={styles.warningHeader}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningTitle}>Guest Account Limitations</Text>
              </View>
              <View style={styles.warningList}>
                {GUEST_LIMITATIONS.map((limitation, index) => (
                  <View key={index} style={styles.warningItem}>
                    <Text style={styles.warningBullet}>⚠️</Text>
                    <Text style={styles.warningText}>{limitation}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Footer Note */}
            <Text style={styles.footerNote}>
              You can connect your account anytime to unlock full features and save your progress forever.
            </Text>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </Animated.View>
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
    paddingTop: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  icon: {
    fontSize: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  authButtonsContainer: {
    marginBottom: 25,
  },
  authButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  authButtonGuest: {
    backgroundColor: '#F8FAFC',
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  authButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 20,
  },
  textContent: {
    flex: 1,
  },
  authButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 3,
  },
  authButtonSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  dividerText: {
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  guestWarning: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 12,
    padding: 14,
    marginTop: 15,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  warningList: {
    marginTop: 8,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3,
  },
  warningBullet: {
    fontSize: 10,
    marginRight: 8,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    fontWeight: '500',
    lineHeight: 18,
  },
  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default AccountLoginScreen;