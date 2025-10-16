import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GoalEditModal = ({ visible, currentGoal, onClose, onSave }) => {
  // Manage state internally to prevent parent re-renders
  const [localGoal, setLocalGoal] = useState(currentGoal);

  // Update local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalGoal(currentGoal);
    }
  }, [visible, currentGoal]);

  const handleSave = () => {
    onSave(localGoal);
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
          <Text style={styles.modalTitle}>Daily Scan Goal</Text>
          <View style={styles.goalSelector}>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => setLocalGoal(Math.max(1, localGoal - 1))}
            >
              <Text style={styles.goalButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.goalValue}>{localGoal}</Text>
            <TouchableOpacity 
              style={styles.goalButton}
              onPress={() => setLocalGoal(Math.min(50, localGoal + 1))}
            >
              <Text style={styles.goalButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.goalHint}>Set a daily target for scanning products</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleSave}
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
  goalSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  goalButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#667EEA',
  },
  goalValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A202C',
    minWidth: 60,
    textAlign: 'center',
  },
  goalHint: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default GoalEditModal;