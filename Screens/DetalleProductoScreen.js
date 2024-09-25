import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetalleProductoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Detalle del Producto</Text>
      <Button title="Editar Producto" onPress={() => navigation.navigate('EditarProducto')} />
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
