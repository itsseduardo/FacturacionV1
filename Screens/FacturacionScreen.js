import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function FacturacionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Facturación</Text>
      <Button
        title="Ver Detalle de Factura"
        onPress={() => navigation.navigate('DetalleFactura')}
      />
      <Button
        title="Crear Nueva Factura"
        onPress={() => navigation.navigate('CrearFactura')}
      />
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
