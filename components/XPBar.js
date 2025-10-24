// components/XPBar.js
// Visual XP progress bar with rank display
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const XPBar = ({ xp, level, xpForNextLevel, levelProgress, totalScans }) => {
  // Rank names based on level
  const getRankInfo = (level) => {
    if (level >= 20) return { name: 'Legend Detective', icon: '🔥', color: ['#F59E0B', '#EA580C'] };
    if (level >= 15) return { name: 'Master Detective', icon: '👑', color: ['#8B5CF6', '#7C3AED'] };
    if (level >= 10) return { name: 'Elite Detective', icon: '💎', color: ['#06B6D4', '#0891B2'] };
    if (level >= 5) return { name: 'Veteran Detective', icon: '⭐', color: ['#667EEA', '#764BA2'] };
    return { name: 'Rookie Detective', icon: '🔰', color: ['#667EEA', '#764BA2'] };
  };

  const rankInfo = getRankInfo(level);
  const progress = levelProgress || 0;
  const progressPercent = Math.round(progress * 100);
  
  // Calculate XP in current level
  const xpInLevel = xpForNextLevel 
    ? Math.round(progress * (xpForNextLevel || 100))
    : xp;
  
  return (
    <View style={styles.container}>
      {/* Rank Badge + XP Count */}
      <View style={styles.header}>
        <LinearGradient
          colors={rankInfo.color}
          style={styles.rankBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.rankIcon}>{rankInfo.icon}</Text>
          <Text style={styles.rankName}>{rankInfo.name}</Text>
        </LinearGradient>
        
        <View style={styles.xpInfo}>
          <Text style={styles.xpCount}>{xp.toLocaleString()}</Text>
          <Text style={styles.xpLabel}>XP</Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={rankInfo.color}
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
      
      {/* Progress Text */}
      <Text style={styles.progressText}>
        {xpForNextLevel 
          ? `${progressPercent}% to Level ${level + 1} • ${xpForNextLevel - xpInLevel} XP to go!`
          : `Level ${level} • Max Level Reached! 🌟`
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 15,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rankIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  rankName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667EEA',
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default XPBar;