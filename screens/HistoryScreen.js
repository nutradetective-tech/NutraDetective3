import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import { isTablet } from '../utils/responsive';
import { formatDate } from '../utils/formatters';
import { getGradeGradient } from '../utils/calculations';

const HistoryScreen = ({
  scanHistory,
  clearHistory,
  handleHistoryItemPress,
  setActiveTab,
  styles,
}) => {
  return (
    <ScreenContainer activeTab="history" setActiveTab={setActiveTab} useScrollView={false}>
      <StatusBar barStyle="dark-content" />
      
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
    </ScreenContainer>
  );
};

export default HistoryScreen;