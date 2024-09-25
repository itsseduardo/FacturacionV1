import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EditarProductoScreen() {
  return (
    <View style={styles.container}>
      <Text>Editar Producto</Text>
      {/* Formulario para editar producto */}
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
