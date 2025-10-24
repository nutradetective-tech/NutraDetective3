// components/StreakWidget.js
// Visual streak counter with fire emoji
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StreakWidget = ({ streakDays, longestStreak }) => {
  // Calculate next milestone
  const getNextMilestone = (streak) => {
    if (streak < 3) return { days: 3, xp: 50 };
    if (streak < 7) return { days: 7, xp: 100 };
    if (streak < 14) return { days: 14, xp: 200 };
    if (streak < 30) return { days: 30, xp: 500 };
    if (streak < 100) return { days: 100, xp: 2000 };
    return null; // Max streak reached
  };

  const nextMilestone = getNextMilestone(streakDays);
  
  return (
    <LinearGradient
      colors={['#F59E0B', '#EA580C']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {/* Fire Icon + Streak Count */}
      <View style={styles.streakMain}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{streakDays}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>
      </View>
      
      {/* Next Milestone */}
      {nextMilestone ? (
        <View style={styles.milestone}>
          <Text style={styles.milestoneText}>
            Next: {nextMilestone.days} days
          </Text>
          <Text style={styles.milestoneReward}>
            +{nextMilestone.xp} XP
          </Text>
        </View>
      ) : (
        <View style={styles.milestone}>
          <Text style={styles.milestoneText}>
            🏆 Max Streak!
          </Text>
          <Text style={styles.milestoneReward}>
            Record: {longestStreak}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  streakInfo: {
    alignItems: 'flex-start',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  milestone: {
    alignItems: 'flex-end',
  },
  milestoneText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 2,
  },
  milestoneReward: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default StreakWidget;