import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StatsSelectorModal = ({ visible, tempStats, setTempStats, onClose, onSave }) => {
  const availableStats = [
    { id: 'totalScans', name: 'Total Scans', icon: '📊' },
    { id: 'healthyPercent', name: 'Healthy %', icon: '✅' },
    { id: 'streak', name: 'Day Streak', icon: '🔥' },
    { id: 'dailyGoal', name: 'Daily Goal', icon: '🎯' },
    { id: 'avgGrade', name: 'Avg Grade', icon: '📈' },
  ];

  const toggleStat = (statId) => {
    if (tempStats.includes(statId)) {
      if (tempStats.length > 1) {
        setTempStats(tempStats.filter(id => id !== statId));
      }
    } else {
      if (tempStats.length < 3) {
        setTempStats([...tempStats, statId]);
      }
    }
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Dashboard Stats</Text>
          <Text style={styles.modalSubtitle}>Choose 3 stats to display</Text>
          {availableStats.map(stat => (
            <TouchableOpacity
              key={stat.id}
              style={[
                styles.statOption,
                tempStats.includes(stat.id) && styles.statOptionActive
              ]}
              onPress={() => toggleStat(stat.id)}
            >
              <Text style={styles.statOptionIcon}>{stat.icon}</Text>
              <Text style={[
                styles.statOptionText,
                tempStats.includes(stat.id) && styles.statOptionTextActive
              ]}>
                {stat.name}
              </Text>
              {tempStats.includes(stat.id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={onSave}
            >
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                style={styles.modalGradientButton}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalGradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  statOptionActive: {
    borderColor: '#667EEA',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  statOptionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  statOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    flex: 1,
  },
  statOptionTextActive: {
    color: '#667EEA',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#667EEA',
    fontWeight: '700',
  },
});

export default StatsSelectorModal;