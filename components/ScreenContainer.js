import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from './BottomNav';
import { styles } from '../styles/AppStyles';
import { isTablet } from '../utils/responsive';

const ScreenContainer = ({ 
  children, 
  activeTab, 
  setActiveTab,
  scrollable = true,
  useScrollView = true  // HomeScreen & ProfileScreen use ScrollView, HistoryScreen uses FlatList
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
      <ResponsiveContainer>
        {useScrollView ? (
          // ScrollView path - Used by HomeScreen & ProfileScreen
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            style={{ flex: 1 }}
          >
            {children}
          </ScrollView>
        ) : (
          // View path - Used by HistoryScreen with FlatList
          // FIX: Add paddingBottom to give space for navigation bar
          <View style={{ flex: 1, paddingBottom: 90 }}>
            {children}
          </View>
        )}
        
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

export default ScreenContainer;