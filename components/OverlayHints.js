import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OverlayHints = ({ 
  currentScreen, 
  onDismiss,
  isTutorial = false,
  targetElements = {} 
}) => {
  const [currentHint, setCurrentHint] = useState(0);
  const [hasSeenHints, setHasSeenHints] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Define hints based on screen
  const hints = {
    tutorial_scanner: [
      {
        text: "Type this barcode: 3017620422003", // FIXED: Nutella barcode
        position: { top: height / 2 - 100 },
        arrow: 'down',
        delay: 1000
      }
    ],
    results: [
      {
        text: "This grade shows overall healthiness",
        position: { 
          top: height * 0.25,  // Adjusted for where grade actually appears
          alignSelf: 'center',
        },
        highlightPosition: {
          top: height * 0.12,  // Circle around the grade
          left: width / 2 - 40,  // Center the highlight
        },
        arrow: 'down',
        delay: 1500
      },
      {
        text: "Check for allergens and warnings here",
        position: { 
          top: height * 0.48,  // Middle of screen where warnings show
          alignSelf: 'center',
        },
        highlightPosition: {
          top: height * 0.40,  // Highlight the warnings section
          left: 20,
          right: 20,
          width: width - 40,
        },
        arrow: 'down',
        delay: 4500
      },
      {
        text: "Save products you scan often",
        position: { 
          bottom: height * 0.22,  // Above the action buttons
          alignSelf: 'center',
        },
        highlightPosition: {
          bottom: height * 0.15,  // Highlight save button area
          left: 20,
          width: (width - 50) / 2,  // Half width for left button
        },
        arrow: 'down',
        delay: 7500
      }
    ]
  };

  useEffect(() => {
    checkIfSeenBefore();
  }, []);

  useEffect(() => {
    // In tutorial mode, always show hints. Otherwise check if seen before.
    if ((isTutorial || !hasSeenHints) && hints[currentScreen]) {
      showHintSequence();
    }
  }, [currentScreen, hasSeenHints, isTutorial]);

  const checkIfSeenBefore = async () => {
    if (!isTutorial) {
      const seen = await AsyncStorage.getItem('hasSeenTutorialHints');
      setHasSeenHints(seen === 'true');
    }
  };

  const showHintSequence = () => {
    const screenHints = hints[currentScreen];
    if (!screenHints || screenHints.length === 0) return;

    // Animate in first hint with delay
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, screenHints[0].delay || 1000);

    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-advance through hints with longer delays
    screenHints.forEach((hint, index) => {
      if (index > 0) {
        setTimeout(() => {
          setCurrentHint(index);
        }, hint.delay);
      }
    });

    // Auto-dismiss after last hint (with extra time)
    const totalDelay = screenHints[screenHints.length - 1]?.delay || (screenHints.length * 3000);
    setTimeout(() => {
      if (!isTutorial) {  // Don't auto-dismiss in tutorial mode
        handleDismiss();
      }
    }, totalDelay + 3000);  // Increased from 2000ms
  };

  const handleDismiss = async () => {
    if (!isTutorial) {
      await AsyncStorage.setItem('hasSeenTutorialHints', 'true');
    }
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!isTutorial && hasSeenHints) {
    return null;
  }
  
  if (!hints[currentScreen]) {
    return null;
  }

  const currentHintData = hints[currentScreen][currentHint];
  if (!currentHintData) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { opacity: fadeAnim }
      ]}
      pointerEvents="box-none"
    >
      {/* Semi-transparent background for better visibility */}
      <View style={styles.dimBackground} pointerEvents="none" />

      {/* Pulsing highlight circle - positioned separately from bubble */}
      {currentHintData.highlightPosition && (
        <Animated.View
          style={[
            styles.highlight,
            currentHintData.highlightPosition,
            {
              transform: [{ scale: pulseAnim }]
            }
          ]}
          pointerEvents="none"
        />
      )}

      {/* Hint bubble - positioned independently */}
      <View style={[styles.hintBubble, currentHintData.position]}>
        <Text style={styles.hintText}>{currentHintData.text}</Text>
        
        {/* Arrow pointer */}
        <View style={[
          styles.arrow,
          currentHintData.arrow === 'up' ? styles.arrowUp : styles.arrowDown
        ]} />
      </View>

      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        {hints[currentScreen].map((_, index) => (
          <View 
            key={index}
            style={[
              styles.progressDot,
              index === currentHint && styles.progressDotActive
            ]}
          />
        ))}
      </View>

      {/* Skip/Next button */}
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleDismiss}
      >
        <Text style={styles.skipText}>
          {isTutorial ? 'Got it!' : 'Skip'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  dimBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  highlight: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#48C774',
    backgroundColor: 'rgba(72, 199, 116, 0.2)',
  },
  hintBubble: {
    position: 'absolute',
    backgroundColor: '#48C774',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    maxWidth: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  hintText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    alignSelf: 'center',
  },
  arrowUp: {
    bottom: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#48C774',
  },
  arrowDown: {
    top: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#48C774',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressDotActive: {
    backgroundColor: '#48C774',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OverlayHints;