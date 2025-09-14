import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function EnhancedManualScanner({ onScanResult, onClose, onSwitchToCamera }) {
  const [barcode, setBarcode] = useState('');
  
  const exampleProducts = [
    { name: '🍫 Nutella', code: '3017620422003' },
    { name: '🥤 Coca-Cola', code: '5449000000996' },
    { name: '🥣 Cheerios', code: '016000275249' },
  ];

  const handleSubmit = () => {
    if (barcode.length > 0) {
      onScanResult({ data: barcode, type: 'manual' });
    } else {
      Alert.alert('Error', 'Please enter a barcode number');
    }
  };

  const handleExamplePress = (code) => {
    setBarcode(code);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Entry</Text>
        <Text style={styles.headerSubtitle}>Enter the barcode numbers below</Text>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.barcodeIcon}>📦</Text>
          
          <Text style={styles.inputLabel}>Barcode Number</Text>
          <TextInput
            style={styles.input}
            placeholder="0 00000 00000 0"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="numeric"
            maxLength={13}
            autoFocus
          />
          <Text style={styles.inputHint}>
            Usually 8-13 digits found below the barcode
          </Text>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.gradientButton}
            >
              <Text style={styles.searchButtonText}>🔍 Search Product</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={onSwitchToCamera}
            activeOpacity={0.8}
          >
            <Text style={styles.cameraButtonIcon}>📷</Text>
            <Text style={styles.cameraButtonText}>Use Camera Instead</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>TRY THESE EXAMPLES</Text>
          {exampleProducts.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleItem}
              onPress={() => handleExamplePress(product.code)}
            >
              <Text style={styles.exampleName}>{product.name}</Text>
              <Text style={styles.exampleCode}>{product.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  closeIcon: {
    color: 'white',
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  inputSection: {
    padding: 30,
    alignItems: 'center',
  },
  barcodeIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 15,
  },
  inputHint: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 30,
    textAlign: 'center',
  },
  searchButton: {
    width: '100%',
    marginBottom: 20,
  },
  gradientButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#64748B',
    fontSize: 14,
  },
  cameraButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: '#667EEA',
    borderRadius: 12,
    gap: 10,
  },
  cameraButtonIcon: {
    fontSize: 20,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667EEA',
  },
  examplesSection: {
    padding: 30,
    paddingTop: 0,
  },
  examplesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 15,
  },
  exampleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  exampleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A202C',
  },
  exampleCode: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#667EEA',
  },
});