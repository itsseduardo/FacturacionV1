import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgregarProductoScreen() {
  return (
    <View style={styles.container}>
      <Text>Agregar un Nuevo Producto</Text>
      {/* Formulario para agregar producto */}
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
