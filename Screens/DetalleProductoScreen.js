import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetalleProductosScreen({ route, navigation }) {
  const producto = route.params?.Productos;  // Verifica si existen los parámetros

  // Si no se recibió un producto, muestra un mensaje de error
  if (!producto) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró el producto.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Producto</Text>
      <Text>Nombre: {producto.nombre}</Text>
      <Text>Descripción: {producto.descripcion}</Text>
      <Text>Precio: {producto.precio}</Text>
      <Text>Cantidad: {producto.cantidad}</Text>

      {/* Botón para navegar a la pantalla de edición, pasando los detalles del producto */}
      <Button 
        title="Editar Producto" 
        onPress={() => navigation.navigate('EditarProductos', { Productos: producto })} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
