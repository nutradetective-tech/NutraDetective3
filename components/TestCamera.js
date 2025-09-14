import React from 'react';
import { View, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function TestCamera() {
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Text style={{ color: 'white', fontSize: 30, textAlign: 'center', marginTop: 100 }}>
        Camera Test
      </Text>
      <BarCodeScanner style={{ flex: 1 }} />
    </View>
  );
}