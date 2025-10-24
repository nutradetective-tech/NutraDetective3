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
  useScrollView = true,
  scrollViewRef = null,
  onScroll = null  // 🆕 NEW: Optional onScroll handler
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
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            onScroll={onScroll}  // 🆕 NEW: Track scroll position
            scrollEventThrottle={16}  // 🆕 NEW: Smooth tracking
          >
            {children}
          </ScrollView>
        ) : (
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