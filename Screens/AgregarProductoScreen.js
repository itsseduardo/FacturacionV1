import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../credenciales';
import { getAuth } from 'firebase/auth';

export default function AgregarProductoScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState(''); // Nuevo estado para cantidad


  const handleAgregarProducto = async () => {
    const auth = getAuth();
    const user = auth.currentUser; // Obtiene el usuario autenticado actualmente

    if (nombre && precio && descripcion) {
      try {
        // Agrega el producto a Firestore
        await addDoc(collection(db, 'productos'), {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          cantidad: parseInt(cantidad), // Guarda la cantidad como entero
          userId: user.uid, // Almacena el userId del usuario actual
        });

        // Alerta de éxito
        Alert.alert('Producto agregado', `El producto ${nombre} fue agregado con éxito`, [
          {
            text: 'OK',
            onPress: limpiarCampos, // Llama a limpiarCampos cuando se cierre la alerta
          },
        ]);

        // Navega a la pantalla DetalleProductoScreen después de agregar el producto
        navigation.navigate('MainApp', {
          screen: 'ProductosStacks', // El nombre del stack que contiene la pantalla DetalleProductoScreen
          params: {
            screen: 'DetalleProducto', // La pantalla específica dentro del stack
            params: { nombre, precio, descripcion }, // Puedes pasar los parámetros si es necesario
          },
        });
      } catch (error) {
        console.error('Error al agregar el producto: ', error);
      }
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos.');
    }
  };

  // Función para limpiar los campos del formulario
  const limpiarCampos = () => {
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setCantidad(''); // Reinicia la cantidad al agregar un nuevo producto
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
       <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleAgregarProducto}>
        <Text style={styles.buttonText}>Agregar Producto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4c68af',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});