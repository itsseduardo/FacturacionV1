import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EditarFacturaScreen() {
  return (
    <View style={styles.container}>
      <Text>Editar Factura</Text>
      {/* Formulario para editar factura */}
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
