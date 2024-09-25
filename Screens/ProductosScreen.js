import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProductosScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Lista de Productos</Text>
      <Button
        title="Ver Detalle de Producto"
        onPress={() => navigation.navigate('DetalleProducto')}
      />
      <Button
        title="Agregar Producto"
        onPress={() => navigation.navigate('AgregarProducto')}
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
