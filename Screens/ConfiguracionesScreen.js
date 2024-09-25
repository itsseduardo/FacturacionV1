import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfiguracionesScreen() {
  return (
    <View style={styles.container}>
      <Text>Configuraciones</Text>
      {/* Aquí podrías agregar más opciones de configuración */}
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
