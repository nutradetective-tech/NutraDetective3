// screens/RecallFeedScreen.js
// NutraDetective - Recall News Feed
// Shows latest FDA/USDA recalls with search and share
// Version 3.0 - Merged FDA + USDA with source indicators

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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RecallService from '../services/RecallService';
import BottomNav from '../components/BottomNav';

const RecallFeedScreen = ({ setActiveTab }) => {
  const [recalls, setRecalls] = useState([]);
  const [filteredRecalls, setFilteredRecalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showArchive, setShowArchive] = useState(false);

  // Load recalls on mount
  useEffect(() => {
    loadRecalls();
    loadUpdateTime();
  }, []);

  // Filter recalls when search changes or filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, recalls, activeFilter, showArchive]);

  const applyFilters = () => {
    let filtered = [...recalls];

    // 1. Filter by date (default: last year only)
    if (!showArchive) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      filtered = filtered.filter(recall => {
        const recallDate = parseRecallDate(recall.recallDate);
        return recallDate >= oneYearAgo;
      });
    }

    // 2. Filter by severity
    if (activeFilter !== 'all') {
      filtered = filtered.filter(recall => recall.severity === activeFilter);
    }

    // 3. Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recall =>
        recall.productName.toLowerCase().includes(query) ||
        recall.brand.toLowerCase().includes(query) ||
        recall.reason.toLowerCase().includes(query) ||
        recall.company.toLowerCase().includes(query)
      );
    }

    setFilteredRecalls(filtered);
  };

  const parseRecallDate = (dateString) => {
    if (!dateString || dateString === 'Date unknown') return new Date(0);
    
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    return new Date(`${year}-${month}-${day}`);
  };

  const formatRecallDate = (dateString) => {
    if (!dateString || dateString === 'Date unknown') return 'Date unknown';
    
    const date = parseRecallDate(dateString);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const loadRecalls = async () => {
    try {
      setLoading(true);
      const feed = await RecallService.fetchRecallFeed();
      setRecalls(feed);
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
    await loadUpdateTime();
    setRefreshing(false);
  };

  const getOfficialLink = (recall) => {
    // Generate link based on source
    if (recall.source === 'USDA') {
      // USDA link
      if (recall.recallNumber && recall.recallNumber !== 'N/A') {
        return `https://www.fsis.usda.gov/recalls/${recall.recallNumber}`;
      }
      return 'https://www.fsis.usda.gov/recalls';
    } else {
      // FDA link
      if (recall.recallNumber && recall.recallNumber !== 'N/A') {
        return `https://www.accessdata.fda.gov/scripts/enforcement/enforce_rpt-Product-Tabs.cfm?recall_number=${recall.recallNumber}`;
      }
      return 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts';
    }
  };

  const getSourceName = (source) => {
    return source === 'USDA' ? 'USDA' : 'FDA';
  };

  const handleShare = async (recall) => {
    const formattedDate = formatRecallDate(recall.recallDate);
    const officialLink = getOfficialLink(recall);
    const sourceName = getSourceName(recall.source);
    
    const shareMessage = 
      `🚨 FOOD RECALL ALERT\n\n` +
      `Product: ${recall.productName}\n` +
      `Brand: ${recall.brand}\n` +
      `Reason: ${recall.reason}\n` +
      `Severity: ${getSeverityLabel(recall.severity)}\n` +
      `Date: ${formattedDate}\n` +
      `Source: ${sourceName}\n\n` +
      `${recall.actionToTake}\n\n` +
      `📋 Official ${sourceName} Details:\n${officialLink}\n\n` +
      `🔍 Stay safe - scan your food with NutraDetective:\n` +
      `https://nutradetective.com\n\n` +
      `#FoodSafety #RecallAlert #${sourceName}`;

    try {
      await Share.share({
        message: shareMessage,
        title: 'Food Recall Alert'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical':
        return 'Dangerous';
      case 'high':
        return 'Warning';
      case 'medium':
        return 'Notice';
      default:
        return 'Alert';
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
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const getSourceColor = (source) => {
    return source === 'USDA' ? '#10B981' : '#3B82F6';
  };

  const RecallCard = ({ recall }) => {
    const formattedDate = formatRecallDate(recall.recallDate);
    const officialLink = getOfficialLink(recall);
    const sourceName = getSourceName(recall.source);

    return (
      <View style={styles.recallCard}>
        {/* Header with severity badge and source badge */}
        <View style={styles.cardHeader}>
          <View style={styles.badgeContainer}>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(recall.severity) }]}>
              <Text style={styles.severityText}>
                {getSeverityIcon(recall.severity)} {getSeverityLabel(recall.severity)}
              </Text>
            </View>
            <View style={[styles.sourceBadge, { backgroundColor: getSourceColor(recall.source) }]}>
              <Text style={styles.sourceText}>{sourceName}</Text>
            </View>
          </View>
          <Text style={styles.recallDate}>{formattedDate}</Text>
        </View>

        {/* Product info */}
        <Text style={styles.productName}>{recall.productName}</Text>
        <Text style={styles.brandName}>{recall.brand}</Text>

        {/* Reason */}
        <View style={styles.reasonSection}>
          <Text style={styles.reasonLabel}>Recall Reason:</Text>
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
                `Recall Number: ${recall.recallNumber}\n` +
                `Recall Date: ${formattedDate}\n` +
                `Source: ${sourceName}\n\n` +
                `Details: ${recall.details || 'No additional details'}\n\n` +
                `Official ${sourceName} Link:\n${officialLink}`,
                [
                  { text: 'Close' },
                  { 
                    text: `View on ${sourceName}`, 
                    onPress: () => Linking.openURL(officialLink)
                  }
                ]
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
  };

  return (
    <View style={{ flex: 1 }}>
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
            <Text style={styles.headerBadgeText}>{filteredRecalls.length}</Text>
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
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'critical' && styles.filterChipActive]}
            onPress={() => setActiveFilter('critical')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'critical' && styles.filterChipTextActive]}>
              🚨 Dangerous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'high' && styles.filterChipActive]}
            onPress={() => setActiveFilter('high')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'high' && styles.filterChipTextActive]}>
              ⚠️ Warning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'medium' && styles.filterChipActive]}
            onPress={() => setActiveFilter('medium')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'medium' && styles.filterChipTextActive]}>
              ℹ️ Notice
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Archive Toggle */}
        {!showArchive && (
          <TouchableOpacity 
            style={styles.archiveButton}
            onPress={() => setShowArchive(true)}
          >
            <Ionicons name="archive-outline" size={18} color="#667EEA" />
            <Text style={styles.archiveButtonText}>
              Showing last year • Tap to view archive
            </Text>
          </TouchableOpacity>
        )}
        {showArchive && (
          <TouchableOpacity 
            style={styles.archiveButtonActive}
            onPress={() => setShowArchive(false)}
          >
            <Ionicons name="close-circle-outline" size={18} color="#667EEA" />
            <Text style={styles.archiveButtonText}>
              Showing all time • Tap to hide archive
            </Text>
          </TouchableOpacity>
        )}

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
              {searchQuery ? 'Try a different search term' : 
               activeFilter !== 'all' ? 'No recalls in this category' :
               'No recalls to display'}
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

      {/* Bottom Navigation */}
      <BottomNav activeTab="alerts" setActiveTab={setActiveTab} />
    </View>
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
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  archiveButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  archiveButtonText: {
    fontSize: 13,
    color: '#667EEA',
    fontWeight: '600',
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
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
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
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sourceText: {
    color: '#FFFFFF',
    fontSize: 11,
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
    height: 80,
  },
});

export default RecallFeedScreen;