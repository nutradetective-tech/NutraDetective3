// services/GamificationService.js
// NutraDetective Gamification System
// XP, Levels, Badges, Streaks, Achievements
// Version 1.0

import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== STORAGE KEYS =====
const GAMIFICATION_KEY = 'gamification_data';
const DAILY_XP_KEY = 'daily_xp_tracker';

// ===== XP RULES =====
const XP_RULES = {
  // Scanning actions
  SCAN_PRODUCT: 10,
  FIRST_SCAN_OF_DAY: 25,
  SCAN_NEW_BRAND: 15,
  SCAN_NEW_CATEGORY: 20,
  
  // Health-based rewards
  SCAN_A_GRADE: 30,
  SCAN_B_GRADE: 20,
  SCAN_C_GRADE: 10,
  SCAN_D_GRADE: 5,
  SCAN_F_GRADE: 5,
  
  // Healthy choices
  CHOOSE_HEALTHIER: 50, // When user picks healthier alternative
  AVOID_ALLERGEN: 25,
  AVOID_HARMFUL_ADDITIVE: 30,
  
  // Streaks
  STREAK_3_DAYS: 50,
  STREAK_7_DAYS: 100,
  STREAK_14_DAYS: 200,
  STREAK_30_DAYS: 500,
  STREAK_100_DAYS: 2000,
  
  // Milestones
  MILESTONE_10_SCANS: 100,
  MILESTONE_50_SCANS: 250,
  MILESTONE_100_SCANS: 500,
  MILESTONE_500_SCANS: 2000,
  MILESTONE_1000_SCANS: 5000,
  
  // Social
  SHARE_SCAN: 15,
  INVITE_FRIEND: 100,
  
  // Premium
  UPGRADE_TO_PLUS: 200,
  UPGRADE_TO_PRO: 500,
};

// ===== LEVEL SYSTEM =====
// XP required for each level (exponential curve)
const LEVEL_XP_REQUIREMENTS = [
  0,      // Level 1 (start)
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1400,   // Level 7
  1900,   // Level 8
  2500,   // Level 9
  3200,   // Level 10
  4000,   // Level 11
  5000,   // Level 12
  6200,   // Level 13
  7600,   // Level 14
  9200,   // Level 15
  11000,  // Level 16
  13000,  // Level 17
  15300,  // Level 18
  17900,  // Level 19
  20800,  // Level 20
  24000,  // Level 21
  27600,  // Level 22
  31600,  // Level 23
  36000,  // Level 24
  40800,  // Level 25
  46000,  // Level 26
  51800,  // Level 27
  58200,  // Level 28
  65200,  // Level 29
  72800,  // Level 30
  81000,  // Level 31
  90000,  // Level 32
  99800,  // Level 33
  110400, // Level 34
  121800, // Level 35
  134000, // Level 36
  147200, // Level 37
  161400, // Level 38
  176600, // Level 39
  193000, // Level 40
  210600, // Level 41
  229400, // Level 42
  249600, // Level 43
  271200, // Level 44
  294200, // Level 45
  318800, // Level 46
  345000, // Level 47
  372800, // Level 48
  402400, // Level 49
  433800, // Level 50
];

