// services/AllergenService.js
// Advanced Allergen Detection and Management System
// Integrates with existing ProductService and UserSettingsService

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ALLERGEN_DATABASE, 
  getAllergen,
  getAllergensForTier,
  canAccessAllergen,
  SEVERITY_LEVELS
} from './allergen-database';

const STORAGE_KEY = 'allergen_profiles';

/**
 * ALLERGEN SERVICE
 * Handles family allergen profiles, detection, and warnings
 */
class AllergenService {
  
  // ==========================================
  // PROFILE MANAGEMENT
  // ==========================================
  
  /**
   * Get all allergen profiles for current user
   */
  static async getAllProfiles() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Create default profile for user
        const defaultProfile = {
          id: 'user',
          name: 'Me',
          isDefault: true,
          allergens: [], // Array of allergen IDs from database
          createdAt: new Date().toISOString()
        };
        await this.saveProfiles([defaultProfile]);
        return [defaultProfile];
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading allergen profiles:', error);
      return [];
    }
  }
  
  /**
   * Save all profiles
   */
  static async saveProfiles(profiles) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      return true;
    } catch (error) {
      console.error('Error saving allergen profiles:', error);
      return false;
    }
  }
  
  /**
   * Get specific profile by ID
   */
  static async getProfile(profileId) {
    const profiles = await this.getAllProfiles();
    return profiles.find(p => p.id === profileId);
  }
  
  /**
   * Get default profile (user's own profile)
   */
  static async getDefaultProfile() {
    const profiles = await this.getAllProfiles();
    return profiles.find(p => p.isDefault) || profiles[0];
  }
  
  /**
   * Create new family member profile
   */
  static async createProfile(name, allergenIds = []) {
    const profiles = await this.getAllProfiles();
    
    const newProfile = {
      id: `profile_${Date.now()}`,
      name: name.trim(),
      isDefault: false,
      allergens: allergenIds,
      createdAt: new Date().toISOString()
    };
    
    profiles.push(newProfile);
    await this.saveProfiles(profiles);
    
    console.log(`✅ Created allergen profile: ${name}`);
    return newProfile;
  }
  
  /**
   * Update existing profile
   */
  static async updateProfile(profileId, updates) {
    const profiles = await this.getAllProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    
    if (index === -1) {
      console.error('Profile not found:', profileId);
      return false;
    }
    
    profiles[index] = {
      ...profiles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.saveProfiles(profiles);
    console.log(`✅ Updated allergen profile: ${profiles[index].name}`);
    return true;
  }
  
  /**
   * Delete profile (cannot delete default)
   */
  static async deleteProfile(profileId) {
    const profiles = await this.getAllProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (profile && profile.isDefault) {
      console.error('Cannot delete default profile');
      return false;
    }
    
    const filtered = profiles.filter(p => p.id !== profileId);
    await this.saveProfiles(filtered);
    
    console.log(`✅ Deleted allergen profile: ${profile?.name}`);
    return true;
  }
  
  /**
   * Add allergen to profile
   */
  static async addAllergenToProfile(profileId, allergenId) {
    const profiles = await this.getAllProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) {
      console.error('Profile not found:', profileId);
      return false;
    }
    
    if (!profile.allergens.includes(allergenId)) {
      profile.allergens.push(allergenId);
      await this.saveProfiles(profiles);
      console.log(`✅ Added ${allergenId} to ${profile.name}'s profile`);
    }
    
    return true;
  }
  
  /**
   * Remove allergen from profile
   */
  static async removeAllergenFromProfile(profileId, allergenId) {
    const profiles = await this.getAllProfiles();
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) {
      console.error('Profile not found:', profileId);
      return false;
    }
    
    profile.allergens = profile.allergens.filter(id => id !== allergenId);
    await this.saveProfiles(profiles);
    console.log(`✅ Removed ${allergenId} from ${profile.name}'s profile`);
    
    return true;
  }
  
  /**
   * Check tier limits for profiles
   * FREE: 1 profile
   * PLUS: 3 profiles  
   * PRO: Unlimited
   */
  static async canAddProfile(userTier) {
    const profiles = await this.getAllProfiles();
    const count = profiles.length;
    
    // Convert to uppercase for consistent checking
    const tier = userTier.toUpperCase();
    
    console.log('🔍 canAddProfile check - tier:', tier, 'current profiles:', count);
    
    // Check tier limits
    if (tier === 'PRO') {
  if (count < 6) {  // User + 5 family members = 6 total
    return { 
      allowed: true, 
      reason: 'within_limit', 
      message: `${count + 1} of 6 profiles` 
    };
  } else {
    return { 
      allowed: false, 
      reason: 'tier_limit', 
      message: 'Pro members can have up to 5 family profiles. You already have the maximum number of profiles.' 
    };
  }
}
    
    if (tier === 'PLUS') {
      if (count < 4) {
        return { 
          allowed: true, 
          reason: 'within_limit', 
          message: `${count + 1} of 4 profiles` 
        };
      } else {
        return { 
          allowed: false, 
          reason: 'tier_limit', 
          message: 'Plus members can have up to 3 family profiles. Upgrade to Pro for unlimited profiles.' 
        };
      }
    }
    
    if (tier === 'FREE') {
      if (count < 1) {
        return { 
          allowed: true, 
          reason: 'within_limit', 
          message: 'Your profile' 
        };
      } else {
        return { 
          allowed: false, 
          reason: 'tier_limit', 
          message: 'Free users can only have 1 profile. Upgrade to Plus for 3 family profiles, or Pro for unlimited.' 
        };
      }
    }
    
    // Fallback
    return { 
      allowed: false, 
      reason: 'unknown_tier', 
      message: 'Unable to verify tier status' 
    };
  }
  
  // ==========================================
  // DETECTION ENGINE
  // ==========================================
  
  /**
   * Main detection function - checks product against all profiles
   * Returns warnings grouped by profile
   */
  static async detectAllergens(product, userTier = 'FREE') {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('🥜 ALLERGEN DETECTION STARTED');
    console.log('═══════════════════════════════════════════');
    console.log('📦 Product:', product.name || 'Unknown');
    console.log('🎫 User tier:', userTier);
    
    const profiles = await this.getAllProfiles();
    const results = [];
    
    // Get ingredients text
    const ingredientsText = (product.ingredients_text || product.ingredients || '').toLowerCase();
    console.log('📋 Ingredients text length:', ingredientsText.length);
    
    // Get allergens from Open Food Facts tags
    const productAllergenTags = product.allergens_tags || [];
    console.log('🏷️  Product allergen tags:', productAllergenTags.join(', '));
    
    // Check each profile
    for (const profile of profiles) {
      console.log('');
      console.log(`👤 Checking profile: ${profile.name}`);
      console.log(`   Allergens in profile: ${profile.allergens.length}`);
      
      const warnings = [];
      
      for (const allergenId of profile.allergens) {
        // Check tier access
        if (!canAccessAllergen(allergenId, userTier)) {
          console.log(`   ⚠️  ${allergenId}: Requires ${userTier === 'FREE' ? 'PLUS' : 'PRO'} tier`);
          continue;
        }
        
        const allergen = getAllergen(allergenId);
        if (!allergen) {
          console.log(`   ❌ ${allergenId}: Not found in database`);
          continue;
        }
        
        console.log(`   🔍 Checking: ${allergen.name}`);
        
        // Detection methods
        let found = false;
        let matchedBy = '';
        let matchedTerm = '';
        
        // Method 1: Check Open Food Facts allergen tags
        for (const tag of productAllergenTags) {
          const cleanTag = tag.replace('en:', '').toLowerCase();
          if (allergen.keywords.some(k => cleanTag.includes(k.toLowerCase()))) {
            found = true;
            matchedBy = 'product allergen tags';
            matchedTerm = tag;
            break;
          }
        }
        
        if (found) {
          console.log(`      ✅ MATCH: ${matchedBy} (${matchedTerm})`);
        } else {
          // Method 2: Check ingredients for keywords
          for (const keyword of allergen.keywords) {
            if (ingredientsText.includes(keyword.toLowerCase())) {
              found = true;
              matchedBy = 'ingredients keywords';
              matchedTerm = keyword;
              break;
            }
          }
          
          if (found) {
            console.log(`      ✅ MATCH: ${matchedBy} (${matchedTerm})`);
          }
        }
        
        if (!found) {
          // Method 3: Check ingredients for derivatives
          for (const derivative of allergen.derivatives) {
            if (ingredientsText.includes(derivative.toLowerCase())) {
              found = true;
              matchedBy = 'hidden source/derivative';
              matchedTerm = derivative;
              break;
            }
          }
          
          if (found) {
            console.log(`      ✅ MATCH: ${matchedBy} (${matchedTerm})`);
          }
        }
        
        // Create warning if allergen found
        if (found) {
          warnings.push({
            allergenId: allergenId,
            allergenName: allergen.name,
            severity: allergen.severity,
            severityInfo: SEVERITY_LEVELS[allergen.severity],
            matchedBy: matchedBy,
            matchedTerm: matchedTerm,
            description: allergen.description,
            category: allergen.category
          });
        } else {
          console.log(`      ❌ Not detected`);
        }
      }
      
      if (warnings.length > 0) {
        // Sort by severity
        warnings.sort((a, b) => {
          const severityOrder = { SEVERE: 0, MODERATE: 1, MILD: 2 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        });
        
        results.push({
          profile: profile,
          warnings: warnings
        });
        
        console.log(`   ⚠️  Found ${warnings.length} allergen(s) for ${profile.name}`);
      } else {
        console.log(`   ✅ No allergens detected for ${profile.name}`);
      }
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`🥜 ALLERGEN DETECTION COMPLETE`);
    console.log(`📊 Checked ${profiles.length} profile(s)`);
    console.log(`⚠️  Found issues for ${results.length} profile(s)`);
    console.log('═══════════════════════════════════════════');
    console.log('');
    
    return results;
  }
  
  /**
   * Detect hidden allergens (may contain, processed in facility)
   */
  static detectHiddenAllergens(product) {
    const hiddenWarnings = [];
    
    const ingredientsText = (product.ingredients_text || '').toLowerCase();
    const traces = product.traces_tags || [];
    
    // Check "may contain" warnings
    const mayContainPhrases = [
      'may contain',
      'produced in a facility',
      'processed on equipment',
      'made on shared equipment',
      'manufactured in facility',
      'may be present'
    ];
    
    for (const phrase of mayContainPhrases) {
      if (ingredientsText.includes(phrase)) {
        hiddenWarnings.push({
          type: 'cross-contamination',
          warning: `Product ${phrase.charAt(0).toUpperCase() + phrase.slice(1)} allergens`,
          severity: 'MODERATE',
          source: 'ingredients statement'
        });
      }
    }
    
    // Check traces tags from Open Food Facts
    if (traces.length > 0) {
      traces.forEach(trace => {
        const cleanTrace = trace.replace('en:', '').replace(/-/g, ' ');
        hiddenWarnings.push({
          type: 'traces',
          warning: `May contain traces of ${cleanTrace}`,
          severity: 'MODERATE',
          source: 'product labeling'
        });
      });
    }
    
    return hiddenWarnings;
  }
  
  /**
   * Get summary of all allergen warnings for display
   */
  static async getAllergenSummary(product, userTier = 'FREE') {
    const detectionResults = await this.detectAllergens(product, userTier);
    const hiddenAllergens = this.detectHiddenAllergens(product);
    
    // Count affected profiles
    const affectedProfiles = detectionResults.length;
    
    // Get all unique allergens detected
    const allAllergens = new Set();
    detectionResults.forEach(result => {
      result.warnings.forEach(warning => {
        allAllergens.add(warning.allergenName);
      });
    });
    
    // Get highest severity
    let highestSeverity = 'MILD';
    detectionResults.forEach(result => {
      result.warnings.forEach(warning => {
        if (warning.severity === 'SEVERE') highestSeverity = 'SEVERE';
        else if (warning.severity === 'MODERATE' && highestSeverity !== 'SEVERE') {
          highestSeverity = 'MODERATE';
        }
      });
    });
    
    return {
      hasAllergens: detectionResults.length > 0,
      affectedProfiles: affectedProfiles,
      allergenCount: allAllergens.size,
      allergensList: Array.from(allAllergens),
      highestSeverity: highestSeverity,
      detailedResults: detectionResults,
      hiddenAllergens: hiddenAllergens
    };
  }
  
/**
   * Check product against ONE specific profile
   * EFFICIENT: Reuses detection logic but filters to single profile
   * 
   * @param {Object} product - Product data from Open Food Facts
   * @param {String} profileId - ID of profile to check ('user', 'profile_123', etc.)
   * @param {String} userTier - User's premium tier ('FREE', 'PLUS', 'PRO')
   * @returns {Object} - { profile, warnings, hasAllergens }
   */
  static async checkProduct(product, profileId, userTier = 'FREE') {
    console.log('');
    console.log('🔍 CHECK SINGLE PROFILE');
    console.log('═══════════════════════════════════════════');
    console.log('📦 Product:', product.name || 'Unknown');
    console.log('👤 Profile ID:', profileId);
    console.log('🎫 User tier:', userTier);
    
    // Get the specific profile
    const profile = await this.getProfile(profileId);
    
    if (!profile) {
      console.log('❌ Profile not found:', profileId);
      return {
        profile: null,
        warnings: [],
        hasAllergens: false,
        error: 'Profile not found'
      };
    }
    
    console.log('✅ Checking profile:', profile.name);
    console.log('📋 Profile has', profile.allergens.length, 'allergens');
    
    // Get ingredients text (lowercase for matching)
    const ingredientsText = (product.ingredients_text || product.ingredients || '').toLowerCase();
    const productAllergenTags = product.allergens_tags || [];
    
    const warnings = [];
    
    // Check each allergen in this profile
    for (const allergenId of profile.allergens) {
      // Check tier access
      if (!canAccessAllergen(allergenId, userTier)) {
        continue;
      }
      
      const allergen = getAllergen(allergenId);
      if (!allergen) continue;
      
      // EFFICIENT DETECTION: Check all methods in order of speed
      let found = false;
      let matchedBy = '';
      let matchedTerm = '';
      
      // Method 1: Product allergen tags (fastest - already parsed)
      for (const tag of productAllergenTags) {
        const cleanTag = tag.replace('en:', '').toLowerCase();
        if (allergen.keywords.some(k => cleanTag.includes(k.toLowerCase()))) {
          found = true;
          matchedBy = 'product allergen tags';
          matchedTerm = tag;
          break;
        }
      }
      
      // Method 2: Ingredients keywords (if not found yet)
      if (!found) {
        for (const keyword of allergen.keywords) {
          if (ingredientsText.includes(keyword.toLowerCase())) {
            found = true;
            matchedBy = 'ingredients keywords';
            matchedTerm = keyword;
            break;
          }
        }
      }
      
      // Method 3: Derivatives (slowest - only if still not found)
      if (!found) {
        for (const derivative of allergen.derivatives) {
          if (ingredientsText.includes(derivative.toLowerCase())) {
            found = true;
            matchedBy = 'hidden source/derivative';
            matchedTerm = derivative;
            break;
          }
        }
      }
      
      // Add warning if allergen detected
      if (found) {
        warnings.push({
          allergenId: allergenId,
          allergenName: allergen.name,
          severity: allergen.severity,
          severityInfo: SEVERITY_LEVELS[allergen.severity],
          matchedBy: matchedBy,
          matchedTerm: matchedTerm,
          description: allergen.description,
          category: allergen.category
        });
      }
    }
    
    // Sort warnings by severity (most severe first)
    warnings.sort((a, b) => {
      const severityOrder = { SEVERE: 0, MODERATE: 1, MILD: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    console.log('📊 Result:', warnings.length, 'allergen(s) detected');
    console.log('═══════════════════════════════════════════');
    console.log('');
    
    return {
      profile: profile,
      warnings: warnings,
      hasAllergens: warnings.length > 0
    };
  }
  
  /**
   * Check if product is safe for ALL family profiles
   * EFFICIENT: Single detection pass, checks all profiles at once
   * 
   * @param {Object} product - Product data from Open Food Facts
   * @param {String} userTier - User's premium tier ('FREE', 'PLUS', 'PRO')
   * @returns {Object} - { isSafe, affectedProfiles, safeProfiles }
   */
  static async isSafeForEveryone(product, userTier = 'FREE') {
    console.log('');
    console.log('🛡️  CHECK SAFE FOR EVERYONE');
    console.log('═══════════════════════════════════════════');
    
    // EFFICIENT: Use existing detectAllergens (checks all profiles in one pass)
    const detectionResults = await this.detectAllergens(product, userTier);
    
    const profiles = await this.getAllProfiles();
    const affectedProfiles = detectionResults.map(r => r.profile);
    const safeProfiles = profiles.filter(p => 
      !affectedProfiles.some(ap => ap.id === p.id)
    );
    
    const isSafe = detectionResults.length === 0;
    
    console.log('📊 RESULTS:');
    console.log('✅ Safe for:', safeProfiles.length, 'profile(s)');
    console.log('⚠️  Warnings for:', affectedProfiles.length, 'profile(s)');
    console.log('🛡️  Overall:', isSafe ? 'SAFE FOR EVERYONE' : 'CONTAINS ALLERGENS');
    console.log('═══════════════════════════════════════════');
    console.log('');
    
    return {
      isSafe: isSafe,
      affectedProfiles: affectedProfiles,
      safeProfiles: safeProfiles,
      totalProfiles: profiles.length
    };
  }

  // ==========================================
  // MIGRATION FROM OLD SYSTEM
  // ==========================================
  
  /**
   * Migrate from old activeFilters system to new allergen profiles
   * Maps old filter IDs to new allergen IDs
   */
  static async migrateFromActiveFilters(activeFilters) {
    const filterToAllergenMap = {
      'gluten-free': 'wheat',
      'dairy-free': 'milk',
      'tree-nuts': 'tree-nuts',
      'peanuts': 'peanuts',
      'soy-free': 'soy',
      'eggs': 'eggs',
      'shellfish': 'shellfish',
      'fish': 'fish',
      // Note: 'no-dyes' and 'low-sugar' are not allergens, skip these
    };
    
    const allergenIds = [];
    
    for (const filter of activeFilters) {
      if (filterToAllergenMap[filter]) {
        allergenIds.push(filterToAllergenMap[filter]);
      }
    }
    
    // Get or create default profile
    let profiles = await this.getAllProfiles();
    let defaultProfile = profiles.find(p => p.isDefault);
    
    if (!defaultProfile) {
      defaultProfile = {
        id: 'user',
        name: 'Me',
        isDefault: true,
        allergens: allergenIds,
        createdAt: new Date().toISOString()
      };
      profiles.push(defaultProfile);
    } else {
      // Update existing profile with new allergens
      defaultProfile.allergens = [...new Set([...defaultProfile.allergens, ...allergenIds])];
    }
    
    await this.saveProfiles(profiles);
    console.log(`✅ Migrated ${allergenIds.length} allergens from old filters`);
    
    return defaultProfile;
  }
  
  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================
  
  /**
   * Get formatted allergen info for display
   */
  static getAllergenDisplayInfo(allergenId) {
    const allergen = getAllergen(allergenId);
    if (!allergen) return null;
    
    const severityInfo = SEVERITY_LEVELS[allergen.severity];
    
    return {
      id: allergen.id,
      name: allergen.name,
      category: allergen.category,
      severity: allergen.severity,
      severityIcon: severityInfo.icon,
      severityColor: severityInfo.color,
      severityDescription: severityInfo.description,
      description: allergen.description,
      tier: allergen.tier
    };
  }
  
  /**
   * Search allergens by name
   */
  static searchAllergens(searchTerm, userTier = 'FREE') {
    const term = searchTerm.toLowerCase();
    const availableAllergens = getAllergensForTier(userTier);
    
    return Object.values(availableAllergens).filter(allergen => {
      return allergen.name.toLowerCase().includes(term) ||
             allergen.category.toLowerCase().includes(term) ||
             allergen.keywords.some(k => k.includes(term));
    });
  }
  
  /**
   * Get allergens by category for tier
   */
  static getAllergensByCategory(userTier = 'FREE') {
    const availableAllergens = getAllergensForTier(userTier);
    const grouped = {};
    
    availableAllergens.forEach(allergen => {
      if (!grouped[allergen.category]) {
        grouped[allergen.category] = [];
      }
      grouped[allergen.category].push(allergen);
    });
    
    return grouped;
  }
  
  /**
   * Get tier access info
   */
  static getTierAccessInfo(userTier) {
    const tierInfo = {
      FREE: {
        allergenCount: 8,
        allergenList: 'FDA Top 8',
        profileLimit: 1,
        features: ['Basic allergen detection', '1 profile']
      },
      PLUS: {
        allergenCount: 100,
        allergenList: 'All allergens',
        profileLimit: 3,
        features: ['All 100+ allergens', 'Up to 3 family profiles', 'Hidden allergen detection', 'Severity levels']
      },
      PRO: {
        allergenCount: 100,
        allergenList: 'All allergens',
        profileLimit: 'Unlimited',
        features: ['All 100+ allergens', 'Unlimited family profiles', 'Cross-contamination alerts', 'Allergen history tracking']
      }
    };
    
    return tierInfo[userTier] || tierInfo.FREE;
  }
  
  /**
   * Clear all allergen data (for testing/reset)
   */
  static async clearAllData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('✅ Cleared all allergen profiles');
      return true;
    } catch (error) {
      console.error('Error clearing allergen data:', error);
      return false;
    }
  }
}

export default AllergenService;