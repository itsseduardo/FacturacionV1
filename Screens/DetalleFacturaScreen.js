import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetalleFacturaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Detalle de Factura</Text>
      <Button title="Editar Factura" onPress={() => navigation.navigate('EditarFactura')} />
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