// ===== BADGE DEFINITIONS =====
const BADGES = {
  // Scanning Badges
  FIRST_SCAN: {
    id: 'first_scan',
    name: 'First Scan',
    description: 'Complete your first product scan',
    emoji: '🎯',
    category: 'scanning',
    requirement: 1,
    xpReward: 50,
  },
  SCANNER_10: {
    id: 'scanner_10',
    name: 'Scanner Novice',
    description: 'Scan 10 products',
    emoji: '📱',
    category: 'scanning',
    requirement: 10,
    xpReward: 100,
  },
  SCANNER_50: {
    id: 'scanner_50',
    name: 'Scanner Pro',
    description: 'Scan 50 products',
    emoji: '📊',
    category: 'scanning',
    requirement: 50,
    xpReward: 250,
  },
  SCANNER_100: {
    id: 'scanner_100',
    name: 'Scanner Expert',
    description: 'Scan 100 products',
    emoji: '🏆',
    category: 'scanning',
    requirement: 100,
    xpReward: 500,
  },
  SCANNER_500: {
    id: 'scanner_500',
    name: 'Scanner Master',
    description: 'Scan 500 products',
    emoji: '👑',
    category: 'scanning',
    requirement: 500,
    xpReward: 2000,
  },
  SCANNER_1000: {
    id: 'scanner_1000',
    name: 'Scanner Legend',
    description: 'Scan 1000 products',
    emoji: '🌟',
    category: 'scanning',
    requirement: 1000,
    xpReward: 5000,
  },
  
  // Healthy Choice Badges
  HEALTHY_10: {
    id: 'healthy_10',
    name: 'Health Seeker',
    description: 'Scan 10 products with A grade',
    emoji: '🥗',
    category: 'healthy',
    requirement: 10,
    xpReward: 150,
  },
  HEALTHY_50: {
    id: 'healthy_50',
    name: 'Health Warrior',
    description: 'Scan 50 products with A grade',
    emoji: '💪',
    category: 'healthy',
    requirement: 50,
    xpReward: 500,
  },
  
  // Streak Badges
  STREAK_3: {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Scan products 3 days in a row',
    emoji: '🔥',
    category: 'streak',
    requirement: 3,
    xpReward: 50,
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Scan products 7 days in a row',
    emoji: '🔥🔥',
    category: 'streak',
    requirement: 7,
    xpReward: 100,
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Scan products 30 days in a row',
    emoji: '🔥🔥🔥',
    category: 'streak',
    requirement: 30,
    xpReward: 500,
  },
  STREAK_100: {
    id: 'streak_100',
    name: 'Century Streak',
    description: 'Scan products 100 days in a row',
    emoji: '⚡',
    category: 'streak',
    requirement: 100,
    xpReward: 2000,
  },
  
  // Exploration Badges
  EXPLORER_5: {
    id: 'explorer_5',
    name: 'Category Explorer',
    description: 'Scan products from 5 different categories',
    emoji: '🗺️',
    category: 'exploration',
    requirement: 5,
    xpReward: 100,
  },
  EXPLORER_20: {
    id: 'explorer_20',
    name: 'Brand Collector',
    description: 'Scan products from 20 different brands',
    emoji: '🏷️',
    category: 'exploration',
    requirement: 20,
    xpReward: 200,
  },
  
  // Special Badges
  EARLY_ADOPTER: {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join NutraDetective in the first month',
    emoji: '🚀',
    category: 'special',
    requirement: 1,
    xpReward: 500,
  },
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Scan 10+ products on a weekend',
    emoji: '🎉',
    category: 'special',
    requirement: 10,
    xpReward: 100,
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Scan a product after midnight',
    emoji: '🦉',
    category: 'special',
    requirement: 1,
    xpReward: 50,
  },
};

