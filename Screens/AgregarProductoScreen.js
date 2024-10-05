import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Styles from '../estilos/Styles';  // Importa los estilos globales

export default function AgregarProductoScreen({ navigation }) {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleAgregarProducto = () => {
    if (nombreProducto && descripcion && precio && cantidad) {
      // Simula el registro del producto
      const Productos = { 
        nombre: nombreProducto, 
        descripcion, 
        precio, 
        cantidad 
      };

      // Reiniciar el formulario
      setNombreProducto('');
      setDescripcion('');
      setPrecio('');
      setCantidad('');

      // Navegar a la pantalla de detalles del producto y pasar los datos del producto
      navigation.navigate('DetalleProducto', { producto });
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar un Nuevo Producto</Text>

      {/* Campo para el nombre del producto */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        placeholderTextColor="#ccc"
        value={nombreProducto}
        onChangeText={setNombreProducto}
      />

      {/* Campo para la descripción del producto */}
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#ccc"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Campo para el precio del producto */}
      <TextInput
        style={styles.input}
        placeholder="Precio"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      {/* Campo para la cantidad del producto */}
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />

      {/* Botón para agregar el producto */}
      <TouchableOpacity style={Styles.button} onPress={handleAgregarProducto}>
        <Text style={Styles.buttonText}>Agregar Producto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
});
