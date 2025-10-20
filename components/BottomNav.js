import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/AppStyles';

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
        onPress={() => setActiveTab('home')}
      >
        {activeTab === 'home' && (
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            style={styles.navActiveIndicator}
          />
        )}
        <Text style={[
          styles.navIcon, 
          activeTab === 'home' && styles.navIconActive
        ]}>
          🏠
        </Text>
        <Text style={[
          styles.navLabel, 
          activeTab === 'home' && styles.navLabelActive
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'history' && styles.navItemActive]}
        onPress={() => setActiveTab('history')}
      >
        {activeTab === 'history' && (
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            style={styles.navActiveIndicator}
          />
        )}
        <Text style={[
          styles.navIcon, 
          activeTab === 'history' && styles.navIconActive
        ]}>
          📊
        </Text>
        <Text style={[
          styles.navLabel, 
          activeTab === 'history' && styles.navLabelActive
        ]}>
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
        onPress={() => setActiveTab('profile')}
      >
        {activeTab === 'profile' && (
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            style={styles.navActiveIndicator}
          />
        )}
        <Text style={[
          styles.navIcon, 
          activeTab === 'profile' && styles.navIconActive
        ]}>
          👤
        </Text>
        <Text style={[
          styles.navLabel, 
          activeTab === 'profile' && styles.navLabelActive
        ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;