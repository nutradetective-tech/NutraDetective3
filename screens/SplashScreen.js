import React from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = ({ splashFadeAnim }) => {
  return (
    <LinearGradient
      colors={['#667EEA', '#764BA2']}
      style={styles.splashContainer}
    >
      <Animated.View style={[styles.splashContent, { opacity: splashFadeAnim }]}>
        <View style={styles.splashLogoContainer}>
          <View style={styles.splashIconWrapper}>
            <Image 
              source={require('../assets/images/logo.png')}
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.splashTitle}>NutraDetective</Text>
        <Text style={styles.splashTagline}>Uncover What's Really in Your Food</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogoContainer: {
    marginBottom: 30,
  },
  splashIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIcon: {
    fontSize: 60,
  },
  splashTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  splashTagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default SplashScreen;