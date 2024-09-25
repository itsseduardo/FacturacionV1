import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CrearFacturaScreen() {
  return (
    <View style={styles.container}>
      <Text>Crear Nueva Factura</Text>
      {/* Formulario para crear factura */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
