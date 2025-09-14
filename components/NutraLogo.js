import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

// Logo with gradient - multiple size options
export const NutraLogo = ({ size = 'medium', showText = true, style }) => {
  const sizes = {
    small: { icon: 24, text: 14, container: 100 },
    medium: { icon: 32, text: 18, container: 150 },
    large: { icon: 48, text: 24, container: 200 },
    xlarge: { icon: 64, text: 32, container: 250 }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <View style={[styles.logoContainer, style]}>
      {/* Magnifying Glass Icon with Gradient Background */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={[
          styles.iconContainer,
          {
            width: currentSize.icon * 1.5,
            height: currentSize.icon * 1.5,
            borderRadius: currentSize.icon * 0.75,
          }
        ]}
      >
        <Text style={{ fontSize: currentSize.icon }}>🔍</Text>
      </LinearGradient>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.logoText, { fontSize: currentSize.text }]}>
            <Text style={styles.nutraText}>Nutra</Text>
            <Text style={styles.detectiveText}>Detective</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

// Splash Screen Logo - Centered with animation support
export const SplashLogo = ({ animated = false }) => {
  return (
    <LinearGradient
      colors={['#667EEA', '#764BA2']}
      style={styles.splashContainer}
    >
      <View style={styles.splashContent}>
        <View style={styles.splashIconContainer}>
          <Text style={styles.splashIcon}>🔍</Text>
        </View>
        <Text style={styles.splashTitle}>NutraDetective</Text>
        <Text style={styles.splashTagline}>Uncover What's Really in Your Food</Text>
      </View>
    </LinearGradient>
  );
};

// Header Logo - Horizontal layout for app header
export const HeaderLogo = ({ style }) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.headerIconContainer}
      >
        <Text style={styles.headerIcon}>🔍</Text>
      </LinearGradient>
      <Text style={styles.headerText}>
        <Text style={styles.headerNutra}>Nutra</Text>
        <Text style={styles.headerDetective}>Detective</Text>
      </Text>
    </View>
  );
};

// App Icon Style Logo - For profile avatars, etc
export const AppIconLogo = ({ size = 60 }) => {
  return (
    <LinearGradient
      colors={['#667EEA', '#764BA2']}
      style={[
        styles.appIcon,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22, // iOS app icon corner radius
        }
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>🔍</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Basic Logo
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'row',
  },
  logoText: {
    fontWeight: '800',
  },
  nutraText: {
    color: '#667EEA',
  },
  detectiveText: {
    color: '#764BA2',
  },

  // Splash Screen Logo
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  splashIcon: {
    fontSize: 64,
  },
  splashTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  splashTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Header Logo
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerNutra: {
    color: '#667EEA',
  },
  headerDetective: {
    color: '#764BA2',
  },

  // App Icon
  appIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default NutraLogo;