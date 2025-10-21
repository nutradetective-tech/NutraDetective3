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
    
    if (userTier === 'PRO') return true;
    if (userTier === 'PLUS') return count < 3;
    if (userTier === 'FREE') return count < 1;
    
    return false;
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