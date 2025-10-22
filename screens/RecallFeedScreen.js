// screens/RecallFeedScreen.js
// NutraDetective - Recall News Feed
// Shows latest FDA/USDA recalls with search and share

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StyleSheet,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RecallService from '../services/RecallService';

const RecallFeedScreen = () => {
  const [recalls, setRecalls] = useState([]);
  const [filteredRecalls, setFilteredRecalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Load recalls on mount
  useEffect(() => {
    loadRecalls();
    loadUpdateTime();
  }, []);

  // Filter recalls when search changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecalls(recalls);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = recalls.filter(recall =>
        recall.productName.toLowerCase().includes(query) ||
        recall.brand.toLowerCase().includes(query) ||
        recall.reason.toLowerCase().includes(query) ||
        recall.company.toLowerCase().includes(query)
      );
      setFilteredRecalls(filtered);
    }
  }, [searchQuery, recalls]);

  const loadRecalls = async () => {
    try {
      setLoading(true);
      const feed = await RecallService.fetchRecallFeed();
      setRecalls(feed);
      setFilteredRecalls(feed);
      await loadUpdateTime();
    } catch (error) {
      console.error('Error loading recalls:', error);
      Alert.alert('Error', 'Failed to load recalls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUpdateTime = async () => {
    const updateInfo = await RecallService.getLastUpdateTime();
    setLastUpdate(updateInfo);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const feed = await RecallService.refreshFeed();
    setRecalls(feed);
    setFilteredRecalls(feed);
    await loadUpdateTime();
    setRefreshing(false);
  };

  const handleShare = async (recall) => {
    const shareMessage = 
      `🚨 FOOD RECALL ALERT\n\n` +
      `Product: ${recall.productName}\n` +
      `Brand: ${recall.brand}\n` +
      `Reason: ${recall.reason}\n` +
      `Classification: ${recall.classification}\n` +
      `Date: ${recall.recallDate}\n\n` +
      `${recall.actionToTake}\n\n` +
      `Stay informed with NutraDetective 📱\n` +
      `Download: https://nutradetective.com\n\n` +
      `Source: ${recall.source} • ${recall.recallNumber}`;

    try {
      await Share.share({
        message: shareMessage,
        title: 'Food Recall Alert'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#DC2626';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      default:
        return 'ℹ️';
    }
  };

  const RecallCard = ({ recall }) => (
    <View style={styles.recallCard}>
      {/* Header with severity badge */}
      <View style={styles.cardHeader}>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(recall.severity) }]}>
          <Text style={styles.severityText}>
            {getSeverityIcon(recall.severity)} {recall.classification}
          </Text>
        </View>
        <Text style={styles.recallDate}>{recall.recallDate}</Text>
      </View>

      {/* Product info */}
      <Text style={styles.productName}>{recall.productName}</Text>
      <Text style={styles.brandName}>{recall.brand}</Text>

      {/* Reason */}
      <View style={styles.reasonSection}>
        <Text style={styles.reasonLabel}>Reason:</Text>
        <Text style={styles.reasonText}>{recall.reason}</Text>
      </View>

      {/* Company */}
      <Text style={styles.companyText}>Company: {recall.company}</Text>

      {/* Action */}
      <View style={styles.actionBox}>
        <Text style={styles.actionText}>{recall.actionToTake}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            Alert.alert(
              'Recall Details',
              `${recall.productName}\n\n` +
              `Company: ${recall.company}\n` +
              `Distribution: ${recall.distributionPattern}\n` +
              `Recall Number: ${recall.recallNumber}\n\n` +
              `Details: ${recall.details || 'No additional details'}\n\n` +
              `Source: ${recall.officialLink}`,
              [{ text: 'OK' }]
            );
          }}
        >
          <Ionicons name="information-circle-outline" size={20} color="#667EEA" />
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShare(recall)}
        >
          <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🚨 Safety Alerts</Text>
          {lastUpdate && (
            <Text style={styles.headerSubtitle}>
              Updated {lastUpdate.minutesAgo < 1 ? 'just now' : 
                      lastUpdate.minutesAgo < 60 ? `${lastUpdate.minutesAgo}m ago` :
                      `${Math.floor(lastUpdate.minutesAgo / 60)}h ago`}
            </Text>
          )}
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{recalls.length}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recalls by product, brand, or reason..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterChips}
        contentContainerStyle={styles.filterChipsContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, searchQuery === '' && styles.filterChipActive]}
          onPress={() => setSearchQuery('')}
        >
          <Text style={[styles.filterChipText, searchQuery === '' && styles.filterChipTextActive]}>
            All ({recalls.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={async () => {
            const critical = await RecallService.getRecallsBySeverity('critical');
            setFilteredRecalls(critical);
            setSearchQuery('');
          }}
        >
          <Text style={styles.filterChipText}>🚨 Critical</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={async () => {
            const high = await RecallService.getRecallsBySeverity('high');
            setFilteredRecalls(high);
            setSearchQuery('');
          }}
        >
          <Text style={styles.filterChipText}>⚠️ High</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Recall List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667EEA" />
          <Text style={styles.loadingText}>Loading recalls...</Text>
        </View>
      ) : filteredRecalls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No recalls found</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Try a different search term' : 'No recalls to display'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#667EEA"
            />
          }
        >
          <Text style={styles.resultsCount}>
            {filteredRecalls.length} recall{filteredRecalls.length !== 1 ? 's' : ''} found
          </Text>
          {filteredRecalls.map((recall, index) => (
            <RecallCard key={recall.id || index} recall={recall} />
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  filterChips: {
    maxHeight: 50,
    marginBottom: 10,
  },
  filterChipsContent: {
    paddingHorizontal: 15,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: '500',
  },
  recallCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recallDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  reasonSection: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  companyText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  actionBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  detailsButtonText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667EEA',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default RecallFeedScreen;