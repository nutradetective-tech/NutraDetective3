import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [showTutorialPrompt, setShowTutorialPrompt] = useState(false);

  useEffect(() => {
    // Animate content in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartScanning = async () => {
    // Show tutorial prompt
    setShowTutorialPrompt(true);
  };

  const startTutorial = async () => {
    console.log('Starting tutorial mode...');
    // Mark onboarding as complete
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    await AsyncStorage.setItem('onboardingCompletedAt', new Date().toISOString());
    await AsyncStorage.setItem('isTutorialMode', 'true');
    
    // Start tutorial with auto scanner
    if (onComplete && typeof onComplete === 'function') {
      onComplete('tutorial');
    } else {
      console.error('onComplete is not a function:', onComplete);
    }
  };

  const skipTutorial = async () => {
    console.log('Skipping tutorial...');
    // Mark onboarding as complete but skip tutorial
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    await AsyncStorage.setItem('onboardingCompletedAt', new Date().toISOString());
    await AsyncStorage.setItem('isTutorialMode', 'false');
    
    // Go to regular scanning
    if (onComplete && typeof onComplete === 'function') {
      onComplete('camera');
    } else {
      console.error('onComplete is not a function:', onComplete);
    }
  };

  if (showTutorialPrompt) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View style={[styles.tutorialContainer, { opacity: fadeAnim }]}>
          <Text style={styles.tutorialIcon}>📚</Text>
          <Text style={styles.tutorialHeadline}>Let's Practice First!</Text>
          <Text style={styles.tutorialDescription}>
            We'll walk you through scanning a sample product{'\n'}
            so you can see exactly how NutraDetective works.
          </Text>
          
          <View style={styles.demoProductCard}>
            <Text style={styles.demoEmoji}>🍫</Text>
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>Demo Product: Nutella</Text>
              <Text style={styles.demoBarcode}>Barcode: 3017620422003</Text>
              <Text style={styles.demoNote}>This is a real product we'll use for practice</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={startTutorial}>
            <LinearGradient
              colors={['#48C774', '#3ABF68']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Start Tutorial</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={skipTutorial}>
            <Text style={styles.secondaryButtonText}>Skip Tutorial (I'm experienced)</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.visualContainer}>
          <View style={styles.productCard}>
            <Text style={styles.productEmoji}>🥤</Text>
            <View style={styles.gradeCircle}>
              <Text style={styles.gradeText}>F</Text>
            </View>
          </View>
          <Text style={styles.productName}>Popular "Healthy" Drink</Text>
        </View>

        <Text style={styles.headline}>
          That "Healthy" Snack?{'\n'}It's Actually an <Text style={styles.emphasisF}>F</Text>
        </Text>

        <Text style={styles.subheadline}>
          Scan any product barcode and instantly{'\n'}
          see its true health grade
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3M+</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>A-F</Text>
            <Text style={styles.statLabel}>Grades</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>2 sec</Text>
            <Text style={styles.statLabel}>Results</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleStartScanning}
        >
          <LinearGradient
            colors={['#48C774', '#3ABF68']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomIndicator}>
        <View style={styles.dot} />
        <Text style={styles.skipText}>One-time setup</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center',
  },
  tutorialIcon: {
    fontSize: 60,
    marginBottom: 24,
  },
  tutorialHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  tutorialDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  demoProductCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  demoEmoji: {
    fontSize: 50,
    marginRight: 16,
  },
  demoInfo: {
    flex: 1,
  },
  demoTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  demoBarcode: {
    color: '#48C774',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
  demoNote: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  visualContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  productCard: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  productEmoji: {
    fontSize: 60,
  },
  gradeCircle: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF3737',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  gradeText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  emphasisF: {
    color: '#FF3737',
    fontSize: 36,
  },
  subheadline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  primaryButton: {
    width: '100%',
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomIndicator: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
});

export default OnboardingScreen;