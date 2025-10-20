import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
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
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            style={{ flex: 1 }}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            {children}
          </View>
        )}
        
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </ResponsiveContainer>
    </SafeAreaView>
  );
};

export default ScreenContainer;