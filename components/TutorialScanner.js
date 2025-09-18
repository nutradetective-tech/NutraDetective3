import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const TutorialScanner = ({ onScanResult, onClose }) => {
  const [countdown, setCountdown] = useState(3);
  const [isScanning, setIsScanning] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Nutella barcode for demo
  const DEMO_BARCODE = '3017620422003';
  const DEMO_PRODUCT = 'Nutella';

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          startScanning();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      // Auto-submit after animation
      setTimeout(() => {
        onScanResult(DEMO_BARCODE);
      }, 500);
    });
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tutorial Mode</Text>
          <Text style={styles.headerSubtitle}>
            Watch how NutraDetective works with a real product
          </Text>
        </View>

        {/* Demo Card */}
        <View style={styles.demoCard}>
          <Animated.View
            style={[
              styles.productIcon,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={styles.productEmoji}>🍫</Text>
          </Animated.View>

          <Text style={styles.productName}>{DEMO_PRODUCT}</Text>
          <Text style={styles.productDesc}>Popular hazelnut spread</Text>

          {/* Barcode Display */}
          <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeLabel}>Demo Barcode:</Text>
            <Text style={styles.barcodeNumber}>{DEMO_BARCODE}</Text>
          </View>

          {/* Status */}
          {!isScanning ? (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Auto-scanning in</Text>
              <Text style={styles.countdownNumber}>{countdown}</Text>
            </View>
          ) : (
            <View style={styles.scanningContainer}>
              <Text style={styles.scanningText}>🔍 Scanning {DEMO_PRODUCT}...</Text>
              
              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              
              <Text style={styles.scanningHint}>
                This is what happens when you scan a real product!
              </Text>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            No typing needed! We're automatically scanning this product{'\n'}
            to show you exactly how the app works.
          </Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip Tutorial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  demoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  productIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  productEmoji: {
    fontSize: 60,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  barcodeContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  barcodeLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  barcodeNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#667EEA',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#667EEA',
  },
  scanningContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667EEA',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#48C774',
    borderRadius: 4,
  },
  scanningHint: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
  },
});

export default TutorialScanner;