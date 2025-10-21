import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ALLERGEN_DATABASE, getAllergensByCategory } from '../../services/allergen-database';
import PremiumService from '../../services/PremiumService';

const AllergenPickerModal = ({
  visible,
  onClose,
  onSelectAllergen,
  selectedAllergens = [], // Array of allergen IDs already selected
  profileName = 'this profile',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userTier, setUserTier] = useState('free');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredAllergens, setFilteredAllergens] = useState([]);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'fda_top_8', name: 'FDA Top 8', icon: '⚠️' },
    { id: 'tree_nuts', name: 'Tree Nuts', icon: '🌰' },
    { id: 'seeds', name: 'Seeds', icon: '🌻' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'additives', name: 'Additives', icon: '⚗️' },
    { id: 'other', name: 'Other', icon: '📌' },
  ];

  // Load user tier on mount
  useEffect(() => {
    loadUserTier();
  }, []);

  // Filter allergens when search, category, or tier changes
  useEffect(() => {
    if (visible) {
      filterAllergens();
    }
  }, [searchQuery, selectedCategory, userTier, visible]);

  const loadUserTier = async () => {
    try {
      const status = await PremiumService.getStatus();
      setUserTier(status.tier);
    } catch (error) {
      console.error('Error loading tier:', error);
      setUserTier('free');
    }
  };

  const filterAllergens = () => {
    let allergens = Object.values(ALLERGEN_DATABASE);

    // Filter by category
    if (selectedCategory !== 'all') {
      allergens = allergens.filter(a => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allergens = allergens.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.keywords.some(k => k.toLowerCase().includes(query))
      );
    }

    // Sort: FDA Top 8 first, then by name
    allergens.sort((a, b) => {
      if (a.category === 'fda_top_8' && b.category !== 'fda_top_8') return -1;
      if (a.category !== 'fda_top_8' && b.category === 'fda_top_8') return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredAllergens(allergens);
  };

  const handleSelectAllergen = (allergen) => {
    // Check tier access
    if (allergen.tier === 'plus' && userTier === 'free') {
      Alert.alert(
        '⭐ Plus Required',
        `"${allergen.name}" is available with NutraDetective Plus.\n\nUpgrade to track 100+ allergens and create family profiles.`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {
            // TODO: Open upgrade modal
            console.log('Open upgrade modal');
          }}
        ]
      );
      return;
    }

    if (allergen.tier === 'pro' && (userTier === 'free' || userTier === 'plus')) {
      Alert.alert(
        '👑 Pro Required',
        `"${allergen.name}" is available with NutraDetective Pro.\n\nUpgrade for unlimited everything.`,
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {
            // TODO: Open upgrade modal
            console.log('Open upgrade modal');
          }}
        ]
      );
      return;
    }

    // Check if already selected
    if (selectedAllergens.includes(allergen.id)) {
      Alert.alert(
        'Already Added',
        `"${allergen.name}" is already in ${profileName}'s allergen list.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Call the parent's select handler
    onSelectAllergen(allergen);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe': return '#EF4444';
      case 'moderate': return '#F59E0B';
      case 'mild': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'severe': return '🔴';
      case 'moderate': return '🟡';
      case 'mild': return '🟢';
      default: return '⚪';
    }
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'free': return { text: 'FREE', color: '#10B981' };
      case 'plus': return { text: 'PLUS', color: '#F59E0B' };
      case 'pro': return { text: 'PRO', color: '#8B5CF6' };
      default: return { text: '', color: '#6B7280' };
    }
  };

  const renderAllergenItem = ({ item }) => {
    const isSelected = selectedAllergens.includes(item.id);
    const isLocked = (item.tier === 'plus' && userTier === 'free') || 
                     (item.tier === 'pro' && userTier !== 'pro');
    const tierBadge = getTierBadge(item.tier);

    return (
      <TouchableOpacity
        style={[
          styles.allergenItem,
          isSelected && styles.allergenItemSelected,
          isLocked && styles.allergenItemLocked,
        ]}
        onPress={() => handleSelectAllergen(item)}
        activeOpacity={0.7}
      >
        <View style={styles.allergenItemLeft}>
          <Text style={styles.severityIcon}>{getSeverityIcon(item.severity)}</Text>
          <View style={styles.allergenItemInfo}>
            <View style={styles.allergenItemHeader}>
              <Text style={[
                styles.allergenItemName,
                isLocked && styles.allergenItemNameLocked
              ]}>
                {item.name}
              </Text>
              {item.tier !== 'free' && (
                <View style={[styles.tierBadge, { backgroundColor: tierBadge.color }]}>
                  <Text style={styles.tierBadgeText}>{tierBadge.text}</Text>
                </View>
              )}
            </View>
            <Text style={styles.allergenItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
        
        {isLocked ? (
          <Text style={styles.lockIcon}>🔒</Text>
        ) : isSelected ? (
          <Text style={styles.checkIcon}>✓</Text>
        ) : (
          <Text style={styles.addIcon}>+</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Allergen</Text>
            <View style={styles.closeButton} />
          </View>

          <Text style={styles.headerSubtitle}>
            Choose allergens to track for {profileName}
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search allergens..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryChipIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.categoryChipTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* Allergen List */}
        <FlatList
          data={filteredAllergens}
          keyExtractor={(item) => item.id}
          renderItem={renderAllergenItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No allergens found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or category filter
              </Text>
            </View>
          }
        />

        {/* Info Footer */}
        <View style={styles.footer}>
          <View style={styles.legendItem}>
            <Text style={styles.severityIcon}>🔴</Text>
            <Text style={styles.legendText}>Severe</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.severityIcon}>🟡</Text>
            <Text style={styles.legendText}>Moderate</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.severityIcon}>🟢</Text>
            <Text style={styles.legendText}>Mild</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearSearchIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    padding: 4,
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#667EEA',
  },
  listContent: {
    padding: 16,
  },
  allergenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  allergenItemSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  allergenItemLocked: {
    opacity: 0.6,
  },
  allergenItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  allergenItemInfo: {
    flex: 1,
  },
  allergenItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  allergenItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  allergenItemNameLocked: {
    color: '#9CA3AF',
  },
  tierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  allergenItemDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  checkIcon: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: '700',
  },
  addIcon: {
    fontSize: 28,
    color: '#667EEA',
    fontWeight: '300',
  },
  lockIcon: {
    fontSize: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default AllergenPickerModal;