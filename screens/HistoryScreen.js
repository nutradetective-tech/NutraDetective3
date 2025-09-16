import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { isTablet } from '../utils/responsive';
import { formatDate } from '../utils/formatters';
import { getGradeGradient } from '../utils/calculations';

const HistoryScreen = ({
  scanHistory,
  clearHistory,
  handleHistoryItemPress,
  setActiveTab,
  styles, // Pass styles from App.js for now
}) => {
  const ResponsiveContainer = ({ children, style }) => (
    <View style={[
      styles.responsiveContainer,
      isTablet && styles.tabletContainer,
      style
    ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ResponsiveContainer>
        <LinearGradient
          colors={['#FFFFFF', '#F7F8FA']}
          style={styles.gradientHeader}
        >
          <Text style={styles.headerTitleCenter}>Scan History</Text>
          {scanHistory.length > 0 && (
            <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {scanHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptySubtext}>Your scan history will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={scanHistory}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.historyList}
            numColumns={isTablet ? 2 : 1}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.historyItem,
                  styles.cardShadow,
                  isTablet && styles.historyItemTablet
                ]}
                onPress={() => handleHistoryItemPress(item)}
              >
                <LinearGradient
                  colors={getGradeGradient(item.score)}
                  style={styles.historyGradeBadge}
                >
                  <Text style={styles.historyGradeText}>{item.grade}</Text>
                </LinearGradient>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.historyTime}>{formatDate(item.date)}</Text>
                </View>
                <Text style={styles.historyArrow}>→</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navItem, styles.navItemActive]}
            onPress={() => setActiveTab('history')}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.navActiveIndicator}
            />
            <Text style={[styles.navIcon, styles.navIconActive]}>📊</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

export default HistoryScreen;