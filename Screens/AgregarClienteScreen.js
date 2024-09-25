import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgregarClienteScreen() {
  return (
    <View style={styles.container}>
      <Text>Agregar Cliente</Text>
      {/* Formulario para agregar cliente */}
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