// ===== DEFAULT GAMIFICATION DATA =====
const DEFAULT_GAMIFICATION_DATA = {
  xp: 0,
  level: 1,
  totalScans: 0,
  healthyScans: 0, // A or B grade
  streakDays: 0,
  lastScanDate: null,
  longestStreak: 0,
  
  // Badge tracking
  unlockedBadges: [],
  badgeProgress: {},
  
  // Stats tracking
  categoriesScanned: [],
  brandsScanned: [],
  gradesHistory: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  
  // Milestones
  firstScanDate: null,
  
  // Daily tracking
  lastXpResetDate: null,
  dailyXpEarned: 0,
  
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

class GamificationService {
  
  // ===== INITIALIZATION =====
  
  /**
   * Get current gamification data
   */
  static async getData() {
    try {
      const data = await AsyncStorage.getItem(GAMIFICATION_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      // Initialize new data
      const newData = { ...DEFAULT_GAMIFICATION_DATA };
      await this.saveData(newData);
      return newData;
    } catch (error) {
      console.error('❌ Error loading gamification data:', error);
      return { ...DEFAULT_GAMIFICATION_DATA };
    }
  }
  
  /**
   * Save gamification data
   */
  static async saveData(data) {
    try {
      data.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('❌ Error saving gamification data:', error);
      return false;
    }
  }
  
  // ===== XP & LEVELING =====
  
  /**
   * Award XP to user
   * @param {number} xpAmount - Amount of XP to award
   * @param {string} reason - Reason for XP (for logging)
   * @returns {Promise<{levelUp: boolean, newLevel: number, badgesUnlocked: array}>}
   */
  static async awardXP(xpAmount, reason = 'Unknown') {
    try {
      const data = await this.getData();
      const oldLevel = data.level;
      const oldXP = data.xp;
      
      // Add XP
      data.xp += xpAmount;
      data.dailyXpEarned += xpAmount;
      
      console.log(`⭐ +${xpAmount} XP earned for: ${reason}`);
      console.log(`   Total XP: ${oldXP} → ${data.xp}`);
      
      // Check for level up
      const newLevel = this.calculateLevel(data.xp);
      const levelUp = newLevel > oldLevel;
      
      if (levelUp) {
        data.level = newLevel;
        console.log(`🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
      }
      
      // Save data
      await this.saveData(data);
      
      // Check for new badges
      const badgesUnlocked = await this.checkBadgeUnlocks(data);
      
      return {
        levelUp,
        oldLevel,
        newLevel,
        xpEarned: xpAmount,
        totalXP: data.xp,
        badgesUnlocked,
      };
    } catch (error) {
      console.error('❌ Error awarding XP:', error);
      return { levelUp: false, newLevel: 1, badgesUnlocked: [] };
    }
  }
  
  /**
   * Calculate current level based on XP
   */
  static calculateLevel(xp) {
    for (let i = LEVEL_XP_REQUIREMENTS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_XP_REQUIREMENTS[i]) {
        return i + 1;
      }
    }
    return 1;
  }
  
  /**
   * Get XP required for next level
   */
  static getXPForNextLevel(currentLevel) {
    if (currentLevel >= LEVEL_XP_REQUIREMENTS.length) {
      return null; // Max level reached
    }
    return LEVEL_XP_REQUIREMENTS[currentLevel];
  }
  
  /**
   * Get XP progress to next level (0-1)
   */
  static getLevelProgress(currentXP, currentLevel) {
    if (currentLevel >= LEVEL_XP_REQUIREMENTS.length) {
      return 1; // Max level
    }
    
    const currentLevelXP = LEVEL_XP_REQUIREMENTS[currentLevel - 1];
    const nextLevelXP = LEVEL_XP_REQUIREMENTS[currentLevel];
    const xpInLevel = currentXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    
    return Math.min(xpInLevel / xpNeeded, 1);
  }
  
  // ===== SCANNING REWARDS =====
  
  /**
   * Process a product scan and award XP
   */
  static async processScan(product, scanHistory) {
    try {
      const data = await this.getData();
      let totalXP = 0;
      const rewards = [];
      
      // Update scan count
      data.totalScans += 1;
      if (!data.firstScanDate) {
        data.firstScanDate = new Date().toISOString();
      }
      
      // Base scan XP
      totalXP += XP_RULES.SCAN_PRODUCT;
      rewards.push({ reason: 'Product Scan', xp: XP_RULES.SCAN_PRODUCT });
      
      // First scan of day bonus
      const today = new Date().toDateString();
      const lastScan = data.lastScanDate ? new Date(data.lastScanDate).toDateString() : null;
      
      if (lastScan !== today) {
        totalXP += XP_RULES.FIRST_SCAN_OF_DAY;
        rewards.push({ reason: 'First Scan Today', xp: XP_RULES.FIRST_SCAN_OF_DAY });
      }
      
      // Grade-based XP
      const grade = product.healthScore?.grade || product.grade;
      if (grade) {
        const gradeKey = grade.charAt(0); // A, B, C, D, F
        data.gradesHistory[gradeKey] = (data.gradesHistory[gradeKey] || 0) + 1;
        
        if (gradeKey === 'A') {
          totalXP += XP_RULES.SCAN_A_GRADE;
          rewards.push({ reason: 'A Grade Product! 🌟', xp: XP_RULES.SCAN_A_GRADE });
          data.healthyScans += 1;
        } else if (gradeKey === 'B') {
          totalXP += XP_RULES.SCAN_B_GRADE;
          rewards.push({ reason: 'B Grade Product', xp: XP_RULES.SCAN_B_GRADE });
          data.healthyScans += 1;
        } else if (gradeKey === 'C') {
          totalXP += XP_RULES.SCAN_C_GRADE;
          rewards.push({ reason: 'C Grade Product', xp: XP_RULES.SCAN_C_GRADE });
        } else if (gradeKey === 'D') {
          totalXP += XP_RULES.SCAN_D_GRADE;
          rewards.push({ reason: 'D Grade Product', xp: XP_RULES.SCAN_D_GRADE });
        } else if (gradeKey === 'F') {
          totalXP += XP_RULES.SCAN_F_GRADE;
          rewards.push({ reason: 'F Grade Product', xp: XP_RULES.SCAN_F_GRADE });
        }
      }
      
      // New brand bonus
      const brand = product.brand || product.brands;
      if (brand && !data.brandsScanned.includes(brand)) {
        data.brandsScanned.push(brand);
        totalXP += XP_RULES.SCAN_NEW_BRAND;
        rewards.push({ reason: 'New Brand Discovered! 🏷️', xp: XP_RULES.SCAN_NEW_BRAND });
      }
      
      // New category bonus
      const category = product.categories?.split(',')[0]?.trim();
      if (category && !data.categoriesScanned.includes(category)) {
        data.categoriesScanned.push(category);
        totalXP += XP_RULES.SCAN_NEW_CATEGORY;
        rewards.push({ reason: 'New Category Explored! 🗺️', xp: XP_RULES.SCAN_NEW_CATEGORY });
      }
      
      // Update last scan date
      data.lastScanDate = new Date().toISOString();
      
      // Save updated data
      await this.saveData(data);
      
      // Award total XP
      const result = await this.awardXP(totalXP, 'Product Scan');
      
      return {
        ...result,
        rewards,
        totalXP,
      };
    } catch (error) {
      console.error('❌ Error processing scan:', error);
      return { levelUp: false, newLevel: 1, badgesUnlocked: [], rewards: [], totalXP: 0 };
    }
  }
  
  // ===== STREAK SYSTEM =====
  
  /**
   * Update streak based on scan history
   * Returns updated streak data
   */
  static async updateStreak(scanHistory) {
    try {
      const data = await this.getData();
      
      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Sort history by date (most recent first)
      const sortedHistory = [...scanHistory].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Check consecutive days
      let checkDate = new Date(today);
      for (let i = 0; i < sortedHistory.length; i++) {
        const scanDate = new Date(sortedHistory[i].date);
        scanDate.setHours(0, 0, 0, 0);
        
        if (scanDate.getTime() === checkDate.getTime()) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (scanDate.getTime() < checkDate.getTime()) {
          break; // Streak broken
        }
      }
      
      // Update data
      data.streakDays = currentStreak;
      if (currentStreak > data.longestStreak) {
        data.longestStreak = currentStreak;
      }
      
      // Check for streak milestone XP
      let streakXP = 0;
      if (currentStreak === 3 && !data.unlockedBadges.includes('streak_3')) {
        streakXP = XP_RULES.STREAK_3_DAYS;
      } else if (currentStreak === 7 && !data.unlockedBadges.includes('streak_7')) {
        streakXP = XP_RULES.STREAK_7_DAYS;
      } else if (currentStreak === 14) {
        streakXP = XP_RULES.STREAK_14_DAYS;
      } else if (currentStreak === 30 && !data.unlockedBadges.includes('streak_30')) {
        streakXP = XP_RULES.STREAK_30_DAYS;
      } else if (currentStreak === 100 && !data.unlockedBadges.includes('streak_100')) {
        streakXP = XP_RULES.STREAK_100_DAYS;
      }
      
      if (streakXP > 0) {
        await this.awardXP(streakXP, `${currentStreak}-Day Streak!`);
      }
      
      await this.saveData(data);
      
      return {
        currentStreak,
        longestStreak: data.longestStreak,
        streakXPEarned: streakXP,
      };
    } catch (error) {
      console.error('❌ Error updating streak:', error);
      return { currentStreak: 0, longestStreak: 0, streakXPEarned: 0 };
    }
  }
  
  // ===== BADGE SYSTEM =====
  
  /**
   * Check if any badges should be unlocked
   */
  static async checkBadgeUnlocks(data) {
    const newBadges = [];
    
    // Check each badge
    for (const badgeKey in BADGES) {
      const badge = BADGES[badgeKey];
      
      // Skip if already unlocked
      if (data.unlockedBadges.includes(badge.id)) {
        continue;
      }
      
      // Check unlock criteria
      let shouldUnlock = false;
      
      switch (badge.category) {
        case 'scanning':
          shouldUnlock = data.totalScans >= badge.requirement;
          break;
        case 'healthy':
          shouldUnlock = data.healthyScans >= badge.requirement;
          break;
        case 'streak':
          shouldUnlock = data.streakDays >= badge.requirement;
          break;
        case 'exploration':
          if (badge.id === 'explorer_5') {
            shouldUnlock = data.categoriesScanned.length >= badge.requirement;
          } else if (badge.id === 'explorer_20') {
            shouldUnlock = data.brandsScanned.length >= badge.requirement;
          }
          break;
        case 'special':
          // Special badges have custom logic
          if (badge.id === 'early_adopter') {
            const accountAge = Date.now() - new Date(data.createdAt).getTime();
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            shouldUnlock = accountAge < oneMonth;
          }
          break;
      }
      
      if (shouldUnlock) {
        data.unlockedBadges.push(badge.id);
        newBadges.push(badge);
        console.log(`🏆 Badge Unlocked: ${badge.name} (+${badge.xpReward} XP)`);
        
        // Award badge XP (without triggering another level check)
        data.xp += badge.xpReward;
      }
    }
    
    if (newBadges.length > 0) {
      await this.saveData(data);
    }
    
    return newBadges;
  }
  
  /**
   * Get all badges with unlock status
   */
  static async getAllBadges() {
    const data = await this.getData();
    
    return Object.values(BADGES).map(badge => ({
      ...badge,
      unlocked: data.unlockedBadges.includes(badge.id),
      progress: this.getBadgeProgress(badge, data),
    }));
  }
  
  /**
   * Get progress towards a badge (0-1)
   */
  static getBadgeProgress(badge, data) {
    switch (badge.category) {
      case 'scanning':
        return Math.min(data.totalScans / badge.requirement, 1);
      case 'healthy':
        return Math.min(data.healthyScans / badge.requirement, 1);
      case 'streak':
        return Math.min(data.streakDays / badge.requirement, 1);
      case 'exploration':
        if (badge.id === 'explorer_5') {
          return Math.min(data.categoriesScanned.length / badge.requirement, 1);
        } else if (badge.id === 'explorer_20') {
          return Math.min(data.brandsScanned.length / badge.requirement, 1);
        }
        return 0;
      default:
        return 0;
    }
  }
  
  // ===== STATS & SUMMARY =====
  
  /**
   * Get complete gamification summary
   */
  static async getSummary() {
    const data = await this.getData();
    const xpForNext = this.getXPForNextLevel(data.level);
    const progress = this.getLevelProgress(data.xp, data.level);
    const badges = await this.getAllBadges();
    
    return {
      xp: data.xp,
      level: data.level,
      xpForNextLevel: xpForNext,
      levelProgress: progress,
      totalScans: data.totalScans,
      healthyScans: data.healthyScans,
      streakDays: data.streakDays,
      longestStreak: data.longestStreak,
      badges: badges,
      unlockedBadgesCount: data.unlockedBadges.length,
      totalBadgesCount: Object.keys(BADGES).length,
      categoriesExplored: data.categoriesScanned.length,
      brandsDiscovered: data.brandsScanned.length,
      gradesHistory: data.gradesHistory,
      dailyXpEarned: data.dailyXpEarned,
    };
  }
  
  // ===== TESTING & ADMIN =====
  
  /**
   * Reset all gamification data
   */
  static async reset() {
    try {
      await AsyncStorage.removeItem(GAMIFICATION_KEY);
      await AsyncStorage.removeItem(DAILY_XP_KEY);
      console.log('🔄 Gamification data reset');
      return true;
    } catch (error) {
      console.error('❌ Error resetting gamification:', error);
      return false;
    }
  }
  
  /**
   * Add test XP (for testing)
   */
  static async addTestXP(amount) {
    return await this.awardXP(amount, 'Test XP');
  }
  
  /**
   * Set level (for testing)
   */
  static async setTestLevel(level) {
    const data = await this.getData();
    data.level = level;
    data.xp = LEVEL_XP_REQUIREMENTS[level - 1] || 0;
    await this.saveData(data);
    console.log(`🧪 Test level set to: ${level}`);
    return true;
  }
}

// Export badge definitions for UI
export { BADGES, XP_RULES, LEVEL_XP_REQUIREMENTS };
export default GamificationService;