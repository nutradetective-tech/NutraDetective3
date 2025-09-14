import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScannerSelector({ visible, onSelectCamera, onSelectManual, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>How to Scan?</Text>
          <Text style={styles.subtitle}>Choose your preferred method</Text>
          
          <TouchableOpacity onPress={onSelectCamera} activeOpacity={0.8}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.scanOption}
            >
              <Text style={styles.optionIcon}>📷</Text>
              <Text style={styles.optionTitle}>Camera Scan</Text>
              <Text style={styles.optionDesc}>Quick & automatic barcode detection</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.scanOptionSecondary}
            onPress={onSelectManual}
            activeOpacity={0.8}
          >
            <Text style={styles.optionIcon}>⌨️</Text>
            <Text style={styles.optionTitleSecondary}>Enter Manually</Text>
            <Text style={styles.optionDescSecondary}>Type the barcode numbers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 320,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  scanOption: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  scanOptionSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#667EEA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  optionTitleSecondary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667EEA',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  optionDescSecondary: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});